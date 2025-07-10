export class PointerOrchestrator {
    constructor(grid) {
        this.managers = [];
        this.currentManager = null;
        this.grid = grid;
        this.setupListeners();
    }
    registerManager(manager) {
        this.managers.push(manager);
    }
    setupListeners() {
        const canvas = this.grid.canvas;
        canvas.addEventListener("mousedown", (e) => this.pointerDown(e));
        window.addEventListener("mousemove", (e) => this.pointerMove(e));
        window.addEventListener("mouseup", (e) => this.pointerUp(e));
    }
    pointerDown(e) {
        const { x, y } = this.getXY(e);
        for (const manager of this.managers) {
            if (manager.testPointerDown(x, y, e)) {
                this.currentManager = manager;
                manager.onPointerDown(x, y, e);
                break;
            }
        }
    }
    pointerMove(e) {
        if (this.currentManager) {
            const { x, y } = this.getXY(e);
            this.currentManager.onPointerMove(x, y, e);
        }
    }
    pointerUp(e) {
        if (this.currentManager) {
            const { x, y } = this.getXY(e);
            this.currentManager.onPointerUp(x, y, e);
            this.currentManager = null;
        }
    }
    getXY(e) {
        const rect = this.grid.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }
}
