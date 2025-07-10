import { MouseHoverManager } from "../manager/MouseHoverManager.js";
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
        const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } = this.grid.getVisibleRowCols();
        this.grid.canvas.style.cursor = "cell";
        for (const manager of this.managers) {
            if (manager.test(x, y, e) && !(manager instanceof MouseHoverManager)) {
                this.currentManager = manager;
                manager.onPointerDown(x, y, e, startRow, endRow, startCol, endCol, scrollLeft, scrollTop);
                break;
            }
        }
    }
    pointerMove(e) {
        const { x, y } = this.getXY(e);
        if (this.currentManager) {
            const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } = this.grid.getVisibleRowCols();
            this.currentManager.onPointerMove(x, y, e, startRow, endRow, startCol, endCol, scrollLeft, scrollTop);
        }
        else {
            const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } = this.grid.getVisibleRowCols();
            this.managers[0].onPointerMove(x, y, e, startRow, endRow, startCol, endCol, scrollLeft, scrollTop);
        }
    }
    pointerUp(e) {
        if (this.currentManager) {
            const { x, y } = this.getXY(e);
            const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } = this.grid.getVisibleRowCols();
            this.currentManager.onPointerUp(x, y, e, startRow, endRow, startCol, endCol, scrollLeft, scrollTop);
            this.currentManager = null;
            this.grid.render();
        }
    }
}
