// Game State Management
export class GameState {
    constructor() {
        this.poles = [];
        this.colors = ['red', 'blue', 'green', 'yellow'];
        this.poleColors = [];
        this.numPoles = 4;
        this.gemsPerColor = 3;
        this.maxGemsPerPole = 4;
        this.gameStarted = false;
        this.moveCount = 0;
        this.bestScores = JSON.parse(localStorage.getItem('jumbledBlockersBest') || '{}');
    }

    updateConfig(numPoles) {
        this.numPoles = numPoles;
        
        switch (numPoles) {
            case 4:
                this.colors = ['red', 'blue', 'green', 'yellow'];
                this.gemsPerColor = 3;
                this.maxGemsPerPole = 4;
                break;
            case 5:
                this.colors = ['red', 'blue', 'green', 'yellow', 'orange'];
                this.gemsPerColor = 4;
                this.maxGemsPerPole = 5;
                break;
            case 6:
                this.colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
                this.gemsPerColor = 5;
                this.maxGemsPerPole = 6;
                break;
            case 7:
                this.colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'indigo'];
                this.gemsPerColor = 6;
                this.maxGemsPerPole = 7;
                break;
        }
        
        this.poles = new Array(numPoles).fill(null).map(() => []);
        this.poleColors = [...this.colors].sort(() => Math.random() - 0.5);
    }

    createStartingArrangement() {
        let gemPool = this.colors.flatMap(color => Array(this.gemsPerColor).fill(color));
        gemPool.sort(() => Math.random() - 0.5);

        let newPoles = new Array(this.numPoles).fill(null).map(() => []);
        let attempts = 0;
        const maxAttempts = 5000;

        while (gemPool.length > 0 && attempts < maxAttempts) {
            const color = gemPool.shift();
            let placed = false;
            
            const poleIndices = Array.from({ length: this.numPoles }, (_, i) => i).sort(() => Math.random() - 0.5);

            for (const poleIndex of poleIndices) {
                const pole = newPoles[poleIndex];
                
                if (pole.length < this.gemsPerColor && !pole.includes(color)) {
                    pole.push(color);
                    placed = true;
                    break;
                }
            }
            
            if (!placed) {
                gemPool.push(color);
                gemPool.sort(() => Math.random() - 0.5);
                attempts++;
            }
        }

        if (attempts >= maxAttempts) {
            console.warn('Failed to generate a valid starting configuration. Retrying...');
            return this.createStartingArrangement();
        }
        
        this.poles = newPoles;
    }

    moveDisc(fromPoleIndex, toPoleIndex) {
        const fromPole = this.poles[fromPoleIndex];
        const toPole = this.poles[toPoleIndex];

        if (toPole.length < this.maxGemsPerPole) {
            const discColor = fromPole.pop();
            toPole.push(discColor);
            this.moveCount++;
            return true;
        }
        return false;
    }

    checkWinCondition() {
        for (let i = 0; i < this.numPoles; i++) {
            const pole = this.poles[i];
            if (pole.length !== this.gemsPerColor) {
                return false;
            }
            const targetColor = this.poleColors[i];
            if (!pole.every(discColor => discColor === targetColor)) {
                return false;
            }
        }
        return true;
    }

    saveBestScore() {
        const key = `${this.numPoles}poles`;
        if (!this.bestScores[key] || this.moveCount < this.bestScores[key]) {
            this.bestScores[key] = this.moveCount;
            localStorage.setItem('jumbledBlockersBest', JSON.stringify(this.bestScores));
            return true;
        }
        return false;
    }

    getBestScore() {
        const key = `${this.numPoles}poles`;
        return this.bestScores[key] || null;
    }

    reset() {
        this.gameStarted = false;
        this.moveCount = 0;
        this.poles = new Array(this.numPoles).fill(null).map(() => []);
    }
}