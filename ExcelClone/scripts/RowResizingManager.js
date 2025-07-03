import { Config } from "./Config.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { Draw } from "./Draw.js";
import { MouseClickHandler } from "./MouseClickHandler.js";

export class RowResizingManager {
  static handleOnMouseDown(e) {
    Config.RESIZING_ROW = Config.HOVERED_ROW;
    Config.INITIAL_Y = e.clientY;
    Config.RESIZING_ROW_OLD_HEIGHT =
      Config.ROW_HEIGHTS[Config.RESIZING_ROW] || Config.ROW_HEIGHT;
  }

  static handleOnMouseUp(event, grid) {
    console.log("came in row up");
    PrefixArrayManager.updateRowHeight(Config.RESIZING_ROW);
    Config.RESIZING_ROW = -1;
    Config.HOVERED_ROW = -1;
    grid.render();
    const rect = grid.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (
      y > Config.COL_HEADER_HEIGHT &&
      x > Config.ROW_HEADER_WIDTH &&
      x < grid.canvas.width &&
      y < grid.canvas.height
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
    const dy = event.clientY - Config.INITIAL_Y;
    let newHeight =
      (Config.ROW_HEIGHTS[Config.RESIZING_ROW] || Config.ROW_HEIGHT) + dy;
    if (newHeight < 10) newHeight = 10;
    Config.ROW_HEIGHTS[Config.RESIZING_ROW] = newHeight;
    Config.INITIAL_Y = event.clientY;
    grid.render();

    Draw.rowHorizontalLinesRowResizing(
      Config.RESIZING_ROW + 1,
      grid.context,
      grid.viewWidth
    );

    const scrollTop = canvasContainer.scrollTop;
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
  }
}
