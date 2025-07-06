import { Utils } from "./Utils.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { Config } from "./Config.js";


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
      Config.HEADER_SELECTION_START_COL = -1;
  Config.HEADER_SELECTION_END_COL = -1;
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

  static handleKeyboardSelection(event) {
    // Check if we have a valid row selection started
    if (Config.HEADER_SELECTION_START_ROW === -1 || Config.HEADER_SELECTION_END_ROW === -1) {
      return false; // No selection to extend
    }

    if (event.shiftKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      let currentRow;
      
      if (event.key === 'ArrowDown') {
        currentRow = Config.HEADER_SELECTION_END_ROW + 1;
      } else if (event.key === 'ArrowUp') {
        currentRow = Config.HEADER_SELECTION_END_ROW - 1;
      }
      
      // Clamp the row to valid range (same as mouse move)
      currentRow = Math.max(0, Math.min(currentRow, Config.TOTAL_ROWS - 1));
      
      Config.HEADER_SELECTION_END_ROW = currentRow;
      
      // Update the selection range (same as mouse move)
      let minRow = Math.min(Config.HEADER_SELECTION_START_ROW, Config.HEADER_SELECTION_END_ROW);
      let maxRow = Math.max(Config.HEADER_SELECTION_START_ROW, Config.HEADER_SELECTION_END_ROW);
      
      Config.SELECTED_CELL_RANGE = {
        startRow: minRow,
        endRow: maxRow,
        startCol: 0,
        endCol: Config.TOTAL_COLUMNS - 1,
      };
      
      // Update visual indicators (same as mouse move)
      Config.SELECTED_ROW_HEADER = Config.HEADER_SELECTION_START_ROW + 1; // Keep original selection visible
      
      // Finalize the selection (same as mouse up)
      Config.SELECTED_ROW_RANGE = {
        startRow: minRow,
        endRow: maxRow
      };
      
      return true; // Selection was handled
    }
    
    return false; // Key event not handled
  }
}