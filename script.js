/* -------------------------
   STATE
-------------------------- */
function saveState() {
    if (state.timeLeft <= 0) return;

    localStorage.setItem("pomodoroState", JSON.stringify({
        workDuration: state.workDuration,
        breakDuration: state.breakDuration,
        timeLeft: state.timeLeft,
        isWork: state.isWork,
        isDark: state.isDark,
    }));
}


function loadState() {
    const saved = JSON.parse(localStorage.getItem("pomodoroState"));
    if (!saved) return;

    state.workDuration = saved.workDuration ?? state.workDuration;
    state.breakDuration = saved.breakDuration ?? state.breakDuration;
    state.isWork = saved.isWork ?? true;
    state.isDark = saved.isDark ?? false;

    state.timeLeft =
        typeof saved.timeLeft === "number"
            ? saved.timeLeft
            : state.isWork
                ? state.workDuration
                : state.breakDuration;

    document.body.classList.toggle("dark", state.isDark);
    document
        .getElementById("lamp-glow")
        .classList.toggle("active", state.isDark);
}



const state = {
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    timeLeft: 25 * 60,
    isRunning: false,
    isWork: true,
    intervalId: null,
    isDark: false,
    isPlaying: false,
};

/* -------------------------
   DOM ELEMENTS
-------------------------- */

const timerEl = document.getElementById("timer");
const modeLabel = document.getElementById("mode-label");
const startBtn = document.getElementById("start-btn");
const lamp = document.getElementById("lamp");
const radio = document.getElementById("radio");
const lofi = document.getElementById("lofi");

/* -------------------------
   TIMER LOGIC
-------------------------- */
function formatTime(seconds) {
    if (typeof seconds !== "number" || seconds < 0) {
        return "00:00";
    }
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}


function updateUI() {
    timerEl.textContent = formatTime(state.timeLeft);
    modeLabel.textContent = state.isWork ? "Work" : "Break";
    startBtn.textContent = state.isRunning ? "Pause" : "Start";
}

function switchMode() {
    state.isWork = !state.isWork;
    state.timeLeft = state.isWork
        ? state.workDuration
        : state.breakDuration;
}

function tick() {
    if (state.timeLeft > 0) {
        state.timeLeft--;
    } else {
        switchMode();
    }
    saveState();
    updateUI();
}



function toggleTimer() {
    if (state.isRunning) {
        clearInterval(state.intervalId);
        saveState();
    } else {
        state.intervalId = setInterval(tick, 1000);
    }
    state.isRunning = !state.isRunning;
    updateUI();
}


/* -------------------------
   VIBE CONTROLS
-------------------------- */

function toggleDarkMode() {
    state.isDark = !state.isDark;
    document.body.classList.toggle("dark", state.isDark);
    document.getElementById("lamp-glow")
        .classList.toggle("active", state.isDark);
    
    function saveState() {
    localStorage.setItem("pomodoroState", JSON.stringify({
        workDuration: state.workDuration,
        breakDuration: state.breakDuration,
        timeLeft: state.timeLeft,
        isWork: state.isWork,
        isDark: state.isDark,
    }));
}

}

function toggleMusic() {
    state.isPlaying = !state.isPlaying;
    state.isPlaying ? lofi.play() : lofi.pause();
    radio.classList.toggle("playing", state.isPlaying);

}

/* -------------------------
   EVENT LISTENERS
-------------------------- */

startBtn.addEventListener("click", toggleTimer);
lamp.addEventListener("click", toggleDarkMode);
radio.addEventListener("click", toggleMusic);

/* -------------------------
   INIT
-------------------------- */

function loadState() {
    const saved = JSON.parse(localStorage.getItem("pomodoroState"));
    if (!saved) return;

    state.workDuration = saved.workDuration ?? state.workDuration;
    state.breakDuration = saved.breakDuration ?? state.breakDuration;
    state.isWork = saved.isWork ?? true;
    state.isDark = saved.isDark ?? false;

    // FIX: never restore a zero timer
    if (typeof saved.timeLeft === "number" && saved.timeLeft > 0) {
        state.timeLeft = saved.timeLeft;
    } else {
        state.timeLeft = state.isWork
            ? state.workDuration
            : state.breakDuration;
    }

    document.body.classList.toggle("dark", state.isDark);
    document
        .getElementById("lamp-glow")
        .classList.toggle("active", state.isDark);
}


loadState();
updateUI();