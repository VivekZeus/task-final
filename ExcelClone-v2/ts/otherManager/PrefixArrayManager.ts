
import { Grid } from "../Grid.js";

export class PrefixArrayManager {

    public rowPrefixArray:Array<number>=[];
    public colPrefixArray :Array<number>=[];
    public latestEndRow = -1;
    public latestEndCol = -1;
    public grid:Grid;

  constructor(grid:Grid) {
    this.grid=grid;
  }

  createRowPrefixArray(endRow:number) :void{
    if (this.latestEndRow >= endRow) return;
    if (this.rowPrefixArray.length === 0) {
      this.rowPrefixArray[0] = this.grid.COL_HEADER_HEIGHT;
      this.latestEndRow = 0;
    }

    for (let i = this.latestEndRow + 1; i <= endRow; i++) {
      this.rowPrefixArray.push(
        this.rowPrefixArray[i - 1] +
          (this.grid.ROW_HEIGHTS.get(i) ?? this.grid.DEFAULT_ROW_HEIGHT)
      );
    }
    this.latestEndRow = endRow;
  }

  createColPrefixArray(endCol:number) {
    if (this.latestEndCol >= endCol) return;
    if (this.colPrefixArray.length === 0) {
      this.colPrefixArray[0] = this.grid.ROW_HEADER_WIDTH;
      this.latestEndCol = 0;
    }

    for (let i = this.latestEndCol + 1; i <= endCol; i++) {
      this.colPrefixArray.push(
        this.colPrefixArray[i - 1] + (this.grid.COL_WIDTHS.get(i) ?? this.grid.DEFAULT_COL_WIDTH)
      );
    }

    this.latestEndCol = endCol;
  }

  getColXPosition(columnIndex:number) {
    return this.colPrefixArray[columnIndex];
  }

  getRowYPosition(rowIndex:number) {
    return this.rowPrefixArray[rowIndex];
  }

  updateColumnWidth(colIndex:number) {
    const oldWidth = this.grid.RESIZING_COL_OLD_WIDTH?? this.grid.DEFAULT_COL_WIDTH;
    const widthDiff =
      (this.grid.COL_WIDTHS.get(colIndex) ?? this.grid.DEFAULT_COL_WIDTH) - oldWidth;

    for (let i = colIndex + 1; i < this.colPrefixArray.length; i++) {
      this.colPrefixArray[i] += widthDiff;
    }
  }

  updateRowHeight(rowIndex:number) {
    const oldHeight = this.grid.RESIZING_ROW_OLD_HEIGHT ?? this.grid.DEFAULT_ROW_HEIGHT;
    const heightDiff =
      (this.grid.ROW_HEIGHTS.get(rowIndex) ??this.grid.DEFAULT_ROW_HEIGHT) - oldHeight;

    for (let i = rowIndex + 1; i < this.rowPrefixArray.length; i++) {
      this.rowPrefixArray[i] += heightDiff;
    }
  }

  getCellPosition(row:number, col:number){
    return {
      x: this.colPrefixArray[col],
      y: this.rowPrefixArray[row],
    };
  }
}
