// Get references to the elements
const stopwatchModeButton = document.getElementById('stopwatch-mode');
const timerModeButton = document.getElementById('timer-mode');
const timeDisplay = document.getElementById('time');
const lapsSection = document.getElementById('laps');
const timerSettings = document.getElementById('timer-settings');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const lapList = document.getElementById('lap-list');

// Get references to the timer input fields
const timerMinInput = document.getElementById('timer-min');
const timerSecInput = document.getElementById('timer-sec');

// Track current mode
let currentMode = 'stopwatch'; // Default mode

// Stopwatch variables
let stopwatchInterval;
let stopwatchTime = 0; // in milliseconds
let lapCounter = 0;

// Timer variables
let timerInterval;
let timerTime = 0; // in seconds

// Function to format time as HH:MM:SS:MS or MM:SS:MS
function formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${Math.floor(ms / 10).toString().padStart(2, '0')}`;
}

// Update the time display
function updateTimeDisplay() {
    if (currentMode === 'stopwatch') {
        const formattedTime = formatTime(stopwatchTime);
        document.getElementById('hr').textContent = formattedTime.split(':')[0];
        document.getElementById('min').textContent = formattedTime.split(':')[1];
        document.getElementById('sec').textContent = formattedTime.split(':')[2];
        document.getElementById('count').textContent = formattedTime.split(':')[3];
    } else if (currentMode === 'timer') {
        const formattedTime = formatTime(timerTime * 1000); // Convert seconds to milliseconds for display
        document.getElementById('min').textContent = formattedTime.split(':')[1];
        document.getElementById('sec').textContent = formattedTime.split(':')[2];
        document.getElementById('count').textContent = formattedTime.split(':')[3];
    }
}

// Function to clear existing intervals
function clearIntervals() {
    if (currentMode === 'stopwatch' && stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    } else if (currentMode === 'timer' && timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Function to start the stopwatch or timer
function start() {
    clearIntervals(); // Clear any existing intervals

    if (currentMode === 'stopwatch') {
        stopwatchInterval = setInterval(() => {
            stopwatchTime += 10; // Increment by 10 milliseconds
            updateTimeDisplay();
        }, 10); // Update every 10 milliseconds
    } else if (currentMode === 'timer') {
        timerInterval = setInterval(() => {
            if (timerTime > 0) {
                timerTime--;
                updateTimeDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }, 1000); // Update every second
    }
}

// Function to stop the stopwatch or timer
function stop() {
    clearIntervals(); // Clear any existing intervals
}

// Function to reset the stopwatch or timer
function reset() {
    clearIntervals(); // Clear any existing intervals

    if (currentMode === 'stopwatch') {
        stopwatchTime = 0;
        updateTimeDisplay();
    } else if (currentMode === 'timer') {
        timerTime = 0;
        // Reset the timer input fields to default
        timerMinInput.value = '0';
        timerSecInput.value = '0';
        updateTimeDisplay();
    }
}

// Function to add a lap in stopwatch mode
function addLap() {
    if (currentMode === 'stopwatch') {
        const lapTime = formatTime(stopwatchTime);
        const lapItem = document.createElement('li');
        lapItem.textContent = `Lap ${++lapCounter}: ${lapTime}`;
        lapList.appendChild(lapItem);
    }
}

// Function to switch to stopwatch mode
function switchToStopwatch() {
    currentMode = 'stopwatch';
    timeDisplay.innerHTML = `
        <span class="digit" id="hr">00</span>
        <span class="txt">Hr</span>
        <span class="digit" id="min">00</span>
        <span class="txt">Min</span>
        <span class="digit" id="sec">00</span>
        <span class="txt">Sec</span>
        <span class="digit" id="count">00</span>
        <span class="txt">MS</span>
    `;
    lapsSection.style.display = 'block'; // Show laps section
    timerSettings.style.display = 'none'; // Hide timer settings
    reset(); // Reset the stopwatch time
}

// Function to switch to timer mode
function switchToTimer() {
    currentMode = 'timer';
    timeDisplay.innerHTML = `
        <span class="digit" id="min">00</span>
        <span class="txt">Min</span>
        <span class="digit" id="sec">00</span>
        <span class="txt">Sec</span>
        <span class="digit" id="count">00</span>
        <span class="txt">MS</span>
    `;
    lapsSection.style.display = 'none'; // Hide laps section
    timerSettings.style.display = 'block'; // Show timer settings
    // Set the timer time based on input fields
    const minutes = parseInt(timerMinInput.value) || 0;
    const seconds = parseInt(timerSecInput.value) || 0;
    timerTime = (minutes * 60) + seconds;
    updateTimeDisplay(); // Update display with initial timer settings
}

// Add event listeners for mode buttons
stopwatchModeButton.addEventListener('click', switchToStopwatch);
timerModeButton.addEventListener('click', switchToTimer);

// Add event listeners for control buttons
startButton.addEventListener('click', start);
stopButton.addEventListener('click', stop);
resetButton.addEventListener('click', reset);
lapButton.addEventListener('click', addLap);

// Update timer time when inputs change
timerMinInput.addEventListener('change', () => {
    if (currentMode === 'timer') {
        const minutes = parseInt(timerMinInput.value) || 0;
        const seconds = parseInt(timerSecInput.value) || 0;
        timerTime = (minutes * 60) + seconds;
        updateTimeDisplay();
    }
});

timerSecInput.addEventListener('change', () => {
    if (currentMode === 'timer') {
        const minutes = parseInt(timerMinInput.value) || 0;
        const seconds = parseInt(timerSecInput.value) || 0;
        timerTime = (minutes * 60) + seconds;
        updateTimeDisplay();
    }
});
