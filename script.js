let workTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = workTime;
let isRunning = false;
let isWork = true;
let interval;

const timerEl = document.getElementById("timer");
const modeLabel = document.getElementById("mode-label");
const startBtn = document.getElementById("start-btn");

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.textContent =
        `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function tick() {
    if (timeLeft > 0) {
        timeLeft--;
    } else {
        isWork = !isWork;
        timeLeft = isWork ? workTime : breakTime;
        modeLabel.textContent = isWork ? "Work" : "Break";
    }
    updateTimer();
}

startBtn.addEventListener("click", () => {
    if (!isRunning) {
        interval = setInterval(tick, 1000);
        startBtn.textContent = "Pause";
    } else {
        clearInterval(interval);
        startBtn.textContent = "Start";
    }
    isRunning = !isRunning;
});

updateTimer();

/* Lamp → Dark Mode */
document.getElementById("lamp").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

/* Radio → Lofi Music */
const lofi = document.getElementById("lofi");
let playing = false;

document.getElementById("radio").addEventListener("click", () => {
    if (!playing) {
        lofi.play();
    } else {
        lofi.pause();
    }
    playing = !playing;
});
