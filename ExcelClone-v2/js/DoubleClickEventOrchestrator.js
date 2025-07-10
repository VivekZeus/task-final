export class DoubleClickEventOrchestrator {
    constructor(grid, keyboardKeyHandler) {
        this.grid = grid;
        this.keyboardKeyHandler = keyboardKeyHandler;
        this.listen();
    }
    listen() {
        this.grid.canvas.addEventListener("dblclick", () => this.handleDoubleClick());
    }
    handleDoubleClick() {
        const input = document.querySelector(".cellInput");
        if (!input || !this.grid.SELECTED_CELL_RANGE)
            return;
        this.keyboardKeyHandler.handleDoubleClick(input);
        this.grid.render();
    }
}
