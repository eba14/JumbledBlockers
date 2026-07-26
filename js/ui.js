// UI Management
export class UI {
    constructor() {
        this.statusTimeoutId = null;
    }

    renderPoles(gameState) {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';
        
        for (let i = 0; i < gameState.numPoles; i++) {
            const poleContainer = document.createElement('div');
            poleContainer.classList.add('pole-container');
            
            const poleDiv = document.createElement('div');
            poleDiv.id = `pole-${i}`;
            poleDiv.classList.add('pole', 'stack');
            poleDiv.style.height = `${(gameState.maxGemsPerPole * 35) + 10}px`;
            
            gameState.poles[i].forEach(color => {
                const discDiv = document.createElement('div');
                discDiv.classList.add('disc', color);
                discDiv.dataset.color = color;
                poleDiv.appendChild(discDiv);
            });
            
            poleContainer.appendChild(poleDiv);
            gameContainer.appendChild(poleContainer);
        }
        
        this.assignPoleColors(gameState);
    }

    assignPoleColors(gameState) {
        const poleDivs = document.querySelectorAll('.pole');
        poleDivs.forEach((pole, index) => {
            pole.className = `pole stack ${gameState.poleColors[index]}-target`;
        });
    }

    updateGameContainer() {}

    updateMaxDiscsRule(maxGemsPerPole) {
        document.getElementById('max-discs-rule').textContent = `📏 Each pole holds maximum ${maxGemsPerPole} discs`;
    }

    updateMoveCount(moveCount) {
        document.getElementById('move-count').textContent = moveCount;
    }

    updateBestScore(bestScore) {
        document.getElementById('best-score').textContent = bestScore ? `${bestScore}` : '--';
    }

    setTemporaryStatus(message, duration = 5000, type = 'default') {
        clearTimeout(this.statusTimeoutId);
        const statusElement = document.getElementById('status-message');
        statusElement.textContent = message;
        statusElement.className = type;
        statusElement.style.display = 'block';
        this.statusTimeoutId = setTimeout(() => {
            statusElement.textContent = '';
            statusElement.className = '';
            statusElement.style.display = 'none';
        }, duration);
    }

    clearStatusMessage() {
        clearTimeout(this.statusTimeoutId);
        const statusElement = document.getElementById('status-message');
        statusElement.textContent = '';
        statusElement.className = '';
        statusElement.style.display = 'none';
    }

    showGameStarted() {
        document.body.classList.add('game-started');
        document.getElementById('score-display').classList.remove('hidden');
        document.getElementById('timer-display').classList.remove('hidden');
        document.getElementById('best-display').classList.remove('hidden');
        document.getElementById('reset-btn').classList.remove('hidden');
        document.getElementById('hint-btn').classList.remove('hidden');
    }

    hideGameStarted() {
        document.body.classList.remove('game-started');
        document.getElementById('score-display').classList.add('hidden');
        document.getElementById('timer-display').classList.add('hidden');
        document.getElementById('best-display').classList.add('hidden');
        document.getElementById('reset-btn').classList.add('hidden');
        document.getElementById('hint-btn').classList.add('hidden');
    }

    showWinModal(moves, time, isNewBest) {
        document.getElementById('modal-moves').textContent = moves;
        document.getElementById('modal-time').textContent = time;
        document.getElementById('modal-subtitle').textContent = isNewBest ? '🏆 New personal best!' : '🎊 Great job!';
        document.getElementById('win-modal').classList.remove('hidden');
    }

    showCelebration() {
        setTimeout(() => {
            document.querySelectorAll('.disc').forEach((disc, index) => {
                setTimeout(() => {
                    disc.classList.add('celebration');
                }, index * 150);
            });
        }, 500);
    }

    showHint() {
        const hints = [
            '💡 Focus on clearing one color at a time',
            '🎯 Use empty poles as temporary storage',
            '🔄 Sometimes you need to move discs backwards to progress',
            '⚡ Plan 2-3 moves ahead before acting',
            '🎨 Start with the color that has the most scattered discs'
        ];
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        this.setTemporaryStatus(randomHint, 4000, 'success');
    }

    showEmptyGameContainer() {
        const statusElement = document.getElementById('status-message');
        statusElement.textContent = '🎯 Select a difficulty level below to see the game board';
        statusElement.className = 'selection-prompt-mode';
        statusElement.style.display = 'block';
    }
}