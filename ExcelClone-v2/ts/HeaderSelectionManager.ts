
import { Grid } from "./Grid.js";

export class HeaderSelectionManager {

    grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }

   handleOnMouseDown(
    startCol:number,
    startRow:number,
    endCol:number,
    endRow:number,
    scrollLeft:number,
    scrollTop:number,
    x:number,
    y:number
  ) {
    this.grid.IS_SELECTING_HEADER = true;

    if (y < this.grid.COL_HEADER_HEIGHT && x > this.grid.ROW_HEADER_WIDTH) {
      this.grid.colHeaderSelector.handleOnMouseDown(startCol, endCol, x, scrollLeft);
      this.grid.HEADER_SELECTION_TYPE = "column";
    } else {
      this.grid.rowHeaderSelector.handleOnMouseDown(startRow, endRow, y, scrollTop);
      this.grid.HEADER_SELECTION_TYPE = "row";
    }
  }

   handleOnMouseMove(
    startCol:number,
    startRow:number,
    endCol:number,
    endRow:number,
    scrollLeft:number,
    scrollTop:number,
    x:number,
    y:number
  ) {
    if (this.grid.HEADER_SELECTION_TYPE === "column") {
      this.grid.colHeaderSelector.handleOnMouseMove(startCol, endCol, x, scrollLeft);
    } else if (this.grid.HEADER_SELECTION_TYPE === "row") {
      this.grid.rowHeaderSelector.handleOnMouseMove(startRow, endRow, y, scrollTop);
    }
  }
   handleOnMouseUp() {
    if (this.grid.HEADER_SELECTION_TYPE === "column") {
      this.grid.colHeaderSelector.handleOnMouseUp();
    } else if (this.grid.HEADER_SELECTION_TYPE === "row") {
      this.grid.rowHeaderSelector.handleOnMouseUp();
    }
    this.grid.statisticsManager.updateStatistics();
    this.grid.HEADER_SELECTION_TYPE = null;
  }
}
