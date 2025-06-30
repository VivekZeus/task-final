import { Config } from "./Config.js";

export class Utils {
  constructor() {}

  // static getPosition(startRow,endRow,startCol,endCol) {
  //   let y = 0;
  //   let x = Config.ROW_HEADER_WIDTH;
  //   for (let r = startRow; r < endRow; r++) {
  //     y += Config.ROW_HEIGHTS[r];
  //   }
  //   for (let c = startCol; c < endCol; c++) {
  //     x += Config.COL_WIDTHS[c];
  //   }
  //   return { x, y };
  // }

  static getPosition(row, col) {
    let y = Config.COL_HEADER_HEIGHT; // Always leave header height at top
    let x = Config.ROW_HEADER_WIDTH; // Always leave row header width on left

    for (let r = 0; r < row; r++) {
      y += Config.ROW_HEIGHTS[r];
    }
    for (let c = 0; c < col; c++) {
      x += Config.COL_WIDTHS[c];
    }
    return { x, y };
  }

  static numberToColheader(num) {
    let colHeader = "";
    while (num > 0) {
      let remainder = (num - 1) % 26;
      colHeader = String.fromCharCode(65 + remainder) + colHeader;
      num = Math.floor((num - 1) / 26);
    }
    return colHeader;
  }
}
