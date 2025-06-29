
import { Config } from "./Config.js";

export class Utils {
  constructor() {}

  static getPosition(row, col) {
    let y = 0;
    let x = 0;
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
