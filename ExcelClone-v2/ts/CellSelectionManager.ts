import { Grid } from "./Grid.js";

export class CellSelectionManager {
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }

  handleMouseDown(
    startCol: number,
    endCol: number,
    startRow: number,
    endRow: number,
    x: number,
    y: number
  ) {
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

   handleMouseMove(startCol:number, endCol:number, startRow:number, endRow:number, x:number, y:number) {
    let selCol = this.grid.getSelectedCol(startCol, endCol, x);
    let selRow = this.grid.getSelectedRow(startRow, endRow, y);

    if (this.grid.SELECTED_CELL_RANGE) {
      this.grid.SELECTED_CELL_RANGE.endRow = selRow;
      this.grid.SELECTED_CELL_RANGE.endCol = selCol;
    }
  }
}
