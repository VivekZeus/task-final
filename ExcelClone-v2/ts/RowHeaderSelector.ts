import { Grid } from "./Grid.js";



export class RowHeaderSelector {

    grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }

   handleOnMouseDown(startRow:number,endRow:number,y:number,scrollTop:number) {
    // Row header click
    let selRow = this.grid.getSelectedRow(startRow, endRow, y);
    this.grid.SELECTED_ROW_HEADER = selRow + 1;
    this.grid.HEADER_SELECTION_START_ROW = selRow;
    this.grid.HEADER_SELECTION_END_ROW = selRow;
    let y1Pos = this.grid.prefixArrayManager.getRowYPosition(selRow);
    let adjustedY1 = y1Pos - scrollTop;
    this.grid.ADJUSTED_y1 = adjustedY1;
    this.grid.SELECTED_CELL_RANGE = {
      startRow: selRow,
      endRow: selRow,
      startCol: 0,
      endCol: this.grid.TOTAL_COLUMNS - 1,
    };
    // Clear column selection when selecting row
    this.grid.SELECTED_COL_HEADER = -1;
    this.grid.SELECTED_COL_RANGE = null;
      this.grid.HEADER_SELECTION_START_COL = -1;
  this.grid.HEADER_SELECTION_END_COL = -1;
  }

   handleOnMouseMove(startRow:number,endRow:number,y:number,scrollTop:number) {
    let currentRow = this.grid.getSelectedRow(startRow, endRow, y);
    
    // Clamp the row to valid range
    currentRow = Math.max(0, Math.min(currentRow, this.grid.TOTAL_ROWS - 1));
    
    this.grid.HEADER_SELECTION_END_ROW = currentRow;
    
    // Update the selection range
    let minRow = Math.min(this.grid.HEADER_SELECTION_START_ROW, this.grid.HEADER_SELECTION_END_ROW);
    let maxRow = Math.max(this.grid.HEADER_SELECTION_START_ROW, this.grid.HEADER_SELECTION_END_ROW);
    
    this.grid.SELECTED_CELL_RANGE = {
      startRow: minRow,
      endRow: maxRow,
      startCol: 0,
      endCol: this.grid.TOTAL_COLUMNS - 1,
    };
    
    // Update visual indicators
    this.grid.SELECTED_ROW_HEADER = this.grid.HEADER_SELECTION_START_ROW + 1; // Keep original selection visible
  }

   handleOnMouseUp() {
    // Finalize the selection - store the full range
    let minRow = Math.min(this.grid.HEADER_SELECTION_START_ROW, this.grid.HEADER_SELECTION_END_ROW);
    let maxRow = Math.max(this.grid.HEADER_SELECTION_START_ROW, this.grid.HEADER_SELECTION_END_ROW);
    
    // Store the range for persistent highlighting
    this.grid.SELECTED_ROW_RANGE = {
      startRow: minRow,
      endRow: maxRow
    };
    
    // Keep the original selected row header for compatibility
    this.grid.SELECTED_ROW_HEADER = this.grid.HEADER_SELECTION_START_ROW + 1;
  }

   handleKeyboardSelection(event:KeyboardEvent) {
    // Check if we have a valid row selection started
    if (this.grid.HEADER_SELECTION_START_ROW === -1 || this.grid.HEADER_SELECTION_END_ROW === -1) {
      return false; // No selection to extend
    }

    if (event.shiftKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      let currentRow=0;
      
      if (event.key === 'ArrowDown') {
        currentRow = this.grid.HEADER_SELECTION_END_ROW + 1;
      } else if (event.key === 'ArrowUp') {
        currentRow = this.grid.HEADER_SELECTION_END_ROW - 1;
      }
      
      // Clamp the row to valid range (same as mouse move)
      currentRow = Math.max(0, Math.min(currentRow, this.grid.TOTAL_ROWS - 1));
      
      this.grid.HEADER_SELECTION_END_ROW = currentRow;
      
      // Update the selection range (same as mouse move)
      let minRow = Math.min(this.grid.HEADER_SELECTION_START_ROW, this.grid.HEADER_SELECTION_END_ROW);
      let maxRow = Math.max(this.grid.HEADER_SELECTION_START_ROW, this.grid.HEADER_SELECTION_END_ROW);
      
      this.grid.SELECTED_CELL_RANGE = {
        startRow: minRow,
        endRow: maxRow,
        startCol: 0,
        endCol: this.grid.TOTAL_COLUMNS - 1,
      };
      
      // Update visual indicators (same as mouse move)
      this.grid.SELECTED_ROW_HEADER = this.grid.HEADER_SELECTION_START_ROW + 1; // Keep original selection visible
      
      // Finalize the selection (same as mouse up)
      this.grid.SELECTED_ROW_RANGE = {
        startRow: minRow,
        endRow: maxRow
      };
      
      return true; // Selection was handled
    }
    
    return false; // Key event not handled
  }
}