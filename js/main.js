// Main Game Controller
import { GameState } from './gameState.js';
import { UI } from './ui.js';
import { DragDrop } from './dragDrop.js';
import { Timer } from './timer.js';

class JumbledBlockers {
    constructor() {
        this.gameState = new GameState();
        this.ui = new UI();
        this.timer = new Timer();
        this.dragDrop = new DragDrop(this.gameState, this.ui, (from, to) => this.handleMove(from, to));
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.ui.showEmptyGameContainer();
        this.ui.updateBestScore(this.gameState.getBestScore());
    }

    setupEventListeners() {
        document.querySelectorAll('.pole-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.pole-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                const numPoles = parseInt(option.dataset.poles);
                this.gameState.updateConfig(numPoles);
                this.ui.updateGameContainer(numPoles);
                this.ui.renderPoles(this.gameState);
                document.getElementById('game-container').style.display = 'flex';
                this.ui.clearStatusMessage();
                this.ui.updateMaxDiscsRule(this.gameState.maxGemsPerPole);
                this.ui.updateBestScore(this.gameState.getBestScore());
            });
        });

        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('modal-play-again').addEventListener('click', () => {
            document.getElementById('win-modal').classList.add('hidden');
            this.resetGame();
        });
    }

    startGame() {
        const selectedOption = document.querySelector('.pole-option.selected');
        if (!selectedOption) {
            this.ui.setTemporaryStatus('⚠️ Please select a difficulty level first!', 3000, 'error');
            return;
        }
        
        this.gameState.createStartingArrangement();
        this.gameState.gameStarted = true;
        this.gameState.moveCount = 0;
        
        this.ui.renderPoles(this.gameState);
        this.ui.updateMoveCount(0);
        this.ui.showGameStarted();
        this.ui.clearStatusMessage();
        
        this.timer.reset();
        this.timer.start();
        
        this.dragDrop.addEventListeners();
        
        this.ui.setTemporaryStatus('🎮 Game started! Sort all discs by color!', 3000, 'success');
    }

    resetGame() {
        this.gameState.reset();
        this.timer.reset();
        this.ui.hideGameStarted();
        this.ui.clearStatusMessage();
        this.ui.renderPoles(this.gameState);
        this.dragDrop.resetDragState();
    }

    handleMove(fromPoleIndex, toPoleIndex) {
        if (this.gameState.moveDisc(fromPoleIndex, toPoleIndex)) {
            this.ui.renderPoles(this.gameState);
            this.ui.updateMoveCount(this.gameState.moveCount);
            this.dragDrop.addEventListeners();
            
            if (this.gameState.checkWinCondition()) {
                this.handleWin();
            }
        } else {
            this.ui.setTemporaryStatus('❌ Cannot place disc there!', 2000, 'error');
        }
        
        this.dragDrop.resetDragState();
    }

    handleWin() {
        this.timer.stop();
        this.gameState.gameStarted = false;

        const isNewBest = this.gameState.saveBestScore();
        this.ui.updateBestScore(this.gameState.getBestScore());

        this.ui.showCelebration();
        this.ui.showWinModal(this.gameState.moveCount, this.timer.getFormattedTime(), isNewBest);
    }

    showHint() {
        this.ui.showHint();
    }
}

// Initialize the game
const game = new JumbledBlockers();

// Global functions for HTML onclick handlers
window.startGame = () => game.startGame();
window.resetGame = () => game.resetGame();
window.showHint = () => game.showHint();