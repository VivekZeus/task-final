export class HeaderSelectionManager {
    constructor(gridObj) {
        this.grid = gridObj;
    }
    handleOnMouseDown(startCol, startRow, endCol, endRow, scrollLeft, scrollTop, x, y) {
        this.grid.IS_SELECTING_HEADER = true;
        if (y < this.grid.COL_HEADER_HEIGHT && x > this.grid.ROW_HEADER_WIDTH) {
            this.grid.colHeaderSelector.handleOnMouseDown(startCol, endCol, x, scrollLeft);
            this.grid.HEADER_SELECTION_TYPE = "column";
        }
        else {
            this.grid.rowHeaderSelector.handleOnMouseDown(startRow, endRow, y, scrollTop);
            this.grid.HEADER_SELECTION_TYPE = "row";
        }
    }
    handleOnMouseMove(startCol, startRow, endCol, endRow, scrollLeft, scrollTop, x, y, event) {
        if (this.grid.HEADER_SELECTION_TYPE === "column") {
            this.grid.colHeaderSelector.handleOnMouseMove(startCol, endCol, x, scrollLeft);
            this.grid.autoScrollManager.checkAutoScroll(event);
        }
        else if (this.grid.HEADER_SELECTION_TYPE === "row") {
            this.grid.rowHeaderSelector.handleOnMouseMove(startRow, endRow, y, scrollTop);
            this.grid.autoScrollManager.checkAutoScroll(event);
        }
    }
    handleOnMouseUp() {
        if (this.grid.HEADER_SELECTION_TYPE === "column") {
            this.grid.colHeaderSelector.handleOnMouseUp();
        }
        else if (this.grid.HEADER_SELECTION_TYPE === "row") {
            this.grid.rowHeaderSelector.handleOnMouseUp();
        }
        this.grid.statisticsManager.updateStatistics();
        this.grid.HEADER_SELECTION_TYPE = null;
    }
}
