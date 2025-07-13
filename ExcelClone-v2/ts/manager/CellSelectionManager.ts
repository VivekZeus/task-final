import { Grid } from "../Grid.js";
import { PointerEventManager } from "./PointerEventManager.js";
import { Utils } from "../Utils.js";

export class CellSelectionManager implements PointerEventManager {
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }
  test(
    x: number,
    y: number,
    e: PointerEvent,
    startRow?: number,
    endRow?: number,
    startCol?: number,
    endCol?: number,
    scrollLeft?: number,
    scrollTop?: number
  ): boolean {
    return this.grid.IS_SELECTING == false;
  }

  onPointerDown(
    x: number,
    y: number,
    e: PointerEvent,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number
  ): void {
    this.grid.SELECTED_COL_HEADER = -1;
    this.grid.SELECTED_ROW_HEADER = -1;
    this.grid.SELECTED_COL_RANGE = null;
    this.grid.SELECTED_ROW_RANGE = null;

    if (!this.grid.INPUT_FINALIZED && this.grid.CURRENT_INPUT != null) {
      console.log("input saved  by cell manager at ",Date.now() / 1000);
      this.grid.cellDataManager.saveInputToCell();
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

  onPointerMove(
    x: number,
    y: number,
    event: PointerEvent,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number
  ): void {
    let selCol = this.grid.getSelectedCol(startCol, endCol, x);
    let selRow = this.grid.getSelectedRow(startRow, endRow, y);

    if (this.grid.SELECTED_CELL_RANGE) {
      this.grid.SELECTED_CELL_RANGE.endRow = selRow;
      this.grid.SELECTED_CELL_RANGE.endCol = selCol;
    }
    this.grid.autoScrollManager.checkAutoScroll(event);
    this.grid.render();
  }
  
  onPointerUp(
    x: number,
    y: number,
    e: PointerEvent
  ): void {
     if (this.grid.IS_SELECTING == true) {
    this.grid.IS_SELECTING = false;
    this.grid.autoScrollManager.stopAutoScroll();
    this.grid.statisticsManager.updateStatistics();
  }
  }

  // handleMouseDown(
  //   startCol: number,
  //   endCol: number,
  //   startRow: number,
  //   endRow: number,
  //   x: number,
  //   y: number
  // ) {
  //   let selCol = this.grid.getSelectedCol(startCol, endCol, x);
  //   let selRow = this.grid.getSelectedRow(startRow, endRow, y);

  //   if (!this.grid.SELECTED_CELL_RANGE) {
  //     this.grid.SELECTED_CELL_RANGE = {
  //       startRow: 0,
  //       endRow: 0,
  //       startCol: 0,
  //       endCol: 0,
  //     };
  //   }

  //   this.grid.SELECTED_CELL_RANGE.startCol = selCol;
  //   this.grid.SELECTED_CELL_RANGE.endCol = selCol;
  //   this.grid.SELECTED_CELL_RANGE.startRow = selRow;
  //   this.grid.SELECTED_CELL_RANGE.endRow = selRow;
  //   this.grid.IS_SELECTING = true;
  // }

  // handleMouseMove(
  //   startCol: number,
  //   endCol: number,
  //   startRow: number,
  //   endRow: number,
  //   x: number,
  //   y: number
  // ) {
  //   let selCol = this.grid.getSelectedCol(startCol, endCol, x);
  //   let selRow = this.grid.getSelectedRow(startRow, endRow, y);

  //   if (this.grid.SELECTED_CELL_RANGE) {
  //     this.grid.SELECTED_CELL_RANGE.endRow = selRow;
  //     this.grid.SELECTED_CELL_RANGE.endCol = selCol;
  //   }
  // }

  // updateCellSelectionInfo() {
  //   const { startCol, startRow } = this.grid.SELECTED_CELL_RANGE;
  //   let char = Utils.numberToColheader(startCol);
  //   const cellElement = document.getElementById("cellInfo") as HTMLDivElement;
  //   if (cellElement) {
  //     cellElement.innerHTML = `${char}${startRow + 1}`;
  //   }
  // }
}
