"""
kinematics.py
=============
Kinematikmodul fuer autonome mobile Systeme.
Berechnet Antriebssollwerte fuer Differential-, Ackermann- und Mecanum-Antrieb.

Labor 2: Bahnplanung – Prof. Dr. Thomas Frischgesell
Nachhaltige Ingenieurwissenschaften / Autonome Mobile Systeme
"""

import math


# ---------------------------------------------------------------------------
# Roboterparameter (koennen als Argumente ueberschrieben werden)
# ---------------------------------------------------------------------------
WHEEL_RADIUS = 0.05          # r  [m]  Radradius
WHEEL_BASE   = 0.30          # L  [m]  Spurweite (Abstand linkes/rechtes Rad)
WHEELBASE_ACKERMANN = 0.30   # L  [m]  Radstand (Achsabstand) fuer Ackermann
MECANUM_LX   = 0.15          # a  [m]  halber Laengsabstand der Mecanum-Rader
MECANUM_LY   = 0.10          # b  [m]  halber Querabstand der Mecanum-Rader


# ===========================================================================
# 1. Differentialantrieb
# ===========================================================================

def differential_drive(v: float, omega: float,
                        r: float = WHEEL_RADIUS,
                        L: float = WHEEL_BASE) -> dict:
    """
    Berechnet die Radwinkelgeschwindigkeiten fuer einen Differentialantrieb.

    Modell:
        v     = (r / 2) * (omega_r + omega_l)
        omega = (r / L) * (omega_r - omega_l)

    Aufgeloest nach omega_r und omega_l:
        omega_r = (v + omega * L/2) / r
        omega_l = (v - omega * L/2) / r

    Parameter
    ----------
    v     : Translationsgeschwindigkeit des Roboters [m/s]
    omega : Winkelgeschwindigkeit des Roboters [rad/s]
    r     : Radradius [m]
    L     : Spurweite (Abstand Mitte-links zu Mitte-rechts) [m]

    Rueckgabe
    ---------
    dict mit omega_left [rad/s] und omega_right [rad/s]
    """
    omega_right = (v + omega * L / 2.0) / r
    omega_left  = (v - omega * L / 2.0) / r
    return {
        "omega_left":  omega_left,
        "omega_right": omega_right,
    }


# ===========================================================================
# 2. Ackermann-Antrieb
# ===========================================================================

def ackermann_drive(v: float, omega: float,
                    r: float = WHEEL_RADIUS,
                    L: float = WHEELBASE_ACKERMANN,
                    max_gamma: float = math.radians(45.0)) -> dict:
    """
    Berechnet den Lenkwinkel und die Radwinkelgeschwindigkeit fuer
    einen Ackermann-Antrieb (Einspurmodell).

    Geometrie:
        Kurvenradius R = v / omega  (fuer omega != 0)
        Lenkwinkel   gamma = atan(L / R) = atan(L * omega / v)

    Fuer Geradeausfahrt (omega ~ 0): gamma = 0.

    Der Ackermann-Antrieb kann bei kleiner Translationsgeschwindigkeit und
    grosser Winkelgeschwindigkeit (d.h. sehr kleinem Kurvenradius) den
    Lenkwinkel physikalisch nicht mehr realisieren (max_gamma begrenzt).
    Dieses Problem existiert beim Differentialantrieb nicht.

    Parameter
    ----------
    v         : Translationsgeschwindigkeit [m/s]
    omega     : Winkelgeschwindigkeit [rad/s]
    r         : Radradius [m]
    L         : Radstand (Achsabstand) [m]
    max_gamma : Maximaler Lenkwinkel [rad]

    Rueckgabe
    ---------
    dict mit v_wheel [rad/s], gamma [rad], gamma_deg [deg], feasible [bool]
    """
    if abs(v) < 1e-9:
        # Roboter steht still – kein sinnvoller Lenkwinkel berechenbar
        return {
            "v_wheel":   0.0,
            "gamma":     0.0,
            "gamma_deg": 0.0,
            "feasible":  True,
        }

    if abs(omega) < 1e-9:
        # Geradeausfahrt
        gamma = 0.0
    else:
        # Kurvenradius und Lenkwinkel
        R     = v / omega
        gamma = math.atan2(L, abs(R)) * math.copysign(1.0, omega)

    feasible = abs(gamma) <= max_gamma
    gamma    = max(-max_gamma, min(max_gamma, gamma))  # Begrenzen

    v_wheel = v / r   # Winkelgeschwindigkeit des Antriebsrades

    return {
        "v_wheel":   v_wheel,
        "gamma":     gamma,
        "gamma_deg": math.degrees(gamma),
        "feasible":  feasible,
    }


# ===========================================================================
# 3. Mecanum-Antrieb (Youbot – 4 Raeder, 45°-Rollen)
# ===========================================================================

def mecanum_drive(vx: float, vy: float, omega: float,
                  r: float = WHEEL_RADIUS,
                  lx: float = MECANUM_LX,
                  ly: float = MECANUM_LY) -> dict:
    """
    Berechnet die Radwinkelgeschwindigkeiten eines Mecanum-Roboters (Youbot).

    Das Youbot-Modell hat 4 Mecanum-Raeder mit 45°-Rollen.
    Raderanordnung:
        Rad 1: vorne-links  (FL)
        Rad 2: vorne-rechts (FR)
        Rad 3: hinten-links (RL)
        Rad 4: hinten-rechts(RR)

    Inverse Kinematik (Standardformeln fuer 45°-Mecanum):
        omega1_FL = (1/r) * ( vx - vy - (lx + ly) * omega )
        omega2_FR = (1/r) * ( vx + vy + (lx + ly) * omega )
        omega3_RL = (1/r) * ( vx + vy - (lx + ly) * omega )
        omega4_RR = (1/r) * ( vx - vy + (lx + ly) * omega )

    Ein Mecanum-Roboter kann sich holonomisch bewegen (vy != 0 moeglich).
    Bei reiner Differentialantrieb-Simulation gilt vy = 0.
    Dann vereinfachen sich die Gleichungen, aber der Roboter kann sich
    nicht seitlich bewegen – der Vorteil des Mecanum-Antriebs wird nicht genutzt.

    Parameter
    ----------
    vx    : Vorwaertsgeschwindigkeit im Koerperrahmen [m/s]
    vy    : Seitwärtsgeschwindigkeit im Koerperrahmen [m/s]  (0 bei Diff.-Sim.)
    omega : Winkelgeschwindigkeit [rad/s]
    r     : Radradius [m]
    lx    : Halber Laengsabstand der Raeder (x-Richtung) [m]
    ly    : Halber Querabstand der Raeder (y-Richtung) [m]

    Rueckgabe
    ---------
    dict mit omega1..omega4 [rad/s]
    """
    k = lx + ly   # geometrische Konstante

    omega1 = (vx - vy - k * omega) / r   # FL
    omega2 = (vx + vy + k * omega) / r   # FR
    omega3 = (vx + vy - k * omega) / r   # RL
    omega4 = (vx - vy + k * omega) / r   # RR

    return {
        "omega1_FL": omega1,
        "omega2_FR": omega2,
        "omega3_RL": omega3,
        "omega4_RR": omega4,
    }


# ===========================================================================
# Hilfsfunktionen
# ===========================================================================

def normalize_angle(angle: float) -> float:
    """Normiert einen Winkel auf [-pi, pi]."""
    while angle >  math.pi: angle -= 2.0 * math.pi
    while angle < -math.pi: angle += 2.0 * math.pi
    return angle


def euclidean_distance(x1: float, y1: float, x2: float, y2: float) -> float:
    """Euklidische Distanz zwischen zwei Punkten."""
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)


# ===========================================================================
# Selbsttest
# ===========================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("Kinematik-Selbsttest")
    print("=" * 60)

    # --- Differentialantrieb ---
    print("\n[1] Differentialantrieb")
    result = differential_drive(v=0.5, omega=0.3)
    print(f"  v=0.5 m/s, omega=0.3 rad/s")
    print(f"  omega_left  = {result['omega_left']:.4f} rad/s")
    print(f"  omega_right = {result['omega_right']:.4f} rad/s")

    result2 = differential_drive(v=0.5, omega=0.0)
    print(f"  v=0.5 m/s, omega=0.0 rad/s (Geradeaus)")
    print(f"  omega_left  = {result2['omega_left']:.4f} rad/s")
    print(f"  omega_right = {result2['omega_right']:.4f} rad/s")

    # --- Ackermann ---
    print("\n[2] Ackermann-Antrieb")
    result = ackermann_drive(v=0.5, omega=0.3)
    print(f"  v=0.5 m/s, omega=0.3 rad/s")
    print(f"  v_wheel   = {result['v_wheel']:.4f} rad/s")
    print(f"  gamma     = {result['gamma']:.4f} rad ({result['gamma_deg']:.2f} deg)")
    print(f"  feasible  = {result['feasible']}")

    result = ackermann_drive(v=0.05, omega=0.8)
    print(f"  v=0.05 m/s, omega=0.8 rad/s (enger Kurvenradius)")
    print(f"  gamma     = {result['gamma']:.4f} rad ({result['gamma_deg']:.2f} deg)")
    print(f"  feasible  = {result['feasible']}")

    # --- Mecanum ---
    print("\n[3] Mecanum-Antrieb (Youbot)")
    result = mecanum_drive(vx=0.5, vy=0.0, omega=0.3)
    print(f"  vx=0.5, vy=0.0, omega=0.3")
    print(f"  omega1_FL = {result['omega1_FL']:.4f} rad/s")
    print(f"  omega2_FR = {result['omega2_FR']:.4f} rad/s")
    print(f"  omega3_RL = {result['omega3_RL']:.4f} rad/s")
    print(f"  omega4_RR = {result['omega4_RR']:.4f} rad/s")

    result = mecanum_drive(vx=0.5, vy=0.3, omega=0.0)
    print(f"  vx=0.5, vy=0.3, omega=0.0 (holonomische Fahrt)")
    print(f"  omega1_FL = {result['omega1_FL']:.4f} rad/s")
    print(f"  omega2_FR = {result['omega2_FR']:.4f} rad/s")
    print(f"  omega3_RL = {result['omega3_RL']:.4f} rad/s")
    print(f"  omega4_RR = {result['omega4_RR']:.4f} rad/s")

    print("\n[4] Hilfsfunktionen")
    print(f"  normalize_angle(7.0) = {normalize_angle(7.0):.4f} rad")
    print(f"  euclidean_distance(0,0,3,4) = {euclidean_distance(0,0,3,4):.4f} m")
    print("\nSelbsttest abgeschlossen.")
