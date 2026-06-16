# Theorie: Antriebssysteme autonomer mobiler Roboter

**Labor 2: Bahnplanung – AMS**  
**Prof. Dr. Thomas Frischgesell**  
**Nachhaltige Ingenieurwissenschaften**

---

## 1. Differentialantrieb

### Prinzip

Ein Differentialantriebsroboter bewegt sich durch die Drehzahldifferenz zweier
unabhängig angetriebener Räder auf einer gemeinsamen Achse.
Ein oder mehrere passive Stützräder (Caster) sorgen für Stabilität.

### Kinematisches Modell

Die Roboterpose wird beschrieben durch:

$$\mathbf{q} = \begin{pmatrix} x \\ y \\ \varphi \end{pmatrix}$$

mit $x, y$ als Weltkoordinaten und $\varphi$ als Orientierungswinkel.

**Vorwärtskinematik** (nichtholonomes Modell):

$$\dot{x}   = v \cdot \cos\varphi$$
$$\dot{y}   = v \cdot \sin\varphi$$
$$\dot{\varphi} = \omega$$

**Zusammenhang** zwischen Robotergeschwindigkeit $(v, \omega)$ und Radwinkelgeschwindigkeiten:

$$v     = \frac{r}{2}(\omega_R + \omega_L)$$
$$\omega = \frac{r}{L}(\omega_R - \omega_L)$$

**Inverse Kinematik** (Sollwertberechnung für die Motoren):

$$\omega_R = \frac{v + \omega \cdot L/2}{r}$$
$$\omega_L = \frac{v - \omega \cdot L/2}{r}$$

mit:
- $r$ = Radradius [m]
- $L$ = Spurweite (Abstand linkes/rechtes Rad) [m]

### Zielverfolgung mit atan2

Der Regler berechnet den Winkel zur Zielposition und minimiert den Winkelfehler:

$$\alpha = \text{atan2}(y_{\text{Ziel}} - y, \; x_{\text{Ziel}} - x)$$
$$\Delta\varphi = \text{normalize}(\alpha - \varphi) \in [-\pi, \pi]$$
$$\omega = K_\omega \cdot \Delta\varphi \qquad (\text{Proportionalregler})$$
$$v = v_{\text{max}} \cdot \cos(\Delta\varphi)$$

Die cos-Gewichtung reduziert die Vorwärtsgeschwindigkeit bei großem Winkelfehler –
der Roboter dreht sich zuerst und fährt dann geradeaus.

### Euler-Integration

Die kontinuierlichen Differentialgleichungen werden mit dem expliziten Euler-Verfahren
diskretisiert:

$$x(t + \Delta t)       = x(t)       + v \cdot \cos\varphi(t) \cdot \Delta t$$
$$y(t + \Delta t)       = y(t)       + v \cdot \sin\varphi(t) \cdot \Delta t$$
$$\varphi(t + \Delta t) = \varphi(t) + \omega \cdot \Delta t$$

**Vorteile:** Einfach, geringer Rechenaufwand.  
**Nachteile:** Akkumulierter Fehler bei großem $\Delta t$; für präzise Simulation
sollte $\Delta t \leq 0{,}05\,\text{s}$ gewählt werden.

### Stoppbedingung

Der Roboter hält an, wenn die euklidische Distanz zum Ziel unterschritten wird:

$$d = \sqrt{(x_{\text{Ziel}} - x)^2 + (y_{\text{Ziel}} - y)^2} < 0{,}01\,\text{m}$$

### Vorteile des Differentialantriebs

| Merkmal | Bewertung |
|---|---|
| Nullradius-Wenden (Drehung auf der Stelle) | ✅ möglich |
| Mechanische Einfachheit | ✅ gering (2 Antriebe) |
| Steuerungsaufwand | ✅ gering |
| Holonome Bewegung (seitlich) | ❌ nicht möglich |
| Geradeausfahrt ohne Drift | ⚠️ bedingt (Radkalibrierung nötig) |

---

## 2. Ackermann-Antrieb

### Prinzip

Das Ackermann-Lenkgeometrie-Prinzip (Einspurmodell) modelliert ein Fahrzeug mit
Hinterradantrieb und Vorderradlenkung. Die geometrische Bedingung garantiert,
dass alle Räder in einer Kurve um denselben Mittelpunkt kreisen – kein Schlupf.

### Kinematisches Modell (Einspurmodell)

**Kurvenradius:**
$$R = \frac{v}{\omega}$$

**Lenkwinkel:**
$$\gamma = \arctan\!\left(\frac{L}{R}\right) = \arctan\!\left(\frac{L \cdot \omega}{v}\right)$$

**Radwinkelgeschwindigkeit** des Antriebsrades:
$$\omega_{\text{Rad}} = \frac{v}{r}$$

### Probleme bei der Bahnplanung aus Differentialantriebssimulation

1. **Minimaler Kurvenradius:** Der Lenkwinkel $\gamma$ ist physikalisch auf
   $\gamma_{\max} \approx 30°$–$45°$ begrenzt. Bei kleiner Fahrgeschwindigkeit $v$
   und großer Winkelgeschwindigkeit $\omega$ (kleiner Kurvenradius $R$) übersteigt
   der erforderliche Lenkwinkel dieses Limit → **nicht realisierbar**.

2. **Kein Nullradius-Wenden:** Ein Ackermann-Fahrzeug kann **nicht auf der Stelle
   drehen** ($R > 0$ zwingend). Die atan2-basierte Zielverfolgung aus der
   Differentialantrieb-Simulation kann in dieser Form nicht direkt übernommen werden.

3. **Rückwärtsfahren problematisch:** Mehrdeutigkeit des Lenkwinkels bei
   Vorwärts- vs. Rückwärtsfahrt erfordert zusätzliche Logik.

---

## 3. Mecanum-Antrieb (Youbot)

### Prinzip

Mecanum-Räder besitzen schräg angeordnete Passiv-Rollen (45°), die eine Kraftkomponente
senkrecht zur Fahrtrichtung erzeugen. Durch Überlagerung der vier Radkräfte kann
sich der Roboter **holonomisch** (in jede Richtung ohne Vorausdrehen) bewegen.

### Inverse Kinematik (Youbot mit 4 Mecanum-Rädern)

Raderanordnung:
- Rad 1: vorne-links (FL), Rad 2: vorne-rechts (FR)
- Rad 3: hinten-links (RL), Rad 4: hinten-rechts (RR)

Geometrische Konstante: $k = l_x + l_y$ (halbem Längs- + halbem Querabstand der Räder)

$$\omega_1^{FL} = \frac{1}{r}(v_x - v_y - k \cdot \omega)$$
$$\omega_2^{FR} = \frac{1}{r}(v_x + v_y + k \cdot \omega)$$
$$\omega_3^{RL} = \frac{1}{r}(v_x + v_y - k \cdot \omega)$$
$$\omega_4^{RR} = \frac{1}{r}(v_x - v_y + k \cdot \omega)$$

### Probleme bei der Bahnplanung aus Differentialantriebssimulation

1. **Seitliche Bewegung nicht genutzt:** In der Simulation gilt $v_y = 0$, weil
   der Differentialantriebsregler keine seitliche Komponente erzeugt. Der
   entscheidende Vorteil des Mecanum-Antriebs (holonome Bewegung) wird **nicht genutzt**.

2. **Regler nicht adaptiert:** Die atan2-Zielverfolgung ist für nichtholonome
   Systeme ausgelegt. Ein Mecanum-Roboter könnte direkt (ohne Drehen) auf das Ziel
   zufahren – dafür wäre ein anderer Regler nötig (z.B. Zerlegung von $\Delta\mathbf{r}$
   in Körperkoordinaten).

3. **Rollenschlupf und Modellgenauigkeit:** Das ideale Rollenmodell setzt schlupffreien
   Kontakt voraus. In der Praxis entstehen durch die Passiv-Rollen Schlupfverluste,
   die das Kinematikmodell nicht erfasst.

---

## 4. Vergleich aller drei Antriebstypen

| Merkmal | Differentialantrieb | Ackermann | Mecanum |
|---|:---:|:---:|:---:|
| Nullradius-Drehen | ✅ | ❌ | ✅ |
| Seitwärtsfahrt | ❌ | ❌ | ✅ |
| Mechanische Komplexität | ⬇️ gering | ➡️ mittel | ⬆️ hoch |
| Maximale Geschwindigkeit | ➡️ mittel | ⬆️ hoch | ⬇️ gering |
| Geländegängigkeit | ⬆️ gut | ⬆️ gut | ⬇️ schlecht |
| Regelungsaufwand | ⬇️ gering | ➡️ mittel | ⬆️ hoch |
| Industrieanwendungen | Intralogistik, Servicerobot | Fahrzeuge, AGV | Lagerhaltung, Youbot |

---

## 5. MQTT-Protokoll

**MQTT (Message Queuing Telemetry Transport)** ist ein leichtgewichtiges
Publish-Subscribe-Protokoll (ISO/IEC 20922) für IoT-Anwendungen.

Verwendete Topics in dieser Simulation:

| Topic | Inhalt | Format |
|---|---|---|
| `R1/Pose` | Roboterpose $(x, y, \varphi)$ | JSON |
| `R1/Status` | Steuerbefehle (`start`/`stop`) | JSON |
| `R1/Lenkwinkel` | Ackermann-Lenkwinkel $\gamma$ | JSON |
| `R1/Geschwindigkeit` | Ackermann-Radgeschwindigkeit | JSON |
| `R1/Antrieb/1..4` | Radwinkelgeschwindigkeiten | JSON |

**QoS-Level 1** (mindestens einmalige Zustellung) wird für alle Topics verwendet.
