import { Config } from "./Config.js";
import { Draw } from "./Draw.js";

export class MouseClickHandler {
  static handleCellClick(
    x,
    y,
    startRow,
    endRow,
    startCol,
    endCol,

  ) {
    let currentX = Config.ROW_HEADER_WIDTH;
    let currentY = Config.COL_HEADER_HEIGHT;
    let rowSelected = -1;
    let colSelected = -1;



    for (let i = startCol; i <= endCol; i++) {
      currentX += Config.COL_WIDTHS[i];
      if (currentX > x) {
        colSelected = i;
        Config.SELECTED_CELL.col = i;
        break;
      }
    }

    for (let i = startRow; i < endRow; i++) {
      currentY += Config.ROW_HEIGHTS[i];
      if (currentY > y) {
        rowSelected = i;
        Config.SELECTED_CELL.row = i;
        break;
      }
    }

    
  }
}
