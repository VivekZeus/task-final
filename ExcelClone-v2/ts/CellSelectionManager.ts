import { Grid } from "./Grid.js";
import { Utils } from "./Utils.js";

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

  updateCellSelectionInfo(){
    const {startCol,startRow}=this.grid.SELECTED_CELL_RANGE;
    let char=Utils.numberToColheader(startCol);
    const cellElement=document.getElementById("cellInfo")  as HTMLDivElement;
    if(cellElement){
      cellElement.innerHTML=`${char}${startRow+1}`;
    }

  }
}
