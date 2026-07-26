// Drag and Drop Management
export class DragDrop {
    constructor(gameState, ui, onMove) {
        this.gameState = gameState;
        this.ui = ui;
        this.onMove = onMove;
        this.draggedDisc = null;
        this.dragMoveHandler = null;
        this.documentListenersAdded = false;

        this.boundHandleGlobalDrop = (e) => this.handleGlobalDrop(e);
    }

    addEventListeners() {
        document.querySelectorAll('.pole').forEach((poleDiv) => {
            poleDiv.addEventListener('mousedown', (e) => this.handleDiscSelect(e));
            poleDiv.addEventListener('touchstart', (e) => this.handleDiscSelect(e), { passive: false });
        });

        if (!this.documentListenersAdded) {
            document.addEventListener('mouseup', this.boundHandleGlobalDrop);
            document.addEventListener('touchend', this.boundHandleGlobalDrop, { passive: false });
            this.documentListenersAdded = true;
        }
    }

    handleDiscSelect(e) {
        e.preventDefault();
        if (!this.gameState.gameStarted) return;
        
        const target = e.target || e.touches?.[0]?.target;
        if (target?.classList.contains('disc')) {
            const disc = target;
            const poleDiv = disc.parentElement;
            const index = Array.from(poleDiv.parentElement.parentElement.children).indexOf(poleDiv.parentElement);
            
            if (poleDiv.lastChild === disc) {
                this.draggedDisc = disc;
                this.draggedDisc.classList.add('dragging');
                this.draggedDisc.initialPoleIndex = index;
                
                this.showDragCursor(disc);
                this.showDropTargets(index);

                this.dragMoveHandler = (e) => this.updateDragCursor(e);
                document.addEventListener('mousemove', this.dragMoveHandler);
            } else {
                this.ui.setTemporaryStatus('⚠️ Only the top disc can be moved!', 2000, 'error');
            }
        }
    }

    showDragCursor(disc) {
        const dragCursor = document.getElementById('drag-cursor');
        dragCursor.className = `disc ${disc.dataset.color}`;
        dragCursor.style.left = '-1000px';
        dragCursor.style.top = '-1000px';
        dragCursor.classList.remove('hidden');
    }

    showDropTargets(excludeIndex) {
        document.querySelectorAll('.pole').forEach((pole, poleIndex) => {
            if (poleIndex !== excludeIndex) {
                const canDrop = this.gameState.poles[poleIndex].length < this.gameState.maxGemsPerPole;
                pole.classList.add(canDrop ? 'drop-target' : 'invalid-target');
            }
        });
        
        document.getElementById('drop-zone-indicator').textContent = '🎯 Drop on highlighted pole';
        document.getElementById('drop-zone-indicator').classList.remove('hidden');
    }

    updateDragCursor(e) {
        if (this.draggedDisc) {
            const dragCursor = document.getElementById('drag-cursor');
            requestAnimationFrame(() => {
                dragCursor.style.left = e.clientX + 'px';
                dragCursor.style.top = e.clientY + 'px';
            });
        }
    }

    handleGlobalDrop(e) {
        if (!this.draggedDisc) {
            this.resetDragState();
            return;
        }
        
        const mouseX = e.clientX || e.changedTouches?.[0]?.clientX;
        const mouseY = e.clientY || e.changedTouches?.[0]?.clientY;
        
        const poleContainers = document.querySelectorAll('.pole-container');
        let closestPole = -1;
        let minDistance = Infinity;
        
        poleContainers.forEach((container, index) => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
            );
            
            if (mouseX >= rect.left - 20 && mouseX <= rect.right + 20 &&
                mouseY >= rect.top - 20 && mouseY <= rect.bottom + 20) {
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPole = index;
                }
            }
        });
        
        if (closestPole !== -1 && closestPole !== this.draggedDisc.initialPoleIndex) {
            this.handleDiscDrop(closestPole);
        } else {
            this.resetDragState();
        }
    }

    handleDiscDrop(toPoleIndex) {
        if (this.draggedDisc) {
            const fromPoleIndex = this.draggedDisc.initialPoleIndex;
            this.onMove(fromPoleIndex, toPoleIndex);
        }
    }

    resetDragState() {
        if (this.draggedDisc) {
            this.draggedDisc.classList.remove('dragging');
            this.draggedDisc = null;
        }
        
        document.getElementById('drag-cursor').classList.add('hidden');
        if (this.dragMoveHandler) {
            document.removeEventListener('mousemove', this.dragMoveHandler);
            this.dragMoveHandler = null;
        }
        
        document.querySelectorAll('.pole').forEach(pole => {
            pole.classList.remove('drop-target', 'invalid-target');
        });
        
        document.getElementById('drop-zone-indicator').classList.add('hidden');
    }
}