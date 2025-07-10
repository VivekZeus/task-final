import { ColHeaderSelector } from "./ColHeaderSelector.js";
import { RowHeaderSelector } from "./RowHeaderSelector.js";
export class HeaderSelectionManager {
    constructor(gridObj) {
        this.grid = gridObj;
        this.rowHeaderSelector = new RowHeaderSelector(gridObj);
        this.colHeaderSelector = new ColHeaderSelector(gridObj);
    }
    test(x, y, e) {
        return ((y < this.grid.COL_HEADER_HEIGHT && x > this.grid.ROW_HEADER_WIDTH) ||
            (y > this.grid.COL_HEADER_HEIGHT && x < this.grid.ROW_HEADER_WIDTH));
    }
    onPointerDown(x, y, e, startRow, endRow, startCol, endCol, scrollLeft, scrollTop) {
        this.grid.IS_SELECTING_HEADER = true;
        if (y < this.grid.COL_HEADER_HEIGHT && x > this.grid.ROW_HEADER_WIDTH) {
            this.colHeaderSelector.handleOnMouseDown(startCol, endCol, x, scrollLeft);
            this.grid.HEADER_SELECTION_TYPE = "column";
        }
        else {
            this.rowHeaderSelector.handleOnMouseDown(startRow, endRow, y, scrollTop);
            this.grid.HEADER_SELECTION_TYPE = "row";
        }
        this.grid.render();
    }
    onPointerMove(x, y, event, startRow, endRow, startCol, endCol, scrollLeft, scrollTop) {
        if (this.grid.HEADER_SELECTION_TYPE === "column") {
            this.colHeaderSelector.handleOnMouseMove(startCol, endCol, x, scrollLeft);
            this.grid.autoScrollManager.checkAutoScroll(event);
        }
        else if (this.grid.HEADER_SELECTION_TYPE === "row") {
            this.rowHeaderSelector.handleOnMouseMove(startRow, endRow, y, scrollTop);
            this.grid.autoScrollManager.checkAutoScroll(event);
        }
        this.grid.render();
    }
    onPointerUp(x, y, event) {
        if (this.grid.HEADER_SELECTION_TYPE === "column") {
            this.colHeaderSelector.handleOnMouseUp();
        }
        else if (this.grid.HEADER_SELECTION_TYPE === "row") {
            this.rowHeaderSelector.handleOnMouseUp();
        }
        this.grid.statisticsManager.updateStatistics();
        this.grid.HEADER_SELECTION_TYPE = null;
        this.grid.autoScrollManager.stopAutoScroll();
        this.grid.IS_SELECTING_HEADER = false;
    }
}
