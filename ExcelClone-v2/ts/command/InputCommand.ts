import { Grid } from "../Grid.js";
import { Command } from "./command.js";

export class InputCommand implements Command {
  row: number;
  col: number;
  grid: Grid;
  prevValue: any;
  recentValue: any;

  constructor(
    grid: Grid,
    row: number,
    col: number,
    prevValue: any,
    recentValue: any
  ) {
    this.grid = grid;
    this.row = row;
    this.col = col;
    this.prevValue = prevValue;
    this.recentValue = recentValue;
  }

  execute(): void {
    this.setCellValue(this.recentValue);
  }

  undo(): void {
    this.setCellValue(this.prevValue);
  }

  private setCellValue(value: any): void {
    const cellManager = this.grid.cellDataManager;

    if (!cellManager.cellData.has(this.row)) {
      cellManager.cellData.set(this.row, new Map());
    }

    const colMap = cellManager.cellData.get(this.row);
    if (!colMap.has(this.col)) {
      colMap.set(this.col, {});
    }

    colMap.get(this.col).value = value;

    // Finalize input state
    this.grid.CURRENT_INPUT = null;
    this.grid.INPUT_FINALIZED = true;

    // Trigger re-render
    this.grid.render();
  }
}
