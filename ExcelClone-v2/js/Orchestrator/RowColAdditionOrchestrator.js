import { RowColInsertionCommand } from "../command/RowColInsertionCommand.js";
export class RowColAdditionOrchestrator {
    constructor(grid) {
        this.grid = grid;
        this.setupEvents();
    }
    setupEvents() {
        var _a, _b, _c, _d;
        (_a = document.getElementById("addRowAbove")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.handleRowAddAbove());
        (_b = document.getElementById("addRowBelow")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.handleRowAddBelow());
        (_c = document.getElementById("addColLeft")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => this.handleColAddLeft());
        (_d = document.getElementById("addColRight")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => this.handleColAddRight());
    }
    handleRowAddAbove() {
        const range = this.grid.SELECTED_CELL_RANGE;
        if (!range)
            return;
        const startRow = Math.min(range.startRow, range.endRow);
        const count = Math.abs(range.endRow - range.startRow) + 1;
        this.grid.commandManager.execute(new RowColInsertionCommand(this.grid, true, startRow, count));
    }
    handleRowAddBelow() {
        const range = this.grid.SELECTED_CELL_RANGE;
        if (!range)
            return;
        const endRow = Math.max(range.startRow, range.endRow);
        const count = Math.abs(range.endRow - range.startRow) + 1;
        this.grid.commandManager.execute(new RowColInsertionCommand(this.grid, true, endRow + 1, count));
    }
    handleColAddRight() {
        const range = this.grid.SELECTED_CELL_RANGE;
        if (!range)
            return;
        const endCol = Math.max(range.startCol, range.endCol);
        const count = Math.abs(range.endCol - range.startCol) + 1;
        this.grid.commandManager.execute(new RowColInsertionCommand(this.grid, false, endCol + 1, count));
    }
    handleColAddLeft() {
        const range = this.grid.SELECTED_CELL_RANGE;
        if (!range)
            return;
        const startCol = Math.min(range.startCol, range.endCol);
        const count = Math.abs(range.endCol - range.startCol) + 1;
        this.grid.commandManager.execute(new RowColInsertionCommand(this.grid, false, startCol, count));
    }
}
