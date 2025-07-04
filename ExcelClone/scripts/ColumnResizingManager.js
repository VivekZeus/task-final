
import { Config } from "./Config.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { Draw } from "./Draw.js";

export class ColumnResizingManager {
  static handleOnMouseDown(event) {
    Config.RESIZING_COL = Config.HOVERED_COL;
    Config.INITIAL_X = event.clientX;
    Config.RESIZING_COL_OLD_WIDTH = Config.COL_WIDTHS[Config.RESIZING_COL] || Config.COL_WIDTH;
    
    // Store the current selection state before resizing
    Config.SELECTION_BEFORE_RESIZE = {
      selectedColHeader: Config.SELECTED_COL_HEADER,
      selectedRowHeader: Config.SELECTED_ROW_HEADER,
      selectedCellRange: Config.SELECTED_CELL_RANGE ? { ...Config.SELECTED_CELL_RANGE } : null
    };
    
    // Prevent event propagation to avoid triggering other mousedown handlers
    event.preventDefault();
    event.stopPropagation();
  }

  static handleOnMouseUp(event, grid, canvas) {
    if (Config.RESIZING_COL === -1) return; // Safety check
    
    PrefixArrayManager.updateColumnWidth(Config.RESIZING_COL);
    
    // Restore the selection state that existed before resizing
    if (Config.SELECTION_BEFORE_RESIZE) {
      Config.SELECTED_COL_HEADER = Config.SELECTION_BEFORE_RESIZE.selectedColHeader;
      Config.SELECTED_ROW_HEADER = Config.SELECTION_BEFORE_RESIZE.selectedRowHeader;
      Config.SELECTED_CELL_RANGE = Config.SELECTION_BEFORE_RESIZE.selectedCellRange;
      Config.SELECTION_BEFORE_RESIZE = null; // Clear the stored state
    }
    
    Config.RESIZING_COL = -1;
    Config.HOVERED_COL = -1;
    
    grid.render();
    
    // Prevent event propagation
    event.preventDefault();
    event.stopPropagation();
  }

  static handleOnMouseMouse(event, grid) {
    if (Config.RESIZING_COL === -1) return; // Safety check
    
    const dx = event.clientX - Config.INITIAL_X;
    let newWidth = (Config.COL_WIDTHS[Config.RESIZING_COL] || Config.COL_WIDTH) + dx;
    if (newWidth < 10) newWidth = 10;
    
    Config.COL_WIDTHS[Config.RESIZING_COL] = newWidth;
    Config.INITIAL_X = event.clientX;
    
    // Don't clear selections during resize - keep them intact
    
    grid.render();
    
    Draw.drawVerticalLinesColResizing(
      Config.RESIZING_COL + 1,
      grid.context,
      grid.viewHeight
    );

    const scrollLeft = grid.canvasContainer.scrollLeft;
    Draw.drawResizeIndicator(grid.context, Config.RESIZING_COL, scrollLeft);

    if (
      event.clientX >= PrefixArrayManager.getColXPosition(Config.RESIZING_COL)
    ) {
      Draw.drawVerticalDashedLine(
        Config.INITIAL_X,
        grid.context,
        grid.viewHeight
      );
    }
    
    // Prevent event propagation
    event.preventDefault();
    event.stopPropagation();
  }
}