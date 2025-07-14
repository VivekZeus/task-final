export class ResizeColumnCommand {
    constructor(grid, columnIndex, oldWidth, newWidth) {
        this.grid = grid;
        this.columnIndex = columnIndex;
        this.oldWidth = oldWidth;
        this.newWidth = newWidth;
    }
    execute() {
        this.grid.COL_WIDTHS.set(this.columnIndex, this.newWidth);
        this.grid.prefixArrayManager.updateColumnWidthExecute(this.columnIndex, this.oldWidth, this.newWidth);
    }
    undo() {
        this.grid.COL_WIDTHS.set(this.columnIndex, this.oldWidth);
        this.grid.prefixArrayManager.updateColumnWidthUndo(this.columnIndex, this.oldWidth, this.newWidth);
    }
}
