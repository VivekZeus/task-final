import { Config } from "./config.js";


export class RowColumnManager {

  static getColumnWidthSum() {
    let sum = 0;
    for (let i = 0; i < Config.colWidths.length; i++) {
      sum += Config.colWidths[i];
    }
    return sum;
  }

  static getRowHeightSum() {
    let sum = 0;
    for (let i = 0; i < Config.rowHeights.length; i++) {
      sum += Config.rowHeights[i];
    }
    return sum;
  }
}
