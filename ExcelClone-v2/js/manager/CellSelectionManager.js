export class CellSelectionManager {
    constructor(gridObj) {
        this.grid = gridObj;
    }
    test(x, y, e, startRow, endRow, startCol, endCol, scrollLeft, scrollTop) {
        return this.grid.IS_SELECTING == false;
    }
    onPointerDown(x, y, e, startRow, endRow, startCol, endCol) {
        this.grid.SELECTED_COL_HEADER = -1;
        this.grid.SELECTED_ROW_HEADER = -1;
        this.grid.SELECTED_COL_RANGE = null;
        this.grid.SELECTED_ROW_RANGE = null;
        // if (!this.grid.INPUT_FINALIZED && this.grid.CURRENT_INPUT != null) {
        //   console.log("input saved  by cell manager at ",Date.now() / 1000);
        //   this.grid.cellDataManager.saveInputToCell();
        // }
        if (!this.grid.INPUT_FINALIZED && this.grid.CURRENT_INPUT != null) {
            this.grid.cellDataManager.saveInputToCell();
            this.grid.CURRENT_INPUT = null;
            this.grid.INPUT_FINALIZED = true;
        }
        let selCol = this.grid.getSelectedCol(startCol, endCol, x);
        let selRow = this.grid.getSelectedRow(startRow, endRow, y);
        if (!this.grid.SELECTED_CELL_RANGE) {
            this.grid.SELECTED_CELL_RANGE = {
                startRow: 0,
                endRow: 0,
                startCol: 0,
                endCol: 0,
            };
        }
        this.grid.SELECTED_CELL_RANGE.startCol = selCol;
        this.grid.SELECTED_CELL_RANGE.endCol = selCol;
        this.grid.SELECTED_CELL_RANGE.startRow = selRow;
        this.grid.SELECTED_CELL_RANGE.endRow = selRow;
        this.grid.IS_SELECTING = true;
    }
    onPointerMove(x, y, event, startRow, endRow, startCol, endCol) {
        let selCol = this.grid.getSelectedCol(startCol, endCol, x);
        let selRow = this.grid.getSelectedRow(startRow, endRow, y);
        if (this.grid.SELECTED_CELL_RANGE) {
            this.grid.SELECTED_CELL_RANGE.endRow = selRow;
            this.grid.SELECTED_CELL_RANGE.endCol = selCol;
        }
        this.grid.autoScrollManager.checkAutoScroll(event);
        this.grid.render();
    }
    onPointerUp(x, y, e) {
        if (this.grid.IS_SELECTING == true) {
            this.grid.IS_SELECTING = false;
            this.grid.autoScrollManager.stopAutoScroll();
            this.grid.statisticsManager.updateStatistics();
        }
    }
}
