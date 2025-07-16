import { Grid } from "../Grid.js";
import { PointerEventManager } from "./PointerEventManager.js";
import { Utils } from "../Utils.js";
import { InputCommand } from "../command/InputCommand.js";

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

  onPointerUp(x: number, y: number, e: PointerEvent): void {
    if (this.grid.IS_SELECTING == true) {
      this.grid.IS_SELECTING = false;
      this.grid.autoScrollManager.stopAutoScroll();
      this.grid.statisticsManager.updateStatistics();
    }
  }


}
