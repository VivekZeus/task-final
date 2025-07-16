import { InputCommand } from "../command/InputCommand.js";
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
        if (!this.grid.INPUT_FINALIZED && this.grid.CURRENT_INPUT != null) {
            let row = this.grid.SELECTED_CELL_RANGE.startRow;
            let col = this.grid.SELECTED_CELL_RANGE.startCol;
            let prev = this.grid.cellDataManager.getCellValue(row, col);
            let recent = this.grid.CURRENT_INPUT;
            let command = new InputCommand(this.grid, row, col, prev, recent);
            this.grid.commandManager.execute(command);
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
