export class ResizeRowCommand {
    constructor(grid, columnIndex, oldHeight, newHeight) {
        this.grid = grid;
        this.rowIndex = columnIndex;
        this.oldHeight = oldHeight;
        this.newHeight = newHeight;
    }
    execute() {
        this.grid.ROW_HEIGHTS.set(this.rowIndex, this.newHeight);
        this.grid.prefixArrayManager.updateRowHeightExecute(this.rowIndex, this.oldHeight, this.newHeight);
    }
    undo() {
        this.grid.ROW_HEIGHTS.set(this.rowIndex, this.oldHeight);
        this.grid.prefixArrayManager.updateRowHeightUndo(this.rowIndex, this.oldHeight, this.newHeight);
    }
}
