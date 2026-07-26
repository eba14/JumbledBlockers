// Timer Management
export class Timer {
    constructor() {
        this.timer = null;
        this.seconds = 0;
        this.minutes = 0;
        this.timerDisplay = document.getElementById('timer-display');
    }

    start() {
        this.timer = setInterval(() => this.update(), 1000);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    reset() {
        this.stop();
        this.seconds = 0;
        this.minutes = 0;
        this.updateDisplay();
    }

    update() {
        this.seconds++;
        if (this.seconds === 60) {
            this.seconds = 0;
            this.minutes++;
        }
        this.updateDisplay();
    }

    updateDisplay() {
        const formattedMinutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
        const formattedSeconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
        document.getElementById('timer-value').textContent = `${formattedMinutes}:${formattedSeconds}`;
    }

    getFormattedTime() {
        const formattedMinutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
        const formattedSeconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
        return `${formattedMinutes}:${formattedSeconds}`;
    }
}