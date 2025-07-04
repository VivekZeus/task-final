import { Utils } from "./Utils.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { Config } from "./Config.js";

// export class RowHeaderSelector {
//   static handleOnMouseDown(startRow, endRow, y, scrollTop) {
//     // Row header click
//     let selRow = Utils.getSelectedRow(startRow, endRow, y);
//     Config.SELECTED_ROW_HEADER = selRow + 1;
//     let y1Pos = PrefixArrayManager.getRowYPosition(selRow);
//     let adjustedY1 = y1Pos - scrollTop;
//     Config.ADJUSTED_y1 = adjustedY1;
//     Config.SELECTED_CELL_RANGE = {
//       startRow: selRow,
//       endRow: selRow,
//       startCol: 0,
//       endCol: Config.TOTAL_COLUMNS - 1,
//     };
//     // Clear column selection when selecting row
//     Config.SELECTED_COL_HEADER = -1;
//   }
// }


// export class RowHeaderSelector {
//   static handleOnMouseDown(startRow,endRow,y,scrollTop) {
//     // Row header click
//     let selRow = Utils.getSelectedRow(startRow, endRow, y);
//     Config.SELECTED_ROW_HEADER = selRow + 1;
//     Config.HEADER_SELECTION_START_ROW = selRow;
//     Config.HEADER_SELECTION_END_ROW = selRow;
//     let y1Pos = PrefixArrayManager.getRowYPosition(selRow);
//     let adjustedY1 = y1Pos - scrollTop;
//     Config.ADJUSTED_y1 = adjustedY1;
//     Config.SELECTED_CELL_RANGE = {
//       startRow: selRow,
//       endRow: selRow,
//       startCol: 0,
//       endCol: Config.TOTAL_COLUMNS - 1,
//     };
//     // Clear column selection when selecting row
//     Config.SELECTED_COL_HEADER = -1;
//   }

//   static handleOnMouseMove(startRow,endRow,y,scrollTop) {
//     let currentRow = Utils.getSelectedRow(startRow, endRow, y);
    
//     // Clamp the row to valid range
//     currentRow = Math.max(0, Math.min(currentRow, Config.TOTAL_ROWS - 1));
    
//     Config.HEADER_SELECTION_END_ROW = currentRow;
    
//     // Update the selection range
//     let minRow = Math.min(Config.HEADER_SELECTION_START_ROW, Config.HEADER_SELECTION_END_ROW);
//     let maxRow = Math.max(Config.HEADER_SELECTION_START_ROW, Config.HEADER_SELECTION_END_ROW);
    
//     Config.SELECTED_CELL_RANGE = {
//       startRow: minRow,
//       endRow: maxRow,
//       startCol: 0,
//       endCol: Config.TOTAL_COLUMNS - 1,
//     };
    
//     // Update visual indicators
//     Config.SELECTED_ROW_HEADER = Config.HEADER_SELECTION_START_ROW + 1; // Keep original selection visible
//   }
// }



export class RowHeaderSelector {
  static handleOnMouseDown(startRow,endRow,y,scrollTop) {
    // Row header click
    let selRow = Utils.getSelectedRow(startRow, endRow, y);
    Config.SELECTED_ROW_HEADER = selRow + 1;
    Config.HEADER_SELECTION_START_ROW = selRow;
    Config.HEADER_SELECTION_END_ROW = selRow;
    let y1Pos = PrefixArrayManager.getRowYPosition(selRow);
    let adjustedY1 = y1Pos - scrollTop;
    Config.ADJUSTED_y1 = adjustedY1;
    Config.SELECTED_CELL_RANGE = {
      startRow: selRow,
      endRow: selRow,
      startCol: 0,
      endCol: Config.TOTAL_COLUMNS - 1,
    };
    // Clear column selection when selecting row
    Config.SELECTED_COL_HEADER = -1;
    Config.SELECTED_COL_RANGE = null;
  }

  static handleOnMouseMove(startRow,endRow,y,scrollTop) {
    let currentRow = Utils.getSelectedRow(startRow, endRow, y);
    
    // Clamp the row to valid range
    currentRow = Math.max(0, Math.min(currentRow, Config.TOTAL_ROWS - 1));
    
    Config.HEADER_SELECTION_END_ROW = currentRow;
    
    // Update the selection range
    let minRow = Math.min(Config.HEADER_SELECTION_START_ROW, Config.HEADER_SELECTION_END_ROW);
    let maxRow = Math.max(Config.HEADER_SELECTION_START_ROW, Config.HEADER_SELECTION_END_ROW);
    
    Config.SELECTED_CELL_RANGE = {
      startRow: minRow,
      endRow: maxRow,
      startCol: 0,
      endCol: Config.TOTAL_COLUMNS - 1,
    };
    
    // Update visual indicators
    Config.SELECTED_ROW_HEADER = Config.HEADER_SELECTION_START_ROW + 1; // Keep original selection visible
  }

  static handleOnMouseUp() {
    // Finalize the selection - store the full range
    let minRow = Math.min(Config.HEADER_SELECTION_START_ROW, Config.HEADER_SELECTION_END_ROW);
    let maxRow = Math.max(Config.HEADER_SELECTION_START_ROW, Config.HEADER_SELECTION_END_ROW);
    
    // Store the range for persistent highlighting
    Config.SELECTED_ROW_RANGE = {
      startRow: minRow,
      endRow: maxRow
    };
    
    // Keep the original selected row header for compatibility
    Config.SELECTED_ROW_HEADER = Config.HEADER_SELECTION_START_ROW + 1;
  }
}