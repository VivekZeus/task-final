import { Config } from "./Config.js";
import { Utils } from "./Utils.js";

export class MouseClickHandler {

 static handleCellClick(x, y, startRow, endRow, startCol, endCol) {

    let selCol=Utils.getSelectedCol(startCol,endCol,x);
    let selRow=Utils.getSelectedRow(startRow,endRow,y);
    Config.SELECTED_CELL.col =selCol;
    Config.SELECTED_CELL.row =selRow;
  }
}
