import { Config } from "./Config.js";
import { ColHeaderSelector } from "./ColHeaderSelector.js";
import { RowHeaderSelector } from "./RowHeaderSelector.js";

// export class HeaderSelectionManager {
//   static handleOnMouseDown(startCol,startRow,endCol,endRow,scrollLeft,scrollTop,x,y) {
//     if (y < Config.COL_HEADER_HEIGHT && x > Config.ROW_HEADER_WIDTH) {
//         ColHeaderSelector.handleOnMouseDown(startCol,endCol,x,scrollLeft);
//     } else {
//         RowHeaderSelector.handleOnMouseDown(startRow,endRow,y,scrollTop);
//     }
//   }
// }

// export class HeaderSelectionManager {
//   static handleOnMouseDown(startCol,startRow,endCol,endRow,scrollLeft,scrollTop,x,y) {
//     Config.IS_SELECTING_HEADER = true;

//     if (y < Config.COL_HEADER_HEIGHT && x > Config.ROW_HEADER_WIDTH) {
//         ColHeaderSelector.handleOnMouseDown(startCol,endCol,x,scrollLeft);
//         Config.HEADER_SELECTION_TYPE = 'column';
//     } else {
//         RowHeaderSelector.handleOnMouseDown(startRow,endRow,y,scrollTop);
//         Config.HEADER_SELECTION_TYPE = 'row';
//     }
//   }

//   static handleOnMouseMove(startCol,startRow,endCol,endRow,scrollLeft,scrollTop,x,y) {
//     if (Config.HEADER_SELECTION_TYPE === 'column') {
//       ColHeaderSelector.handleOnMouseMove(startCol,endCol,x,scrollLeft);
//     } else if (Config.HEADER_SELECTION_TYPE === 'row') {
//       RowHeaderSelector.handleOnMouseMove(startRow,endRow,y,scrollTop);
//     }
//   }
// }

export class HeaderSelectionManager {
  static handleOnMouseDown(
    startCol,
    startRow,
    endCol,
    endRow,
    scrollLeft,
    scrollTop,
    x,
    y
  ) {
    Config.IS_SELECTING_HEADER = true;

    if (y < Config.COL_HEADER_HEIGHT && x > Config.ROW_HEADER_WIDTH) {
      ColHeaderSelector.handleOnMouseDown(startCol, endCol, x, scrollLeft);
      Config.HEADER_SELECTION_TYPE = "column";
    } else {
      RowHeaderSelector.handleOnMouseDown(startRow, endRow, y, scrollTop);
      Config.HEADER_SELECTION_TYPE = "row";
    }
  }

  static handleOnMouseMove(
    startCol,
    startRow,
    endCol,
    endRow,
    scrollLeft,
    scrollTop,
    x,
    y
  ) {
    if (Config.HEADER_SELECTION_TYPE === "column") {
      ColHeaderSelector.handleOnMouseMove(startCol, endCol, x, scrollLeft);
    } else if (Config.HEADER_SELECTION_TYPE === "row") {
      RowHeaderSelector.handleOnMouseMove(startRow, endRow, y, scrollTop);
    }
  }
  static handleOnMouseUp() {
    if (Config.HEADER_SELECTION_TYPE === "column") {
      ColHeaderSelector.handleOnMouseUp();
    } else if (Config.HEADER_SELECTION_TYPE === "row") {
      RowHeaderSelector.handleOnMouseUp();
    }
    Config.HEADER_SELECTION_TYPE = null;
  }
}
