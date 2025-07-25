export class ColHeaderSelector {
    constructor(gridObj) {
        this.grid = gridObj;
    }
    handleOnMouseDown(startCol, endCol, x, scrollLeft) {
        let selCol = this.grid.getSelectedCol(startCol, endCol, x);
        this.grid.SELECTED_COL_HEADER = selCol + 1;
        this.grid.HEADER_SELECTION_START_COL = selCol;
        this.grid.HEADER_SELECTION_END_COL = selCol;
        let x1Pos = this.grid.prefixArrayManager.getColXPosition(selCol);
        let adjustedX1 = x1Pos - scrollLeft;
        this.grid.ADJUSTED_x1 = adjustedX1;
        this.grid.SELECTED_CELL_RANGE = {
            startRow: 0,
            endRow: this.grid.TOTAL_ROWS - 1,
            startCol: selCol,
            endCol: selCol,
        };
        // Clear row selection when selecting column
        this.grid.SELECTED_ROW_HEADER = -1;
        this.grid.SELECTED_ROW_RANGE = null;
    }
    handleOnMouseMove(startCol, endCol, x, scrollLeft) {
        let currentCol = this.grid.getSelectedCol(startCol, endCol, x);
        // Clamp the column to valid range
        currentCol = Math.max(0, Math.min(currentCol, this.grid.TOTAL_COLUMNS - 1));
        this.grid.HEADER_SELECTION_END_COL = currentCol;
        // Update the selection range
        let minCol = Math.min(this.grid.HEADER_SELECTION_START_COL, this.grid.HEADER_SELECTION_END_COL);
        let maxCol = Math.max(this.grid.HEADER_SELECTION_START_COL, this.grid.HEADER_SELECTION_END_COL);
        this.grid.SELECTED_CELL_RANGE = {
            startRow: 0,
            endRow: this.grid.TOTAL_ROWS - 1,
            startCol: minCol,
            endCol: maxCol,
        };
        // Update visual indicators
        this.grid.SELECTED_COL_HEADER = this.grid.HEADER_SELECTION_START_COL + 1; // Keep original selection visible
    }
    handleOnMouseUp() {
        let minCol = Math.min(this.grid.HEADER_SELECTION_START_COL, this.grid.HEADER_SELECTION_END_COL);
        let maxCol = Math.max(this.grid.HEADER_SELECTION_START_COL, this.grid.HEADER_SELECTION_END_COL);
        this.grid.SELECTED_COL_RANGE = {
            startCol: minCol,
            endCol: maxCol
        };
        this.grid.SELECTED_COL_HEADER = this.grid.HEADER_SELECTION_START_COL + 1;
    }
}
