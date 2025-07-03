import { Config } from "./Config.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { MouseClickHandler } from "./MouseClickHandler.js";
import { Draw } from "./Draw.js";

export class ColumnResizingManager {
  static handleOnMouseDown(event) {
    Config.RESIZING_COL = Config.HOVERED_COL;
    Config.INITIAL_X = event.clientX;
    Config.RESIZING_COL_OLD_WIDTH = Config.COL_WIDTHS[Config.RESIZING_COL]||Config.COL_WIDTH;
  }

  static handleOnMouseUp(event, grid, canvas) {
    PrefixArrayManager.updateColumnWidth(Config.RESIZING_COL);
    Config.RESIZING_COL = -1;
    Config.HOVERED_COL=-1;
    grid.render();

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (
      y > Config.COL_HEADER_HEIGHT &&
      x > Config.ROW_HEADER_WIDTH &&
      x < canvas.width &&
      y < canvas.height
    ) {
      const { startRow, endRow, startCol, endCol } = grid.getVisibleRowCols();
      MouseClickHandler.handleCellClick(
        x,
        y,
        startRow,
        endRow,
        startCol,
        endCol
      );
      grid.render();
    }
  }

  static handleOnMouseMouse(event, grid) {
    const dx = event.clientX - Config.INITIAL_X;
    let newWidth = (Config.COL_WIDTHS[Config.RESIZING_COL]||Config.COL_WIDTH) + dx;
    if (newWidth < 10) newWidth = 10;
    Config.COL_WIDTHS[Config.RESIZING_COL] = newWidth;
    Config.INITIAL_X = event.clientX;
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
  }
}
