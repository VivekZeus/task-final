import { Grid } from "../Grid";
import { Command } from "./command";

export class ResizeColumnCommand implements Command {
  oldWidth: number;
  newWidth: number;
  grid: Grid;
  columnIndex: number;

  constructor(
    grid: Grid,
    columnIndex: number,
    oldWidth: number,
    newWidth: number
  ) {
    this.grid = grid;
    this.columnIndex = columnIndex;
    this.oldWidth = oldWidth;
    this.newWidth = newWidth;
  }

  execute(): void {
    this.grid.COL_WIDTHS.set(this.columnIndex,this.newWidth);
    this.grid.prefixArrayManager.updateColumnWidthExecute(this.columnIndex,this.oldWidth,this.newWidth);
  }

  undo(): void {
    this.grid.COL_WIDTHS.set(this.columnIndex, this.oldWidth);
    this.grid.prefixArrayManager.updateColumnWidthUndo(this.columnIndex,this.oldWidth,this.newWidth);
  }
}