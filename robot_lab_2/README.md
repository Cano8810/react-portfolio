# AMS Labor 2 – Bahnplanung für autonome mobile Roboter

**Hochschule:** Prof. Dr. Thomas Frischgesell – Nachhaltige Ingenieurwissenschaften  
**Fach:** Autonome Mobile Systeme  
**Labor:** 2 – Bahnplanung

---

## Projektstruktur

```
robot_lab_2/
├── robot_simulation.py   # Hauptskript: Simulation, Regler, Visualisierung
├── kinematics.py         # Kinematikberechnungen (Diff., Ackermann, Mecanum)
├── mqtt_sender.py        # MQTT-Publisher (paho-mqtt)
├── theorie.md            # Theoretische Grundlagen und Vergleich der Antriebe
├── requirements.txt      # Python-Abhängigkeiten
└── README.md             # Diese Datei
```

---

## Aufgaben und Umsetzung

### Aufgabe 1 – Bahnplanung

Simuliert werden zwei Fahrten eines Differentialantrieb-Roboters:

| Fahrt | Start | Ziel | Art |
|---|---|---|---|
| Fahrt 1 | (0.5, 0.3, 0°) | (2.1, 0.3) | Geradeausfahrt |
| Fahrt 2 | (0.5, 0.3, 0°) | (2.1, 2.3) | Kurvenfahrt |

**Stoppbedingung:** Euklidischer Abstand zum Ziel < 0,01 m

**Regler:** Proportionalregler mit atan2-Zielverfolgung  
**Integration:** Explizites Euler-Verfahren (dt = 0,05 s)

### Aufgabe 2 – Visualisierung

- Echtzeit-Animation mit `matplotlib.animation.FuncAnimation`
- FE-Spielfeld mit Achsen, Meter-Skalierung, Start-/Zielpunkt
- Roboterdarstellung: Kreis + Orientierungspfeil
- Live-Informationsbox: Pose, v, ω, Schritt, Distanz
- Statische Trajektorienübersicht beider Fahrten

### Aufgabe 3 – MQTT

Pub-/Sub-Kommunikation über paho-mqtt:

| Topic | Inhalt |
|---|---|
| `R1/Pose` | Aktuelle Pose (x, y, φ) |
| `R1/Status` | start / stop |
| `R1/Lenkwinkel` | Lenkwinkel Ackermann (γ) |
| `R1/Geschwindigkeit` | Radgeschwindigkeit Ackermann |
| `R1/Antrieb/1..4` | Radwinkelgeschwindigkeiten |

---

## Installation

```bash
pip install -r requirements.txt
```

Optional: MQTT-Broker lokal starten (z.B. Mosquitto):
```bash
# Ubuntu/Debian
sudo apt-get install mosquitto mosquitto-clients
mosquitto -v
```

---

## Ausführung

```bash
cd robot_lab_2

# Interaktiv (mit Animationen):
python robot_simulation.py

# Batch-Modus (ohne Display, speichert PNGs/GIFs):
python robot_simulation.py --no-display --save-gif

# Kinematik-Selbsttest:
python kinematics.py

# MQTT-Selbsttest (Dry-Run):
python mqtt_sender.py
```

---

## Ergebnisse

### Fahrt 1 – Geradeausfahrt

- Endpose: nahe (2.1, 0.3, 0°)
- Enddistanz: < 0,01 m ✅
- Fahrzeit: ~5 s

### Fahrt 2 – Kurvenfahrt

- Endpose: nahe (2.1, 2.3)
- Enddistanz: < 0,01 m ✅
- Fahrzeit: ~15 s

---

## Probleme bei Ackermann- und Mecanum-Antrieb

**Ackermann:**
- Minimaler Kurvenradius > 0 (kein Nullradius-Wenden)
- Bei kleiner v und großer ω wird der erforderliche Lenkwinkel unphysikalisch groß
- atan2-Regler direkt nicht verwendbar

**Mecanum:**
- Vorteil (holonome Bewegung) wird nicht ausgenutzt, wenn vy = 0 erzwungen
- Regler müsste für omnidirektionale Fahrt neu ausgelegt werden
- Rollenschlupf nicht im Modell erfasst

Detaillierte Diskussion: siehe [theorie.md](theorie.md)

---

## Technische Details

| Parameter | Wert |
|---|---|
| Zeitschritt dt | 0,05 s |
| Vorwärtsgeschwindigkeit v | 0,30 m/s |
| Regelverst. K_ω | 2,0 |
| Max. Winkelgeschw. | 1,5 rad/s |
| Toleranz Ziel | 0,01 m |
| Radradius r | 0,05 m |
| Spurweite L | 0,30 m |
