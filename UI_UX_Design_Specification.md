# NOVA Home — UI/UX Design Specification & Guidelines
**Project Name:** NOVA Home — Smart Home Engineering & AI System  
**Category:** DECI Competition Level 3 — IoT & AI Engineering  
**Deliverable:** Complete UI/UX Architecture, Design System, Wireframe Specifications, and User Journey Specification  
**Date:** September 2026  

---

## 1. Executive Summary & UX Objectives

### 1.1 Project Vision
NOVA Home is an intelligent, autonomous smart home engineering ecosystem powered by ESP32 microcontrollers, two-way Wi-Fi telemetry, real-time sensor analytics, cybersecurity protocols, and predictive AI decision-making.

### 1.2 Primary UX Goals
1. **High Visual Impact & Futuristic Aesthetic:** Wow evaluators and users with a sleek dark navy glassmorphic interface (`#060B14`), electric cyan glowing accents (`#00E5FF`), and rich micro-interactions.
2. **Instant Cognitive Clarity:** Enable homeowners and engineering evaluators to assess room telemetry (Temperature, Humidity, Light, Motion) and security status in less than 3 seconds.
3. **Seamless Device Control:** Provide low-latency, intuitive controls for actuators (Lighting dimmer, Fan speed, Door Servo lock/unlock, Window Servo open/close).
4. **Explainable AI (XAI):** Clearly communicate *why* the AI is suggesting or taking an automated action through structured condition explanations (`Explain Condition`) and explicit suggested actions (`Suggested Action`).
5. **Perimeter Security Awareness:** Ensure real-time physical perimeter state (Door & Window status) is prominently monitored with unmistakable visual feedback (Green Secure vs. Glowing Red Alert).

---

## 2. User Persona & User Journey

### 2.1 User Persona: The Tech-Savvy Homeowner / Competition Evaluator
- **Name:** Alex Vance / DECI Level 3 Judge
- **Age:** 28–45
- **Goal:** Wants an intuitive, high-tech dashboard to monitor smart home health, override automated controls, inspect hardware pinout schematics, and trust AI automation without feeling out of control.
- **Pain Points:** 
  - Complex smart home apps with hidden menus.
  - Black-box AI that changes device states without explanation.
  - Slow visual feedback when toggling hardware devices.

### 2.2 User Journey Map
```
[User Opens Dashboard] ➔ [Header Status Check: ONLINE] ➔ [Scans Security Panel: SYSTEM SECURE]
        │
        ├──► [Monitors Live Telemetry: Temp 28.5°C, Hum 54%, LDR 680lx, Motion Occupied]
        │
        ├──► [Toggles Actuators: Adjusts Fan PWM / Dimmer Slider ➔ Instant GUI & Log Feedback]
        │
        ├──► [Inspects AI Recommendation: "Temp > 29°C + Motion ➔ Activate Fan"] ➔ [Applies Action]
        │
        └──► [Scrolls Down to Inspect System Architecture, Hardware Flow, AI Pipeline & GPIO Pin Map]
```

---

## 3. Design System & UI Kit

### 3.1 Color Palette & Tokens
| Token Name | Hex Code | Usage / Purpose |
| :--- | :--- | :--- |
| `--bg-dark` | `#060B14` | Primary deep navy background |
| `--bg-card` | `rgba(14, 23, 42, 0.75)` | Glassmorphic card surface background |
| `--primary-cyan` | `#00E5FF` | Electric cyan brand accent, primary CTA, active states |
| `--accent-green` | `#10B981` / `#34D399` | System Secure status, optimal sensors, success logs |
| `--accent-red` | `#EF4444` / `#F87171` | Security Alert status, warm thermal warnings, error logs |
| `--accent-amber` | `#F59E0B` / `#FBBF24` | Ambient light sensor, AI action alerts, warnings |
| `--accent-purple` | `#A855F7` / `#C084FC` | AI recommendation badge, motion sensor icon |
| `--text-main` | `#F8FAFC` | Primary high-contrast text |
| `--text-muted` | `#94A3B8` | Secondary labels, descriptions, subtext |

### 3.2 Typography Scale
- **Primary Font:** `Plus Jakarta Sans` (Headings, titles, branding)
- **Secondary Font:** `Inter` (Body text, buttons, navigation links)
- **Code & Numeric Font:** `Fira Code` (Sensor readouts, GPIO pin map, live MQTT logs)

| Element | Font Family | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| Hero Title | Plus Jakarta Sans | 2.5rem (40px) | 800 (Bold) | 1.2 |
| Section Title | Plus Jakarta Sans | 1.85rem (30px) | 800 (Bold) | 1.3 |
| Card Title | Plus Jakarta Sans | 1.2rem (19px) | 700 (SemiBold) | 1.4 |
| Sensor Readout | Fira Code | 2.2rem (35px) | 800 (Bold) | 1.0 |
| Body Text | Inter | 0.95rem (15px) | 400 (Regular) | 1.6 |
| Code / Pin Badge | Fira Code | 0.85rem (13px) | 700 (Bold) | 1.0 |

### 3.3 Component Library
1. **Glassmorphism Card Container (`.glass-card`):**
   - Background: `rgba(14, 23, 42, 0.75)` with `backdrop-filter: blur(16px)`.
   - Border: `1px solid rgba(0, 229, 255, 0.15)`.
   - Hover state: Border glow `rgba(0, 229, 255, 0.3)` + drop shadow `0 0 20px rgba(0, 229, 255, 0.12)`.

2. **Status Indicator Badges:**
   - `ONLINE` Badge: Pulsing green dot with semi-transparent emerald border.
   - `SYSTEM SECURE` Pill: Solid green border & background tint.
   - `PERIMETER ALERT` Pill: Pulsing red border with glowing shadow effect.

3. **Interactive Actuator Switches & Sliders:**
   - Toggle Switch: Custom rounded pill switch transitioning from subtle gray to electric cyan.
   - Range Slider: Sleek horizontal track with cyan glowing thumb indicator.

---

## 4. Information Architecture & Page Layout

### 4.1 Header Bar Specification
- **Left:** NOVA Home Logo + Title (`NOVA` in white, `HOME` in electric cyan) + Subtitle ("DECI LEVEL 3 ENGINEERING").
- **Center:** Navigation Links (`Dashboard`, `Architecture`, `Hardware Flow`, `AI Pipeline`, `GPIO Map`) with active scroll-spy highlighting.
- **Right:** Live `ONLINE` connectivity badge + Mobile hamburger menu button.

### 4.2 Section Layouts
1. **Hero Submission Banner:**
   - DECI Level 3 Submission badge.
   - Title & Tagline outlining ESP32, Wi-Fi telemetry, cybersecurity, and AI recommendation engine.
   - Metrics Grid: Wi-Fi Latency (12ms), Core MCU (ESP32), AI Accuracy (99.8%), Uptime Counter.

2. **Media #7 Web Dashboard (Core Control Panel):**
   - **Row 1:** Security Status Banner (Door Perimeter, Window Perimeter, Cybersecurity Encryption State).
   - **Row 2:** 4 Sensor Telemetry Cards (Temperature, Humidity, Light, Motion) with live progress gauges.
   - **Row 3 (Split Grid):**
     - *Left Card:* Actuator Device Controls (LED Dimmer, Climate Fan Speed, Door Servo Lock/Unlock, Window Servo Open/Close).
     - *Right Card:* Explainable AI Recommendation Engine (`Explain Condition` + `Suggested Action` + One-Click Apply Button + Live ESP32 MQTT Log Console).

3. **System Architecture Section:**
   - 5-Node Flow Diagram: Physical Home ➔ ESP32 Controller ➔ Wi-Fi / IoT ➔ Digital System ➔ Actuators.
   - Cybersecurity protection banner.

4. **Hardware + IoT Flow Section:**
   - 3-Column Breakdown: Inputs / Sensors, Controller, Outputs / Actuators.

5. **AI & Data Flow Section:**
   - 6-Step Pipeline Grid: Sensor Data ➔ Collection ➔ Storage ➔ Cleaning ➔ Feature Engineering ➔ AI Model.
   - Model variables pill cloud & real inference code example.

6. **Hardware Pinout Map & Schematic Modal:**
   - Responsive GPIO allocation table matching `NOVA pin map.txt`.
   - Circuit schematic preview thumbnail with hover zoom overlay & full-screen lightbox modal.

---

## 5. Accessibility & Responsive Specifications

### 5.1 Contrast & Color Accessibility (WCAG 2.1 AA)
- Text contrast ratio against `#060B14` and `#0E172A` exceeds 7:1 for normal text and 4.5:1 for subtext.
- Status colors (Green, Red, Cyan, Amber) are paired with text labels and Font Awesome icons so color is never the sole indicator of status.

### 5.2 Responsive Breakpoints
- **Desktop (≥ 1200px):** Full 4-column sensor grid, 2-column control & AI grid, 3-column hardware breakdown.
- **Tablet (768px – 1199px):** 2-column sensor grid, 1-column control & AI grid, responsive navigation menu.
- **Mobile (< 768px):** 1-column stacked layout, mobile drawer menu, touch-optimized toggle switches (44px min touch target).

---

## 6. Verification & Design Summary

This specification fully documents the UI/UX architecture of **NOVA Home**, ensuring complete alignment with competition requirements, high visual appeal, intuitive user flows, and transparent AI interactions.
