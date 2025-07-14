import { Grid } from "../Grid";
import { Command } from "./command";

export class ResizeRowCommand implements Command {
  oldHeight: number;
  newHeight: number;
  grid: Grid;
  rowIndex: number;

  constructor(
    grid: Grid,
    columnIndex: number,
    oldHeight: number,
    newHeight: number
  ) {
    this.grid = grid;
    this.rowIndex = columnIndex;
    this.oldHeight = oldHeight;
    this.newHeight = newHeight;
  }


  execute(): void {
    this.grid.ROW_HEIGHTS.set(this.rowIndex,this.newHeight);
    this.grid.prefixArrayManager.updateRowHeightExecute(this.rowIndex,this.oldHeight,this.newHeight);
  }

  undo(): void {
    this.grid.ROW_HEIGHTS.set(this.rowIndex, this.oldHeight);
    this.grid.prefixArrayManager.updateRowHeightUndo(this.rowIndex,this.oldHeight,this.newHeight);
  }
}
