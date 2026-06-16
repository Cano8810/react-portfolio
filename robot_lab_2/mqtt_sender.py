"""
mqtt_sender.py
==============
MQTT-Publisher fuer die Robotersimulation.
Uebertraegt Pose, Status und Antriebssollwerte auf den MQTT-Broker.

Topics (gemaess Aufgabenstellung):
    R1/Pose            – aktuelle Roboterpose (x, y, phi)
    R1/Status          – Steuerbefehle: start / stop
    R1/Lenkwinkel      – Lenkwinkel (Ackermann)
    R1/Geschwindigkeit – Fahrgeschwindigkeit (Ackermann)
    R1/Antrieb/1..4    – Radwinkelgeschwindigkeiten

Labor 2: Bahnplanung – Prof. Dr. Thomas Frischgesell
"""

import json
import time
import logging
from typing import Optional

try:
    import paho.mqtt.client as mqtt
    PAHO_AVAILABLE = True
except ImportError:
    PAHO_AVAILABLE = False

from kinematics import differential_drive, ackermann_drive, mecanum_drive

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# MQTT Topic-Konstanten (gemaess Aufgabenstellung)
# ---------------------------------------------------------------------------
T_POS = "R1/Pose"
T_STA = "R1/Status"
T_GAM = "R1/Lenkwinkel"
T_VEL = "R1/Geschwindigkeit"
T_OM  = "R1/Antrieb/"          # vollstaendiges Topic: T_OM + str(n)


# ---------------------------------------------------------------------------
# MQTTPublisher
# ---------------------------------------------------------------------------

class MQTTPublisher:
    """
    Verwaltet die MQTT-Verbindung und publiziert Roboterdaten.

    Falls kein Broker erreichbar ist, werden Nachrichten im 'dry_run'-Modus
    nur geloggt (kein Verbindungsfehler).
    """

    def __init__(self,
                 broker: str = "localhost",
                 port: int = 1883,
                 client_id: str = "RobotSim_R1",
                 dry_run: bool = False):
        """
        Parameter
        ----------
        broker    : Hostname oder IP des MQTT-Brokers
        port      : TCP-Port des Brokers (Standard: 1883)
        client_id : Client-ID fuer den Broker
        dry_run   : Bei True wird keine Verbindung aufgebaut (nur Logging)
        """
        self.broker    = broker
        self.port      = port
        self.client_id = client_id
        self.dry_run   = dry_run or not PAHO_AVAILABLE
        self._client: Optional[object] = None
        self._connected = False

        if not PAHO_AVAILABLE:
            logger.warning("paho-mqtt nicht installiert – Dry-Run-Modus aktiv.")

    def connect(self) -> bool:
        """Baut Verbindung zum MQTT-Broker auf. Gibt True bei Erfolg zurueck."""
        if self.dry_run:
            logger.info("[MQTT dry-run] Verbindung simuliert.")
            self._connected = True
            return True
        try:
            self._client = mqtt.Client(client_id=self.client_id)
            self._client.on_connect    = self._on_connect
            self._client.on_disconnect = self._on_disconnect
            self._client.connect(self.broker, self.port, keepalive=60)
            self._client.loop_start()
            time.sleep(0.3)   # Verbindungsaufbau abwarten
            return self._connected
        except Exception as exc:
            logger.error(f"MQTT-Verbindung fehlgeschlagen: {exc}")
            self._connected = False
            return False

    def disconnect(self):
        """Trennt die MQTT-Verbindung sauber."""
        if self._client and not self.dry_run:
            self._client.loop_stop()
            self._client.disconnect()
        self._connected = False
        logger.info("MQTT-Verbindung getrennt.")

    # ------------------------------------------------------------------
    # Publish-Methoden
    # ------------------------------------------------------------------

    def publish_pose(self, x: float, y: float, phi: float):
        """Publiziert die aktuelle Roboterpose auf R1/Pose."""
        payload = json.dumps({
            "x":   round(x, 4),
            "y":   round(y, 4),
            "phi": round(phi, 4),
        })
        self._publish(T_POS, payload)

    def publish_status(self, status: str):
        """Publiziert Statusnachricht ('start' oder 'stop') auf R1/Status."""
        payload = json.dumps({"status": status})
        self._publish(T_STA, payload)

    def publish_differential(self, v: float, omega: float):
        """
        Berechnet Radwinkelgeschwindigkeiten fuer Differentialantrieb und
        publiziert diese auf R1/Antrieb/1 und R1/Antrieb/2.
        """
        kin = differential_drive(v, omega)
        self._publish(T_OM + "1", json.dumps({
            "omega_left": round(kin["omega_left"], 4)
        }))
        self._publish(T_OM + "2", json.dumps({
            "omega_right": round(kin["omega_right"], 4)
        }))
        return kin

    def publish_ackermann(self, v: float, omega: float):
        """
        Berechnet Lenkwinkel und Radgeschwindigkeit fuer Ackermann-Antrieb
        und publiziert auf R1/Lenkwinkel und R1/Geschwindigkeit.
        """
        kin = ackermann_drive(v, omega)
        self._publish(T_GAM, json.dumps({
            "gamma":     round(kin["gamma"], 4),
            "gamma_deg": round(kin["gamma_deg"], 2),
            "feasible":  kin["feasible"],
        }))
        self._publish(T_VEL, json.dumps({
            "v_wheel": round(kin["v_wheel"], 4)
        }))
        return kin

    def publish_mecanum(self, vx: float, vy: float, omega: float):
        """
        Berechnet Radwinkelgeschwindigkeiten fuer Mecanum-Antrieb (Youbot)
        und publiziert auf R1/Antrieb/1 .. R1/Antrieb/4.
        """
        kin = mecanum_drive(vx, vy, omega)
        for idx, key in enumerate(
            ["omega1_FL", "omega2_FR", "omega3_RL", "omega4_RR"], start=1
        ):
            self._publish(T_OM + str(idx), json.dumps({
                "omega": round(kin[key], 4),
                "wheel": key,
            }))
        return kin

    def publish_all(self, x: float, y: float, phi: float,
                    v: float, omega: float):
        """
        Komfort-Methode: Publiziert Pose + alle Antriebsdaten in einem Aufruf.
        """
        self.publish_pose(x, y, phi)
        self.publish_differential(v, omega)
        self.publish_ackermann(v, omega)
        self.publish_mecanum(vx=v, vy=0.0, omega=omega)

    # ------------------------------------------------------------------
    # Interne Methoden
    # ------------------------------------------------------------------

    def _publish(self, topic: str, payload: str):
        """Sendet eine Nachricht an den Broker oder loggt sie im Dry-Run-Modus."""
        if self.dry_run or not self._connected:
            logger.debug(f"[MQTT dry-run] {topic}: {payload}")
            return
        try:
            self._client.publish(topic, payload, qos=1)
        except Exception as exc:
            logger.error(f"Publish-Fehler ({topic}): {exc}")

    def _on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            self._connected = True
            logger.info(f"MQTT verbunden mit {self.broker}:{self.port}")
        else:
            logger.error(f"MQTT Verbindungsfehler, rc={rc}")

    def _on_disconnect(self, client, userdata, rc):
        self._connected = False
        logger.warning("MQTT getrennt.")


# ---------------------------------------------------------------------------
# Standalone-Test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG,
                        format="%(levelname)s %(name)s: %(message)s")

    print("=" * 60)
    print("MQTT-Publisher Selbsttest (Dry-Run)")
    print("=" * 60)

    pub = MQTTPublisher(dry_run=True)
    pub.connect()
    pub.publish_status("start")

    print("\n[Pose]")
    pub.publish_pose(x=0.5, y=0.3, phi=0.0)

    print("\n[Differentialantrieb]")
    kin = pub.publish_differential(v=0.3, omega=0.2)
    print(f"  omega_left  = {kin['omega_left']:.4f} rad/s")
    print(f"  omega_right = {kin['omega_right']:.4f} rad/s")

    print("\n[Ackermann]")
    kin = pub.publish_ackermann(v=0.3, omega=0.2)
    print(f"  v_wheel = {kin['v_wheel']:.4f} rad/s")
    print(f"  gamma   = {kin['gamma_deg']:.2f} deg")
    print(f"  feasible= {kin['feasible']}")

    print("\n[Mecanum Youbot]")
    kin = pub.publish_mecanum(vx=0.3, vy=0.0, omega=0.2)
    for k, val in kin.items():
        print(f"  {k} = {val:.4f} rad/s")

    pub.publish_status("stop")
    pub.disconnect()
    print("\nSelbsttest abgeschlossen.")
