export class PointerOrchestrator {
    constructor(grid) {
        this.managers = [];
        this.currentManager = null;
        this.grid = grid;
        this.setupListeners();
    }
    getXY(e) {
        const rect = this.grid.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }
    registerManager(manager) {
        this.managers.push(manager);
    }
    setupListeners() {
        const canvas = this.grid.canvas;
        canvas.addEventListener("pointerdown", (e) => this.pointerDown(e));
        window.addEventListener("pointermove", (e) => this.pointerMove(e));
        window.addEventListener("pointerup", (e) => this.pointerUp(e));
    }
    pointerDown(e) {
        const { x, y } = this.getXY(e);
        this.grid.canvas.style.cursor = "cell";
        for (const manager of this.managers) {
            console.log(manager.test(x, y, e));
            if (manager.test(x, y, e)) {
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
        else {
        }
    }
    pointerUp(e) {
        if (this.currentManager) {
            const { x, y } = this.getXY(e);
            this.currentManager.onPointerUp(x, y, e);
            this.currentManager = null;
        }
    }
}
