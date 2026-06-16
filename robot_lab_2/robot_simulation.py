"""
robot_simulation.py
===================
Hauptskript: Bahnplanung fuer einen Differentialantrieb-Roboter.

Simuliert zwei Fahrten:
  Fahrt 1 – Geradeausfahrt:  Start (0.5, 0.3, 0°) -> Ziel (2.1, 0.3)
  Fahrt 2 – Kurvenfahrt:     Start (0.5, 0.3, 0°) -> Ziel (2.1, 2.3)

Steuerung:    Proportionalregler mit atan2()-Zielverfolgung
Integration:  Euler-Verfahren (dt = 0.05 s)
Stoppbedingung: Abstand zum Ziel < 0.01 m

Labor 2: Bahnplanung – Prof. Dr. Thomas Frischgesell
Nachhaltige Ingenieurwissenschaften / Autonome Mobile Systeme
"""

import math
import sys
import logging
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.animation as animation
from matplotlib.patches import FancyArrowPatch
from dataclasses import dataclass, field
from typing import List, Tuple, Optional

from kinematics import (
    differential_drive, ackermann_drive, mecanum_drive,
    normalize_angle, euclidean_distance,
)
from mqtt_sender import MQTTPublisher

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


# ===========================================================================
# Konfiguration
# ===========================================================================

@dataclass
class SimConfig:
    """Simulationsparameter."""
    dt: float = 0.05          # Zeitschritt [s]
    v_forward: float = 0.30   # Vorwaertsgeschwindigkeit [m/s]
    k_omega: float = 2.0      # Regelverstaerkung fuer Winkelgeschwindigkeit
    omega_max: float = 1.5    # Maximale Winkelgeschwindigkeit [rad/s]
    goal_tolerance: float = 0.01  # Stoppbedingung [m]
    max_steps: int = 5000     # Sicherheitsabbruch

@dataclass
class Pose:
    """Roboterpose im 2D-Raum."""
    x: float
    y: float
    phi: float        # Orientierung [rad]

@dataclass
class DriveState:
    """Antriebszustand zum aktuellen Zeitpunkt."""
    v: float = 0.0
    omega: float = 0.0

@dataclass
class SimResult:
    """Ergebnis einer Simulation."""
    trajectory: List[Tuple[float, float, float]] = field(default_factory=list)
    time_steps: List[float] = field(default_factory=list)
    drive_states: List[DriveState] = field(default_factory=list)
    final_pose: Optional[Pose] = None
    final_distance: float = float("inf")
    total_time: float = 0.0
    steps: int = 0
    success: bool = False


# ===========================================================================
# Regler und Euler-Integration
# ===========================================================================

def compute_control(pose: Pose, goal: Tuple[float, float],
                    cfg: SimConfig) -> DriveState:
    """
    Berechnet Steuergroessen v und omega mittels Proportionalregler.

    Algorithmus (Zielverfolger):
        1. Zielwinkel:  alpha = atan2(dy, dx)
        2. Winkelfehler: delta_phi = normalize(alpha - phi)
        3. omega = k_omega * delta_phi   (begrenzt auf +/- omega_max)
        4. v = v_forward * cos(delta_phi)
           (verringert Vorwaertsgeschwindigkeit bei grossem Winkelfehler)

    Die cos-Gewichtung verhindert, dass der Roboter waehrend einer scharfen
    Kurve zu weit uebers Ziel hinausschiesst.
    """
    dx = goal[0] - pose.x
    dy = goal[1] - pose.y

    alpha     = math.atan2(dy, dx)
    delta_phi = normalize_angle(alpha - pose.phi)

    omega = cfg.k_omega * delta_phi
    omega = max(-cfg.omega_max, min(cfg.omega_max, omega))

    # Vorwaertsgeschwindigkeit wird bei grossem Winkelfehler reduziert
    v = cfg.v_forward * math.cos(delta_phi)
    v = max(0.0, v)   # Kein Rueckwaertsfahren

    return DriveState(v=v, omega=omega)


def euler_step(pose: Pose, state: DriveState, dt: float) -> Pose:
    """
    Fuehrt einen Euler-Integrationsschritt durch.

    Differentialantrieb-Kinematik:
        x_dot   = v * cos(phi)
        y_dot   = v * sin(phi)
        phi_dot = omega

    Euler-Diskretisierung:
        x(t+dt)   = x(t)   + v * cos(phi(t)) * dt
        y(t+dt)   = y(t)   + v * sin(phi(t)) * dt
        phi(t+dt) = phi(t) + omega * dt
    """
    new_x   = pose.x   + state.v * math.cos(pose.phi) * dt
    new_y   = pose.y   + state.v * math.sin(pose.phi) * dt
    new_phi = normalize_angle(pose.phi + state.omega * dt)
    return Pose(new_x, new_y, new_phi)


# ===========================================================================
# Simulation
# ===========================================================================

def simulate(start: Pose, goal: Tuple[float, float],
             cfg: SimConfig, mqtt_pub: Optional[MQTTPublisher] = None,
             drive_type: str = "differential") -> SimResult:
    """
    Fuehrt eine vollstaendige Fahrt von start nach goal durch.

    Parameter
    ----------
    start      : Startpose (x, y, phi)
    goal       : Zielposition (x, y)
    cfg        : Simulationskonfiguration
    mqtt_pub   : MQTT-Publisher (optional, None = kein MQTT)
    drive_type : "differential" | "ackermann" | "mecanum"

    Rueckgabe
    ---------
    SimResult mit Trajektorie und Ergebnisstatistiken
    """
    result = SimResult()
    pose   = Pose(start.x, start.y, start.phi)
    t      = 0.0

    if mqtt_pub:
        mqtt_pub.publish_status("start")

    for step in range(cfg.max_steps):
        dist = euclidean_distance(pose.x, pose.y, goal[0], goal[1])

        # Trajektorie aufzeichnen
        result.trajectory.append((pose.x, pose.y, pose.phi))
        result.time_steps.append(t)

        # Stoppbedingung pruefen
        if dist < cfg.goal_tolerance:
            result.success = True
            logger.info(f"  Ziel erreicht in Schritt {step}, t={t:.2f}s, dist={dist:.4f}m")
            break

        # Regler
        state = compute_control(pose, goal, cfg)
        result.drive_states.append(state)

        # MQTT-Uebertragung
        if mqtt_pub:
            mqtt_pub.publish_pose(pose.x, pose.y, pose.phi)
            if drive_type == "differential":
                mqtt_pub.publish_differential(state.v, state.omega)
            elif drive_type == "ackermann":
                mqtt_pub.publish_ackermann(state.v, state.omega)
            elif drive_type == "mecanum":
                mqtt_pub.publish_mecanum(vx=state.v, vy=0.0, omega=state.omega)

        # Euler-Integration
        pose = euler_step(pose, state, cfg.dt)
        t   += cfg.dt
    else:
        logger.warning(f"  Maximale Schrittanzahl ({cfg.max_steps}) erreicht ohne Ziel!")

    # Letzten Punkt hinzufuegen
    result.trajectory.append((pose.x, pose.y, pose.phi))
    result.time_steps.append(t)
    result.final_pose     = pose
    result.final_distance = euclidean_distance(pose.x, pose.y, goal[0], goal[1])
    result.total_time     = t
    result.steps          = step + 1

    if mqtt_pub:
        mqtt_pub.publish_pose(pose.x, pose.y, pose.phi)
        mqtt_pub.publish_status("stop")

    return result


# ===========================================================================
# Visualisierung
# ===========================================================================

# FE-Spielfeld-Abmessungen (aus PDF-Grafik abgeleitet)
FIELD_XMIN, FIELD_XMAX = 0.0, 3.3
FIELD_YMIN, FIELD_YMAX = 0.0, 4.2
INNER_X1, INNER_X2     = 1.0, 3.0
INNER_Y1, INNER_Y2     = 1.0, 3.0


def _draw_field(ax: plt.Axes):
    """Zeichnet das FE-Spielfeld als Hintergrund."""
    # Aeusserer Rahmen
    outer = mpatches.Rectangle(
        (FIELD_XMIN, FIELD_YMIN),
        FIELD_XMAX - FIELD_XMIN,
        FIELD_YMAX - FIELD_YMIN,
        linewidth=2, edgecolor="#333333", facecolor="#f5f5f0", zorder=0
    )
    ax.add_patch(outer)

    # Inneres Spielfeld (FE-Spielfeld-Bereich)
    inner = mpatches.Rectangle(
        (INNER_X1, INNER_Y1),
        INNER_X2 - INNER_X1,
        INNER_Y2 - INNER_Y1,
        linewidth=1.5, edgecolor="#888888", facecolor="#e8e8e0",
        linestyle="--", zorder=1
    )
    ax.add_patch(inner)
    ax.text(INNER_X1 + 0.4, INNER_Y2 + 0.1, "FE-Spielfeld",
            fontsize=9, color="#555555", zorder=5)

    # Spielfeldmarkierungen (kleine Quadrate wie im PDF)
    marker_positions = [(2.0, 3.0), (1.5, 2.0), (2.5, 1.0), (2.0, 1.0)]
    colors = ["#8bc34a", "#9e9e9e", "#f44336", "#9c27b0"]
    for (mx, my), mc in zip(marker_positions, colors):
        ax.add_patch(mpatches.Rectangle((mx - 0.05, my - 0.05), 0.1, 0.1,
                                        color=mc, zorder=4))

    ax.set_xlim(FIELD_XMIN - 0.1, FIELD_XMAX + 0.1)
    ax.set_ylim(FIELD_YMIN - 0.1, FIELD_YMAX + 0.1)
    ax.set_aspect("equal")
    ax.set_xlabel("x [m]", fontsize=10)
    ax.set_ylabel("y [m]", fontsize=10)
    ax.grid(True, alpha=0.3, zorder=0)
    ax.set_xticks(np.arange(0, 4, 0.5))
    ax.set_yticks(np.arange(0, 5, 0.5))


def _draw_robot(ax: plt.Axes, x: float, y: float, phi: float,
                color: str = "#1565c0", size: float = 0.10):
    """Zeichnet den Roboter als Kreis mit Orientierungspfeil."""
    circle = plt.Circle((x, y), size, color=color, zorder=10, alpha=0.85)
    ax.add_patch(circle)
    arrow_dx = size * 1.6 * math.cos(phi)
    arrow_dy = size * 1.6 * math.sin(phi)
    ax.annotate("", xy=(x + arrow_dx, y + arrow_dy), xytext=(x, y),
                arrowprops=dict(arrowstyle="->", color="white",
                                lw=2.0, mutation_scale=12),
                zorder=11)


def visualize_animation(title: str,
                        start: Pose,
                        goal: Tuple[float, float],
                        result: SimResult,
                        save_path: Optional[str] = None):
    """
    Erstellt eine vollstaendige Echtzeit-Animation der Roboterbewegung.

    Elemente:
        - FE-Spielfeld mit Achsen und Meter-Skalierung
        - Startpunkt (gruenes Dreieck)
        - Zielpunkt (rotes Stern-Symbol)
        - Roboterkoerper (blauer Kreis)
        - Orientierungspfeil
        - Trajektorie (Linie)
        - Informationsbox: Pose, v, omega, Schritt, Distanz
    """
    traj = np.array(result.trajectory)  # shape (N, 3)
    N    = len(traj)

    fig, ax = plt.subplots(figsize=(9, 10))
    fig.patch.set_facecolor("#fafafa")
    _draw_field(ax)
    ax.set_title(f"Autonome Mobile Systeme – Labor 2\n{title}", fontsize=12,
                 fontweight="bold", pad=12)

    # --- Statische Elemente ---
    ax.plot(start.x, start.y, "g^", markersize=12, zorder=8, label="Start")
    ax.plot(goal[0], goal[1], "r*", markersize=15, zorder=8, label="Ziel")
    ax.annotate(f"Start\n({start.x},{start.y})", (start.x, start.y),
                textcoords="offset points", xytext=(-45, 8), fontsize=8, color="green")
    ax.annotate(f"Ziel\n({goal[0]},{goal[1]})", (goal[0], goal[1]),
                textcoords="offset points", xytext=(8, 5), fontsize=8, color="red")

    # --- Dynamische Elemente ---
    traj_line, = ax.plot([], [], "b-", linewidth=1.5, alpha=0.7,
                         label="Trajektorie", zorder=6)

    robot_circle = plt.Circle((start.x, start.y), 0.10,
                               color="#1565c0", alpha=0.85, zorder=10)
    ax.add_patch(robot_circle)

    arrow_artist = FancyArrowPatch(
        (start.x, start.y),
        (start.x + 0.16, start.y),
        arrowstyle="->", color="white", linewidth=2.0,
        mutation_scale=12, zorder=11
    )
    ax.add_patch(arrow_artist)

    # Informationsbox
    info_text = ax.text(
        0.02, 0.98, "", transform=ax.transAxes,
        verticalalignment="top", fontsize=8.5,
        bbox=dict(boxstyle="round,pad=0.4", facecolor="white",
                  edgecolor="#cccccc", alpha=0.92),
        zorder=20, fontfamily="monospace"
    )

    ax.legend(loc="upper right", fontsize=8)

    def _init():
        traj_line.set_data([], [])
        info_text.set_text("")
        return traj_line, info_text, robot_circle, arrow_artist

    def _update(frame: int):
        idx = min(frame, N - 1)
        x, y, phi = traj[idx]

        # Trajektorie
        traj_line.set_data(traj[:idx + 1, 0], traj[:idx + 1, 1])

        # Roboter
        robot_circle.center = (x, y)
        tip_x = x + 0.16 * math.cos(phi)
        tip_y = y + 0.16 * math.sin(phi)
        arrow_artist.set_positions((x, y), (tip_x, tip_y))

        # Steuergroessen
        if idx < len(result.drive_states):
            v_now = result.drive_states[idx].v
            w_now = result.drive_states[idx].omega
        else:
            v_now, w_now = 0.0, 0.0

        dist = euclidean_distance(x, y, goal[0], goal[1])
        t_now = result.time_steps[idx] if idx < len(result.time_steps) else 0.0

        info = (
            f"Schritt:  {idx:4d}\n"
            f"Zeit:     {t_now:6.2f} s\n"
            f"x:        {x:6.3f} m\n"
            f"y:        {y:6.3f} m\n"
            f"phi:      {math.degrees(phi):6.2f} °\n"
            f"v:        {v_now:6.3f} m/s\n"
            f"omega:    {w_now:6.3f} rad/s\n"
            f"Dist:     {dist:6.4f} m"
        )
        info_text.set_text(info)
        return traj_line, info_text, robot_circle, arrow_artist

    interval_ms = max(20, int(1000 * 0.05 / 3))   # ~3x Echtzeit
    anim = animation.FuncAnimation(
        fig, _update, frames=N,
        init_func=_init, interval=interval_ms,
        blit=True, repeat=False
    )

    if save_path:
        try:
            anim.save(save_path, writer="pillow", fps=20, dpi=100)
            logger.info(f"Animation gespeichert: {save_path}")
        except Exception as exc:
            logger.warning(f"Speichern fehlgeschlagen: {exc}")

    return fig, anim


def visualize_static(title: str,
                     start: Pose,
                     goal: Tuple[float, float],
                     result: SimResult,
                     ax: Optional[plt.Axes] = None) -> plt.Axes:
    """
    Statische Visualisierung der vollstaendigen Trajektorie.
    Wird fuer den Vergleich beider Fahrten nebeneinander genutzt.
    """
    if ax is None:
        _, ax = plt.subplots(figsize=(7, 8))
    _draw_field(ax)
    ax.set_title(title, fontsize=10, fontweight="bold")

    traj = np.array(result.trajectory)
    ax.plot(traj[:, 0], traj[:, 1], "b-", linewidth=2, label="Trajektorie", zorder=6)
    ax.plot(start.x, start.y, "g^", markersize=11, zorder=8, label="Start")
    ax.plot(goal[0], goal[1], "r*", markersize=14, zorder=8, label="Ziel")

    # Orientierungspfeile entlang der Trajektorie
    step = max(1, len(traj) // 15)
    for x, y, phi in traj[::step]:
        ax.annotate("", xy=(x + 0.12 * math.cos(phi), y + 0.12 * math.sin(phi)),
                    xytext=(x, y),
                    arrowprops=dict(arrowstyle="->", color="#e65100",
                                   lw=1.2, mutation_scale=8), zorder=7)

    # Endpose
    fp = result.final_pose
    _draw_robot(ax, fp.x, fp.y, fp.phi, color="#1565c0")

    info = (f"Endpose: ({fp.x:.3f}, {fp.y:.3f}, {math.degrees(fp.phi):.1f}°)\n"
            f"Abstand: {result.final_distance:.4f} m\n"
            f"Zeit:    {result.total_time:.2f} s | Schritte: {result.steps}")
    ax.text(0.02, 0.02, info, transform=ax.transAxes,
            fontsize=7.5, verticalalignment="bottom",
            bbox=dict(boxstyle="round,pad=0.3", facecolor="white",
                      edgecolor="#aaaaaa", alpha=0.9),
            fontfamily="monospace", zorder=20)

    ax.legend(loc="upper right", fontsize=8)
    return ax


# ===========================================================================
# Hauptprogramm
# ===========================================================================

def run_simulation(interactive: bool = True, save_gif: bool = False):
    """Fuehrt beide Fahrten durch und visualisiert die Ergebnisse."""

    cfg = SimConfig()

    # MQTT (Dry-Run wenn kein Broker verfuegbar)
    mqtt_pub = MQTTPublisher(broker="localhost", port=1883, dry_run=True)
    mqtt_pub.connect()

    print("=" * 65)
    print("AMS Labor 2 – Bahnplanung Differentialantrieb")
    print("=" * 65)

    # ------------------------------------------------------------------
    # Fahrt 1: Geradeausfahrt
    # ------------------------------------------------------------------
    start1 = Pose(x=0.5, y=0.3, phi=0.0)
    goal1  = (2.1, 0.3)

    print(f"\nFahrt 1 – Geradeaus")
    print(f"  Start: ({start1.x}, {start1.y}, {math.degrees(start1.phi):.1f}°)")
    print(f"  Ziel:  ({goal1[0]}, {goal1[1]})")

    result1 = simulate(start1, goal1, cfg, mqtt_pub, drive_type="differential")

    fp1 = result1.final_pose
    print(f"  Endpose:     ({fp1.x:.4f}, {fp1.y:.4f}, {math.degrees(fp1.phi):.2f}°)")
    print(f"  Enddistanz:  {result1.final_distance:.6f} m  {'OK' if result1.success else 'NICHT OK'}")
    print(f"  Fahrzeit:    {result1.total_time:.2f} s")
    print(f"  Schritte:    {result1.steps}")

    # ------------------------------------------------------------------
    # Fahrt 2: Kurvenfahrt
    # ------------------------------------------------------------------
    start2 = Pose(x=0.5, y=0.3, phi=0.0)
    goal2  = (2.1, 2.3)

    print(f"\nFahrt 2 – Kurvenfahrt")
    print(f"  Start: ({start2.x}, {start2.y}, {math.degrees(start2.phi):.1f}°)")
    print(f"  Ziel:  ({goal2[0]}, {goal2[1]})")

    result2 = simulate(start2, goal2, cfg, mqtt_pub, drive_type="differential")

    fp2 = result2.final_pose
    print(f"  Endpose:     ({fp2.x:.4f}, {fp2.y:.4f}, {math.degrees(fp2.phi):.2f}°)")
    print(f"  Enddistanz:  {result2.final_distance:.6f} m  {'OK' if result2.success else 'NICHT OK'}")
    print(f"  Fahrzeit:    {result2.total_time:.2f} s")
    print(f"  Schritte:    {result2.steps}")

    mqtt_pub.disconnect()

    # ------------------------------------------------------------------
    # Validierung
    # ------------------------------------------------------------------
    print("\n" + "=" * 65)
    print("Validierungsbericht")
    print("=" * 65)
    tol = cfg.goal_tolerance
    for name, res in [("Fahrt 1 (Gerade)", result1), ("Fahrt 2 (Kurve)", result2)]:
        status = "BESTANDEN" if res.final_distance < tol else "FEHLGESCHLAGEN"
        print(f"  {name}: Abstand={res.final_distance:.6f}m, Grenze={tol}m -> {status}")

    # ------------------------------------------------------------------
    # Visualisierung: statische Uebersicht beider Fahrten
    # ------------------------------------------------------------------
    fig_static, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 9))
    fig_static.suptitle("AMS Labor 2 – Bahnplanung: Trajektorien beider Fahrten",
                         fontsize=13, fontweight="bold")

    visualize_static("Fahrt 1 – Geradeausfahrt\n"
                     "Start:(0.5,0.3,0°) → Ziel:(2.1,0.3)",
                     start1, goal1, result1, ax=ax1)
    visualize_static("Fahrt 2 – Kurvenfahrt\n"
                     "Start:(0.5,0.3,0°) → Ziel:(2.1,2.3)",
                     start2, goal2, result2, ax=ax2)

    plt.tight_layout()
    fig_static.savefig("trajectories_overview.png", dpi=120, bbox_inches="tight")
    logger.info("Uebersicht gespeichert: trajectories_overview.png")

    # ------------------------------------------------------------------
    # Animationen
    # ------------------------------------------------------------------
    if interactive:
        print("\nStarte Animationen (Fenster schliessen zum Beenden)...")

        fig1, anim1 = visualize_animation(
            "Fahrt 1 – Geradeausfahrt  |  Start:(0.5,0.3,0°) → Ziel:(2.1,0.3)",
            start1, goal1, result1,
            save_path="fahrt1_gerade.gif" if save_gif else None
        )
        plt.figure(fig1.number)
        plt.tight_layout()

        fig2, anim2 = visualize_animation(
            "Fahrt 2 – Kurvenfahrt  |  Start:(0.5,0.3,0°) → Ziel:(2.1,2.3)",
            start2, goal2, result2,
            save_path="fahrt2_kurve.gif" if save_gif else None
        )
        plt.figure(fig2.number)
        plt.tight_layout()

        plt.show()
    else:
        # Nicht-interaktiver Modus: GIFs speichern
        print("\nNicht-interaktiver Modus – speichere Animationen...")
        _, anim1 = visualize_animation(
            "Fahrt 1 – Geradeausfahrt",
            start1, goal1, result1, save_path="fahrt1_gerade.gif"
        )
        _, anim2 = visualize_animation(
            "Fahrt 2 – Kurvenfahrt",
            start2, goal2, result2, save_path="fahrt2_kurve.gif"
        )
        plt.close("all")

    return result1, result2


# ---------------------------------------------------------------------------
# Kinematikvergleich (Bonus – Diskussion Ackermann/Mecanum)
# ---------------------------------------------------------------------------

def print_drive_comparison(v: float = 0.3, omega: float = 0.8):
    """
    Zeigt Antriebssollwerte fuer alle drei Antriebstypen im Vergleich.
    Verdeutlicht das Problem des Ackermann-Antriebs bei kleinem Kurvenradius.
    """
    print("\n" + "=" * 65)
    print(f"Antriebsvergleich: v={v} m/s, omega={omega} rad/s")
    print("=" * 65)

    diff = differential_drive(v, omega)
    print(f"\n[Differentialantrieb]")
    print(f"  omega_left  = {diff['omega_left']:+.4f} rad/s")
    print(f"  omega_right = {diff['omega_right']:+.4f} rad/s")
    print(f"  Problem: Keines – kann auf der Stelle drehen (R=0 moeglich)")

    ack = ackermann_drive(v, omega)
    print(f"\n[Ackermann-Antrieb]")
    print(f"  v_wheel   = {ack['v_wheel']:+.4f} rad/s")
    print(f"  gamma     = {ack['gamma_deg']:+.2f} deg")
    print(f"  feasible  = {ack['feasible']}")
    R = v / omega if abs(omega) > 1e-9 else float("inf")
    print(f"  Kurvenradius R = {R:.4f} m")
    if not ack["feasible"]:
        print(f"  PROBLEM: Lenkwinkel > 45° physikalisch nicht realisierbar!")
    else:
        print(f"  PROBLEM: Nullradius-Wenden unmoeglich, minimaler Wendekreis R_min > 0")

    mec = mecanum_drive(vx=v, vy=0.0, omega=omega)
    print(f"\n[Mecanum-Antrieb (Youbot)]")
    for k, val in mec.items():
        print(f"  {k} = {val:+.4f} rad/s")
    print(f"  Problem: Keine holonome Simulation aus Differentialantrieb ableitbar")
    print(f"           (vy=0 wird erzwungen – Vorteil des Mecanum nicht genutzt)")
    print(f"           Regelung mit atan2 fuer Omnidirektionalfahrt ungeeignet")


# ===========================================================================
# Entry Point
# ===========================================================================

if __name__ == "__main__":
    # Bestimme ob interaktiv oder Batch-Modus
    interactive = "--no-display" not in sys.argv
    save_gif    = "--save-gif"   in sys.argv

    if not interactive:
        matplotlib.use("Agg")

    result1, result2 = run_simulation(interactive=interactive, save_gif=save_gif)
    print_drive_comparison(v=0.3, omega=0.8)

    print("\n" + "=" * 65)
    print("Simulation abgeschlossen.")
    print("=" * 65)
