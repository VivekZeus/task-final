
import { Config } from "./Config.js";
import { Utils } from "./Utils.js";

export class CellSelectionManager {
  static handleMouseDown(startCol, endCol, startRow, endRow, x, y) {
    let selCol = Utils.getSelectedCol(startCol, endCol, x);
    let selRow = Utils.getSelectedRow(startRow, endRow, y);
    

    if (!Config.SELECTED_CELL_RANGE) {
      Config.SELECTED_CELL_RANGE = {};
    }
    
    Config.SELECTED_CELL_RANGE.startCol = selCol;
    Config.SELECTED_CELL_RANGE.endCol = selCol;
    Config.SELECTED_CELL_RANGE.startRow = selRow;
    Config.SELECTED_CELL_RANGE.endRow = selRow;
    Config.IS_SELECTING = true;
  }

  static handleMouseMove(startCol, endCol, startRow, endRow, x, y) {
    let selCol = Utils.getSelectedCol(startCol, endCol, x);
    let selRow = Utils.getSelectedRow(startRow, endRow, y);
    

    if (Config.SELECTED_CELL_RANGE) {
      Config.SELECTED_CELL_RANGE.endRow = selRow;
      Config.SELECTED_CELL_RANGE.endCol = selCol;
    }
  }
}