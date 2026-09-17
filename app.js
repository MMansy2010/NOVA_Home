/* ==========================================================================
   NOVA HOME — SMART HOME ENGINEERING & AI SYSTEM
   Interactive Application Logic & Telemetry Simulation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const state = {
        sensors: {
            temperature: 28.5, // °C
            humidity: 54,     // %
            light: 680,       // Lux
            motion: true      // Motion detected
        },
        actuators: {
            lightOn: false,
            lightBrightness: 0,
            fanOn: false,
            fanSpeed: 0,
            doorLocked: true,   // true = Locked, false = Unlocked
            windowClosed: true  // true = Closed, false = Open
        },
        uptimeSeconds: 15502,
        wifiPing: 12
    };

    // --- DOM ELEMENTS ---
    // Telemetry & Security
    const valTemp = document.getElementById('valTemp');
    const valHumidity = document.getElementById('valHumidity');
    const valLight = document.getElementById('valLight');
    const valMotion = document.getElementById('valMotion');
    const gaugeTemp = document.getElementById('gaugeTemp');
    const gaugeHumidity = document.getElementById('gaugeHumidity');
    const gaugeLight = document.getElementById('gaugeLight');

    const tempStatus = document.getElementById('tempStatus');
    const humidityStatus = document.getElementById('humidityStatus');
    const lightStatus = document.getElementById('lightStatus');
    const motionStatus = document.getElementById('motionStatus');

    const securityBannerCard = document.getElementById('securityBannerCard');
    const mainSecurityIcon = document.getElementById('mainSecurityIcon');
    const overallSecurityPill = document.getElementById('overallSecurityPill');
    const overallSecurityText = document.getElementById('overallSecurityText');
    const secDoorStatus = document.getElementById('secDoorStatus');
    const secDoorBar = document.getElementById('secDoorBar');
    const secWindowStatus = document.getElementById('secWindowStatus');
    const secWindowBar = document.getElementById('secWindowBar');

    // Controls
    const toggleLight = document.getElementById('toggleLight');
    const sliderLight = document.getElementById('sliderLight');
    const lightStateText = document.getElementById('lightStateText');
    const deviceLightItem = document.getElementById('deviceLightItem');
    const lightIconBox = document.getElementById('lightIconBox');

    const toggleFan = document.getElementById('toggleFan');
    const sliderFan = document.getElementById('sliderFan');
    const fanStateText = document.getElementById('fanStateText');
    const deviceFanItem = document.getElementById('deviceFanItem');
    const fanIconBox = document.getElementById('fanIconBox');

    const toggleDoor = document.getElementById('toggleDoor');
    const btnToggleDoor = document.getElementById('btnToggleDoor');
    const doorStateText = document.getElementById('doorStateText');
    const deviceDoorItem = document.getElementById('deviceDoorItem');
    const doorIconBox = document.getElementById('doorIconBox');

    const toggleWindow = document.getElementById('toggleWindow');
    const btnToggleWindow = document.getElementById('btnToggleWindow');
    const windowStateText = document.getElementById('windowStateText');
    const deviceWindowItem = document.getElementById('deviceWindowItem');
    const windowIconBox = document.getElementById('windowIconBox');

    // AI Engine
    const aiConditionExplain = document.getElementById('aiConditionExplain');
    const aiConditionTags = document.getElementById('aiConditionTags');
    const aiSuggestedActionText = document.getElementById('aiSuggestedActionText');
    const btnApplyAiAction = document.getElementById('btnApplyAiAction');

    // Logs & Stats
    const logContent = document.getElementById('logContent');
    const btnClearLogs = document.getElementById('btnClearLogs');
    const statUptime = document.getElementById('statUptime');
    const statPing = document.getElementById('statPing');

    // Modal & Nav
    const circuitTrigger = document.getElementById('circuitTrigger');
    const circuitModal = document.getElementById('circuitModal');
    const modalClose = document.getElementById('modalClose');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    // --- HELPER FUNCTIONS ---
    function formatTime(secs) {
        const h = Math.floor(secs / 3600).toString().padStart(2, '0');
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(secs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function addLogLine(message, type = 'info') {
        const now = new Date();
        const timestamp = now.toTimeString().split(' ')[0];
        const logLine = document.createElement('div');
        logLine.className = `log-line log-${type}`;
        logLine.textContent = `[${timestamp}] ${message}`;
        logContent.prepend(logLine);

        // Keep last 25 lines
        while (logContent.children.length > 25) {
            logContent.removeChild(logContent.lastChild);
        }
    }

    // --- SENSOR SIMULATION ENGINE ---
    function updateSensorUI() {
        // Temperature
        valTemp.textContent = state.sensors.temperature.toFixed(1);
        const tempPct = Math.min(Math.max(((state.sensors.temperature - 15) / 25) * 100, 0), 100);
        gaugeTemp.style.width = `${tempPct}%`;
        
        if (state.sensors.temperature > 30) {
            tempStatus.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-amber"></i> High Ambient Temperature`;
        } else {
            tempStatus.innerHTML = `<i class="fa-solid fa-circle-check text-green"></i> Optimal Thermal Comfort`;
        }

        // Humidity
        valHumidity.textContent = Math.round(state.sensors.humidity);
        gaugeHumidity.style.width = `${state.sensors.humidity}%`;

        // Light
        valLight.textContent = Math.round(state.sensors.light);
        gaugeLight.style.width = `${Math.min((state.sensors.light / 1000) * 100, 100)}%`;

        // Motion
        if (state.sensors.motion) {
            valMotion.textContent = 'DETECTED';
            valMotion.className = 'sensor-val-str text-green';
            motionStatus.innerHTML = `<i class="fa-solid fa-user-check text-green"></i> Room Occupied`;
        } else {
            valMotion.textContent = 'NONE';
            valMotion.className = 'sensor-val-str text-cyan';
            motionStatus.innerHTML = `<i class="fa-solid fa-moon text-cyan"></i> Room Vacant`;
        }

        // Trigger AI Evaluation whenever sensors update
        evaluateAiRecommendation();
    }

    // Fluctuate values subtly for realism
    setInterval(() => {
        state.sensors.temperature += (Math.random() - 0.48) * 0.15;
        state.sensors.humidity += (Math.random() - 0.5) * 0.3;
        state.sensors.light += (Math.random() - 0.5) * 4;

        // Clamp
        state.sensors.temperature = Math.max(18, Math.min(38, state.sensors.temperature));
        state.sensors.humidity = Math.max(30, Math.min(85, state.sensors.humidity));
        state.sensors.light = Math.max(100, Math.min(1000, state.sensors.light));

        updateSensorUI();
    }, 3000);

    // Fluctuate Ping & Uptime
    setInterval(() => {
        state.uptimeSeconds++;
        statUptime.textContent = formatTime(state.uptimeSeconds);

        if (Math.random() > 0.7) {
            state.wifiPing = Math.floor(10 + Math.random() * 8);
            statPing.textContent = `${state.wifiPing} ms`;
        }
    }, 1000);

    // --- SECURITY PANEL LOGIC (MEDIA #7 REQUIREMENT) ---
    function updateSecurityUI() {
        const doorSec = state.actuators.doorLocked;
        const windowSec = state.actuators.windowClosed;

        if (doorSec) {
            secDoorStatus.textContent = 'Locked & Secure';
            secDoorBar.className = 'security-bar-fill fill-green';
        } else {
            secDoorStatus.textContent = 'UNLOCKED (Alert)';
            secDoorBar.className = 'security-bar-fill fill-red';
        }

        if (windowSec) {
            secWindowStatus.textContent = 'Closed & Secure';
            secWindowBar.className = 'security-bar-fill fill-green';
        } else {
            secWindowStatus.textContent = 'OPENED (Ventilation)';
            secWindowBar.className = 'security-bar-fill fill-cyan';
        }

        if (doorSec && windowSec) {
            securityBannerCard.classList.remove('alert-state');
            mainSecurityIcon.className = 'fa-solid fa-shield-halved security-icon text-green';
            overallSecurityPill.className = 'security-pill secure';
            overallSecurityPill.innerHTML = `<i class="fa-solid fa-lock"></i> <span>SYSTEM SECURE</span>`;
        } else {
            securityBannerCard.classList.add('alert-state');
            mainSecurityIcon.className = 'fa-solid fa-shield-cat security-icon text-red';
            overallSecurityPill.className = 'security-pill alert';
            overallSecurityPill.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>PERIMETER ALERT</span>`;
        }
    }

    // --- ACTUATOR CONTROLS LOGIC ---
    // LIGHT CONTROL
    toggleLight.addEventListener('change', (e) => {
        state.actuators.lightOn = e.target.checked;
        if (state.actuators.lightOn && state.actuators.lightBrightness === 0) {
            state.actuators.lightBrightness = 80;
            sliderLight.value = 80;
        } else if (!state.actuators.lightOn) {
            state.actuators.lightBrightness = 0;
            sliderLight.value = 0;
        }
        updateLightUI();
        addLogLine(`ACTUATOR: Light set to ${state.actuators.lightOn ? 'ON (' + state.actuators.lightBrightness + '%)' : 'OFF'} via Web GUI`, 'info');
    });

    sliderLight.addEventListener('input', (e) => {
        state.actuators.lightBrightness = parseInt(e.target.value);
        state.actuators.lightOn = state.actuators.lightBrightness > 0;
        toggleLight.checked = state.actuators.lightOn;
        updateLightUI();
    });

    function updateLightUI() {
        if (state.actuators.lightOn) {
            deviceLightItem.classList.add('active-device');
            lightStateText.textContent = `State: ON (${state.actuators.lightBrightness}% Dimming)`;
            lightIconBox.style.color = '#FBBF24';
            lightIconBox.style.boxShadow = '0 0 15px rgba(251, 191, 36, 0.5)';
        } else {
            deviceLightItem.classList.remove('active-device');
            lightStateText.textContent = `State: OFF (0%)`;
            lightIconBox.style.color = '';
            lightIconBox.style.boxShadow = '';
        }
        evaluateAiRecommendation();
    }

    // FAN CONTROL
    toggleFan.addEventListener('change', (e) => {
        state.actuators.fanOn = e.target.checked;
        if (state.actuators.fanOn && state.actuators.fanSpeed === 0) {
            state.actuators.fanSpeed = 85;
            sliderFan.value = 85;
        } else if (!state.actuators.fanOn) {
            state.actuators.fanSpeed = 0;
            sliderFan.value = 0;
        }
        updateFanUI();
        addLogLine(`ACTUATOR: Climate Fan set to ${state.actuators.fanOn ? 'ON (' + state.actuators.fanSpeed + '%)' : 'OFF'} via ESP32 PWM`, 'info');
    });

    sliderFan.addEventListener('input', (e) => {
        state.actuators.fanSpeed = parseInt(e.target.value);
        state.actuators.fanOn = state.actuators.fanSpeed > 0;
        toggleFan.checked = state.actuators.fanOn;
        updateFanUI();
    });

    function updateFanUI() {
        const fanIcon = fanIconBox.querySelector('i');
        if (state.actuators.fanOn) {
            deviceFanItem.classList.add('active-device');
            fanStateText.textContent = `State: ON (${state.actuators.fanSpeed * 25} RPM PWM)`;
            fanIcon.classList.add('fa-spin');
            fanIconBox.style.color = '#00E5FF';
        } else {
            deviceFanItem.classList.remove('active-device');
            fanStateText.textContent = `State: OFF (0 RPM)`;
            fanIcon.classList.remove('fa-spin');
            fanIconBox.style.color = '';
        }
        evaluateAiRecommendation();
    }

    // DOOR SERVO CONTROL
    function setDoorState(locked) {
        state.actuators.doorLocked = locked;
        toggleDoor.checked = !locked; // switch ON means Unlocked
        const doorIcon = doorIconBox.querySelector('i');

        if (locked) {
            deviceDoorItem.classList.remove('active-device');
            doorStateText.textContent = 'State: LOCKED (0° Servo)';
            doorIcon.className = 'fa-solid fa-door-closed';
            doorIconBox.style.color = '#10B981';
        } else {
            deviceDoorItem.classList.add('active-device');
            doorStateText.textContent = 'State: UNLOCKED (90° Servo)';
            doorIcon.className = 'fa-solid fa-door-open';
            doorIconBox.style.color = '#EF4444';
        }

        updateSecurityUI();
        evaluateAiRecommendation();
    }

    toggleDoor.addEventListener('change', (e) => {
        setDoorState(!e.target.checked);
        addLogLine(`SERVO: Door ${state.actuators.doorLocked ? 'Locked' : 'Unlocked'} via GPIO 11 PWM signal`, 'info');
    });

    btnToggleDoor.addEventListener('click', () => {
        setDoorState(!state.actuators.doorLocked);
        addLogLine(`SERVO: Door state toggled to ${state.actuators.doorLocked ? 'Locked' : 'Unlocked'}`, 'info');
    });

    // WINDOW SERVO CONTROL
    function setWindowState(closed) {
        state.actuators.windowClosed = closed;
        toggleWindow.checked = !closed; // switch ON means Open
        const windowIcon = windowIconBox.querySelector('i');

        if (closed) {
            deviceWindowItem.classList.remove('active-device');
            windowStateText.textContent = 'State: CLOSED (0° Servo)';
            windowIcon.className = 'fa-solid fa-window-maximize';
            windowIconBox.style.color = '#10B981';
        } else {
            deviceWindowItem.classList.add('active-device');
            windowStateText.textContent = 'State: OPEN (60° Servo)';
            windowIcon.className = 'fa-solid fa-window-restore';
            windowIconBox.style.color = '#3B82F6';
        }

        updateSecurityUI();
        evaluateAiRecommendation();
    }

    toggleWindow.addEventListener('change', (e) => {
        setWindowState(!e.target.checked);
        addLogLine(`SERVO: Window ${state.actuators.windowClosed ? 'Closed' : 'Opened'} via GPIO 12 PWM signal`, 'info');
    });

    btnToggleWindow.addEventListener('click', () => {
        setWindowState(!state.actuators.windowClosed);
        addLogLine(`SERVO: Window state toggled to ${state.actuators.windowClosed ? 'Closed' : 'Opened'}`, 'info');
    });

    // --- AI RECOMMENDATION ENGINE (MEDIA #7 REQUIREMENT) ---
    let currentAiSuggestedAction = null;

    function evaluateAiRecommendation() {
        const temp = state.sensors.temperature;
        const motion = state.sensors.motion;
        const fanOn = state.actuators.fanOn;
        const windowClosed = state.actuators.windowClosed;
        const lightLux = state.sensors.light;
        const lightOn = state.actuators.lightOn;

        let explanation = "";
        let tagsHTML = "";
        let suggestion = "";

        if (temp > 29 && motion && !fanOn) {
            explanation = `High ambient temperature (${temp.toFixed(1)}°C) detected in an occupied room while climate fan is OFF.`;
            tagsHTML = `
                <span class="ai-tag tag-warm">High Temp ${temp.toFixed(1)}°C</span>
                <span class="ai-tag tag-motion">Occupied</span>
                <span class="ai-tag tag-window">Fan OFF</span>
            `;
            suggestion = `Turn climate fan ON at 85% speed to restore optimal thermal comfort.`;
            currentAiSuggestedAction = () => {
                toggleFan.checked = true;
                sliderFan.value = 85;
                state.actuators.fanOn = true;
                state.actuators.fanSpeed = 85;
                updateFanUI();
                addLogLine(`AI AUTONOMOUS: Activated Climate Fan at 85% PWM based on thermal rule`, 'ai');
            };
        } else if (lightLux < 300 && motion && !lightOn) {
            explanation = `Dim ambient lighting (${Math.round(lightLux)} Lux) detected in an occupied room.`;
            tagsHTML = `
                <span class="ai-tag tag-window">Dim Light (${Math.round(lightLux)} Lux)</span>
                <span class="ai-tag tag-motion">Occupied</span>
            `;
            suggestion = `Turn LED Lighting ON at 75% brightness via MOSFET dimmer.`;
            currentAiSuggestedAction = () => {
                toggleLight.checked = true;
                sliderLight.value = 75;
                state.actuators.lightOn = true;
                state.actuators.lightBrightness = 75;
                updateLightUI();
                addLogLine(`AI AUTONOMOUS: Dimmed LED lights ON to 75% based on LDR reading`, 'ai');
            };
        } else if (!state.actuators.doorLocked) {
            explanation = `Main perimeter door is UNLOCKED while room telemetry is active.`;
            tagsHTML = `
                <span class="ai-tag tag-warm">Door Unlocked</span>
                <span class="ai-tag tag-motion">Perimeter Alert</span>
            `;
            suggestion = `Engage Door Servo motor to LOCK position for physical security.`;
            currentAiSuggestedAction = () => {
                setDoorState(true);
                addLogLine(`AI AUTONOMOUS: Engaged Door Servo LOCK position`, 'ai');
            };
        } else {
            explanation = `Room environmental telemetry is within optimal parameters (${temp.toFixed(1)}°C, ${Math.round(state.sensors.humidity)}% Humidity).`;
            tagsHTML = `
                <span class="ai-tag tag-motion">Comfort Optimal</span>
                <span class="ai-tag tag-window">Security Locked</span>
            `;
            suggestion = `System operating at peak efficiency. No active intervention required.`;
            currentAiSuggestedAction = null;
        }

        aiConditionExplain.textContent = explanation;
        aiConditionTags.innerHTML = tagsHTML;
        aiSuggestedActionText.textContent = suggestion;

        if (currentAiSuggestedAction) {
            btnApplyAiAction.style.display = 'block';
        } else {
            btnApplyAiAction.style.display = 'none';
        }
    }

    btnApplyAiAction.addEventListener('click', () => {
        if (currentAiSuggestedAction) {
            currentAiSuggestedAction();
            evaluateAiRecommendation();
        }
    });

    // Clear Logs
    btnClearLogs.addEventListener('click', () => {
        logContent.innerHTML = '';
        addLogLine('Log console cleared by user', 'info');
    });

    // --- MODAL DIALOGUE ---
    circuitTrigger.addEventListener('click', () => {
        circuitModal.classList.add('active');
    });

    modalClose.addEventListener('click', () => {
        circuitModal.classList.remove('active');
    });

    circuitModal.addEventListener('click', (e) => {
        if (e.target === circuitModal) {
            circuitModal.classList.remove('active');
        }
    });

    // Mobile Toggle & Nav Drawer State Management
    function toggleMobileMenu(isOpen) {
        const active = isOpen !== undefined ? isOpen : !navMenu.classList.contains('active');
        navMenu.classList.toggle('active', active);
        
        const toggleIcon = mobileToggle.querySelector('i');
        if (toggleIcon) {
            if (active) {
                toggleIcon.classList.remove('fa-bars');
                toggleIcon.classList.add('fa-xmark');
            } else {
                toggleIcon.classList.remove('fa-xmark');
                toggleIcon.classList.add('fa-bars');
            }
        }
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // Close mobile nav menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            toggleMobileMenu(false);
        }
    });

    // --- NAVIGATION LINK HIGHLIGHTING & SCROLL SPY ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Click handler for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            toggleMobileMenu(false);
        });
    });

    // Scroll spy using IntersectionObserver to switch active nav link on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // INITIALIZATION
    updateSensorUI();
    updateSecurityUI();
    updateLightUI();
    updateFanUI();
    setDoorState(true);
    setWindowState(true);
    addLogLine('NOVA Home Web Engine v3.0 Initialized', 'success');
    addLogLine('Connected to ESP32 Gateway via WebSocket / MQTT', 'success');
});
