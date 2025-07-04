import { Utils } from "./Utils.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { Config } from "./Config.js";

// export class ColHeaderSelector {
//   static handleOnMouseDown(startCol,endCol,x,scrollLeft) {
//     // Column header click
//     let selCol = Utils.getSelectedCol(startCol, endCol, x);
//     Config.SELECTED_COL_HEADER = selCol + 1;
//     let x1Pos = PrefixArrayManager.getColXPosition(selCol);
//     let adjustedX1 = x1Pos - scrollLeft;
//     Config.ADJUSTED_x1 = adjustedX1;
//     Config.SELECTED_CELL_RANGE = {
//       startRow: 0,
//       endRow: Config.TOTAL_ROWS - 1,
//       startCol: selCol,
//       endCol: selCol,
//     };
//     // Clear row selection when selecting column
//     Config.SELECTED_ROW_HEADER = -1;
//   }
// }


// export class ColHeaderSelector {
//   static handleOnMouseDown(startCol,endCol,x,scrollLeft) {
//     // Column header click
//     let selCol = Utils.getSelectedCol(startCol, endCol, x);
//     Config.SELECTED_COL_HEADER = selCol + 1;
//     Config.HEADER_SELECTION_START_COL = selCol;
//     Config.HEADER_SELECTION_END_COL = selCol;
//     let x1Pos = PrefixArrayManager.getColXPosition(selCol);
//     let adjustedX1 = x1Pos - scrollLeft;
//     Config.ADJUSTED_x1 = adjustedX1;
//     Config.SELECTED_CELL_RANGE = {
//       startRow: 0,
//       endRow: Config.TOTAL_ROWS - 1,
//       startCol: selCol,
//       endCol: selCol,
//     };
//     // Clear row selection when selecting column
//     Config.SELECTED_ROW_HEADER = -1;
//   }

//   static handleOnMouseMove(startCol,endCol,x,scrollLeft) {
//     let currentCol = Utils.getSelectedCol(startCol, endCol, x);
    
//     // Clamp the column to valid range
//     currentCol = Math.max(0, Math.min(currentCol, Config.TOTAL_COLUMNS - 1));
    
//     Config.HEADER_SELECTION_END_COL = currentCol;
    
//     // Update the selection range
//     let minCol = Math.min(Config.HEADER_SELECTION_START_COL, Config.HEADER_SELECTION_END_COL);
//     let maxCol = Math.max(Config.HEADER_SELECTION_START_COL, Config.HEADER_SELECTION_END_COL);
    
//     Config.SELECTED_CELL_RANGE = {
//       startRow: 0,
//       endRow: Config.TOTAL_ROWS - 1,
//       startCol: minCol,
//       endCol: maxCol,
//     };
    
//     // Update visual indicators
//     Config.SELECTED_COL_HEADER = Config.HEADER_SELECTION_START_COL + 1; // Keep original selection visible
//   }
// }


export class ColHeaderSelector {
  static handleOnMouseDown(startCol,endCol,x,scrollLeft) {
    // Column header click
    let selCol = Utils.getSelectedCol(startCol, endCol, x);
    Config.SELECTED_COL_HEADER = selCol + 1;
    Config.HEADER_SELECTION_START_COL = selCol;
    Config.HEADER_SELECTION_END_COL = selCol;
    let x1Pos = PrefixArrayManager.getColXPosition(selCol);
    let adjustedX1 = x1Pos - scrollLeft;
    Config.ADJUSTED_x1 = adjustedX1;
    Config.SELECTED_CELL_RANGE = {
      startRow: 0,
      endRow: Config.TOTAL_ROWS - 1,
      startCol: selCol,
      endCol: selCol,
    };
    // Clear row selection when selecting column
    Config.SELECTED_ROW_HEADER = -1;
    Config.SELECTED_ROW_RANGE = null;
  }

  static handleOnMouseMove(startCol,endCol,x,scrollLeft) {
    let currentCol = Utils.getSelectedCol(startCol, endCol, x);
    
    // Clamp the column to valid range
    currentCol = Math.max(0, Math.min(currentCol, Config.TOTAL_COLUMNS - 1));
    
    Config.HEADER_SELECTION_END_COL = currentCol;
    
    // Update the selection range
    let minCol = Math.min(Config.HEADER_SELECTION_START_COL, Config.HEADER_SELECTION_END_COL);
    let maxCol = Math.max(Config.HEADER_SELECTION_START_COL, Config.HEADER_SELECTION_END_COL);
    
    Config.SELECTED_CELL_RANGE = {
      startRow: 0,
      endRow: Config.TOTAL_ROWS - 1,
      startCol: minCol,
      endCol: maxCol,
    };
    
    // Update visual indicators
    Config.SELECTED_COL_HEADER = Config.HEADER_SELECTION_START_COL + 1; // Keep original selection visible
  }

  static handleOnMouseUp() {
    // Finalize the selection - store the full range
    let minCol = Math.min(Config.HEADER_SELECTION_START_COL, Config.HEADER_SELECTION_END_COL);
    let maxCol = Math.max(Config.HEADER_SELECTION_START_COL, Config.HEADER_SELECTION_END_COL);
    
    // Store the range for persistent highlighting
    Config.SELECTED_COL_RANGE = {
      startCol: minCol,
      endCol: maxCol
    };
    
    // Keep the original selected column header for compatibility
    Config.SELECTED_COL_HEADER = Config.HEADER_SELECTION_START_COL + 1;
  }
}