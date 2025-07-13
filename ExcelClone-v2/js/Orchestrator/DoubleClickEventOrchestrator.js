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
        // console.log("input finalzed "+ this.grid.INPUT_FINALIZED);
        // console.log("input val "+ this.grid.CURRENT_INPUT);
        if (!input || !this.grid.SELECTED_CELL_RANGE)
            return;
        this.keyboardKeyHandler.handleDoubleClick(input);
        this.grid.render();
    }
}
