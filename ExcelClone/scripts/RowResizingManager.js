
import { Config } from "./Config.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { Draw } from "./Draw.js";

export class RowResizingManager {
  static handleOnMouseDown(event) {
    Config.RESIZING_ROW = Config.HOVERED_ROW;
    Config.INITIAL_Y = event.clientY;
    Config.RESIZING_ROW_OLD_HEIGHT = Config.ROW_HEIGHTS[Config.RESIZING_ROW] || Config.ROW_HEIGHT;
    

    Config.SELECTION_BEFORE_RESIZE = {
      selectedColHeader: Config.SELECTED_COL_HEADER,
      selectedRowHeader: Config.SELECTED_ROW_HEADER,
      selectedCellRange: Config.SELECTED_CELL_RANGE ? { ...Config.SELECTED_CELL_RANGE } : null
    };
    

    event.preventDefault();
    event.stopPropagation();
  }

  static handleOnMouseUp(event, grid) {
    if (Config.RESIZING_ROW === -1) return; // Safety check
    
    PrefixArrayManager.updateRowHeight(Config.RESIZING_ROW);
    
    
    if (Config.SELECTION_BEFORE_RESIZE) {
      Config.SELECTED_COL_HEADER = Config.SELECTION_BEFORE_RESIZE.selectedColHeader;
      Config.SELECTED_ROW_HEADER = Config.SELECTION_BEFORE_RESIZE.selectedRowHeader;
      Config.SELECTED_CELL_RANGE = Config.SELECTION_BEFORE_RESIZE.selectedCellRange;
      
      
      if (Config.SELECTED_ROW_HEADER !== -1) {
        let y1Pos = PrefixArrayManager.getRowYPosition(Config.SELECTED_ROW_HEADER - 1);
        let adjustedY1 = y1Pos - grid.canvasContainer.scrollTop;
        Config.ADJUSTED_y1 = adjustedY1;
      }
      
      Config.SELECTION_BEFORE_RESIZE = null; // Clear the stored state
    }
    
    Config.RESIZING_ROW = -1;
    Config.HOVERED_ROW = -1;
    
    grid.render();
    
    event.preventDefault();
    event.stopPropagation();
  }

  static handleOnMouseMouse(event, grid) {
    if (Config.RESIZING_ROW === -1) return; // Safety check
    
    const dy = event.clientY - Config.INITIAL_Y;
    let newHeight = (Config.ROW_HEIGHTS[Config.RESIZING_ROW] || Config.ROW_HEIGHT) + dy;
    if (newHeight < 10) newHeight = 10;
    
    Config.ROW_HEIGHTS[Config.RESIZING_ROW] = newHeight;
    Config.INITIAL_Y = event.clientY;
    
    // Don't clear selections during resize - keep them intact
    
    grid.render();
    
    // Draw resize indicators
    Draw.drawHorizontalLinesRowResizing(
      Config.RESIZING_ROW + 1,
      grid.context,
      grid.viewWidth
    );

    const scrollTop = grid.canvasContainer.scrollTop;
    Draw.drawRowResizeIndicator(grid.context, Config.RESIZING_ROW, scrollTop);

    if (
      event.clientY >= PrefixArrayManager.getRowYPosition(Config.RESIZING_ROW)
    ) {
      Draw.drawHorizontalDashedLine(
        Config.INITIAL_Y,
        grid.context,
        grid.viewWidth
      );
    }
    
    // Prevent event propagation
    event.preventDefault();
    event.stopPropagation();
  }
}