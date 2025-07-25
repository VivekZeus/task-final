import { Config } from "./Config.js";

export class PrefixArrayManager {
  static rowPrefixArray = [];
  static colPrefixArray = [];

  static latestEndRow = -1;
  static latestEndCol = -1;

  static createRowPrefixArray(endRow) {
    if (this.latestEndRow >= endRow) return;
    if (this.rowPrefixArray.length === 0) {
      this.rowPrefixArray[0] = Config.COL_HEADER_HEIGHT;
      this.latestEndRow = 0;
    }

    for (let i = this.latestEndRow + 1; i <= endRow; i++) {
      this.rowPrefixArray.push(
        this.rowPrefixArray[i - 1] +
          (Config.ROW_HEIGHTS[i] || Config.ROW_HEIGHT)
      );
    }
    this.latestEndRow = endRow;
  }

  static createColPrefixArray(endCol) {
    if (this.latestEndCol >= endCol) return;
    if (this.colPrefixArray.length === 0) {
      this.colPrefixArray[0] = Config.ROW_HEADER_WIDTH;
      this.latestEndCol = 0;
    }

    for (let i = this.latestEndCol + 1; i <= endCol; i++) {
      this.colPrefixArray.push(
        this.colPrefixArray[i - 1] + (Config.COL_WIDTHS[i] || Config.COL_WIDTH)
      );
    }

    this.latestEndCol = endCol;
  }

  static getColXPosition(columnIndex) {

    return this.colPrefixArray[columnIndex];
  }

  static getRowYPosition(rowIndex) {
    return this.rowPrefixArray[rowIndex];
  }

  static updateColumnWidth(colIndex) {
    const oldWidth = Config.RESIZING_COL_OLD_WIDTH || Config.COL_WIDTH;
    const widthDiff = (Config.COL_WIDTHS[colIndex]||Config.COL_WIDTH) - oldWidth;

    for (let i = colIndex + 1; i < this.colPrefixArray.length; i++) {
      this.colPrefixArray[i] += widthDiff;
    }
  }

  static updateRowHeight(rowIndex) {
    const oldHeight = Config.RESIZING_ROW_OLD_HEIGHT|| Config.ROW_HEIGHT;
    const heightDiff = (Config.ROW_HEIGHTS[rowIndex]|| Config.ROW_HEIGHT )- oldHeight;

    for (let i = rowIndex + 1; i < this.rowPrefixArray.length; i++) {
      this.rowPrefixArray[i] += heightDiff;
    }
  }

  static getCellPosition(row,col){
    return {
      x:this.colPrefixArray[col],
      y:this.rowPrefixArray[row]
    }  }
}
