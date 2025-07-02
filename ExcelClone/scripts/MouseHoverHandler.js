import { Config } from "./Config.js";
import { Draw } from "./Draw.js";

export class MouseHoverHandler {
  static changeCursorStyleBasedOnPos(
    canvas,
    x,
    y,
    startCol,
    endCol,
    startRow,
    endRow,
    context,
    scrollLeft
  ) {
    if (y < Config.COL_HEADER_HEIGHT && x > Config.ROW_HEADER_WIDTH) {
      canvas.style.cursor = "s-resize";
      let currentX = Config.ROW_HEADER_WIDTH;

      for (let i = startCol; i < endCol; i++) {
        currentX += Config.COL_WIDTHS[i];
        if (Math.abs(x - currentX) <= Config.CURSOR_CHANGE_THRESHOLD) {
          canvas.style.cursor = "col-resize";
          Config.HOVERED_COL = i;
          // Draw.drawResizeIndicator(context, scrollLeft);
          break;
        }
      }
    } else if (y > Config.COL_HEADER_HEIGHT && x < Config.ROW_HEADER_WIDTH) {
      canvas.style.cursor = "w-resize";
      let currentY = Config.COL_HEADER_HEIGHT;
      for (let i = startRow; i < endRow; i++) {
        currentY += Config.ROW_HEIGHTS[i];
        if (Math.abs(currentY - y) <= Config.CURSOR_CHANGE_THRESHOLD) {
          canvas.style.cursor = "row-resize";
          //   cursorIsSet = true;
          break;
        }
      }
    } else {
      Config.HOVERED_COL = -1;
    }
  }
}
