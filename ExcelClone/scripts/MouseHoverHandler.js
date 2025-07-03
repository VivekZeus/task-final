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
        currentX += Config.COL_WIDTHS[i] || Config.COL_WIDTH;
        if (Math.abs(x - currentX) <= Config.CURSOR_CHANGE_THRESHOLD) {
          canvas.style.cursor = "col-resize";
          Config.HOVERED_COL = i;
          break;
        }
      }
    } else if (y > Config.COL_HEADER_HEIGHT && x < Config.ROW_HEADER_WIDTH) {
      canvas.style.cursor = "w-resize";
      let currentY = Config.COL_HEADER_HEIGHT;
      for (let i = startRow; i < endRow; i++) {
        currentY += Config.ROW_HEIGHTS[i] || Config.ROW_HEIGHT;
        if (Math.abs(currentY - y) <= Config.CURSOR_CHANGE_THRESHOLD) {
          canvas.style.cursor = "row-resize";
          Config.HOVERED_ROW = i;
          break;
        }
      }
    } else {
      Config.HOVERED_COL = -1;
      Config.HOVERED_ROW = -1;
    }
  }
}
