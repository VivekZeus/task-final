import { Config } from "./Config.js";

export class Utils {
  constructor() {}

  static getSelectedCol(startCol, endCol, x) {
    let currentX = Config.ROW_HEADER_WIDTH;
    for (let i = startCol; i <= endCol; i++) {
      currentX += Config.COL_WIDTHS[i] || Config.COL_WIDTH;
      if (currentX > x) {
        console.log("Column selected:", i);
        return i;
      }
    }
    return -1;
  }

  static getSelectedRow(startRow,endRow,y){
    let currentY = Config.COL_HEADER_HEIGHT;

    for (let i = startRow; i < endRow; i++) {
      currentY += Config.ROW_HEIGHTS[i]|| Config.ROW_HEIGHT;
      if (currentY > y) {
        console.log('Row selected:', i);
        return i;
      }
    }
    return -1;
  }

  static getPosition(row, col) {
    let y = Config.COL_HEADER_HEIGHT;
    let x = Config.ROW_HEADER_WIDTH;

    for (let r = 0; r < row; r++) {
      y += Config.ROW_HEIGHTS[r] || Config.ROW_HEIGHT;
    }
    for (let c = 0; c < col; c++) {
      x += Config.COL_WIDTHS[c] || Config.COL_WIDTH;
    }
    return { x, y };
  }

  static numberToColheader(num) {
    let colHeader = "";
    num++;
    while (num > 0) {
      let remainder = (num - 1) % 26;
      colHeader = String.fromCharCode(65 + remainder) + colHeader;
      num = Math.floor((num - 1) / 26);
    }
    return colHeader;
  }
}
