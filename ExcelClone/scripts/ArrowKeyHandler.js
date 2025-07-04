import { Config } from "./Config.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";

export class ArrowKeyHandler {
  static scrollIntoViewIfNeeded() {
    const selRow = Config.SELECTED_CELL_RANGE.startRow;
    const selCol = Config.SELECTED_CELL_RANGE.startCol;

    const canvasContainer = document.getElementById("canvasContainer");
    const scrollLeft = canvasContainer.scrollLeft;
    const scrollTop = canvasContainer.scrollTop;
    const visibleWidth = canvasContainer.clientWidth;
    const visibleHeight = canvasContainer.clientHeight;

    // let x = Config.ROW_HEADER_WIDTH;
    // for (let c = 0; c < selCol; c++) x += Config.COL_WIDTHS[c];
    // const cellWidth = Config.COL_WIDTHS[selCol];

    let x = PrefixArrayManager.getColXPosition(selCol);
    // for (let c = 0; c < selCol; c++) x += Config.COL_WIDTHS[c];
    const cellWidth = Config.COL_WIDTHS[selCol] || Config.COL_WIDTH;

    // let y = Config.COL_HEADER_HEIGHT;
    // for (let r = 0; r < selRow; r++) y += Config.ROW_HEIGHTS[r];
    // const cellHeight = Config.ROW_HEIGHTS[selRow];

    let y = PrefixArrayManager.getRowYPosition(selRow);
    // for (let r = 0; r < selRow; r++) y += Config.ROW_HEIGHTS[r];
    const cellHeight = Config.ROW_HEIGHTS[selRow] || Config.ROW_HEIGHT;

    let newScrollLeft = scrollLeft;
    let newScrollTop = scrollTop;

    // Horizontal scroll logic
    if (x + cellWidth > scrollLeft + visibleWidth) {
      newScrollLeft = x + cellWidth - visibleWidth;
    } else if (x < scrollLeft) {
      newScrollLeft = x;
    }

    // Vertical scroll logic
    if (y + cellHeight > scrollTop + visibleHeight) {
      newScrollTop = y + cellHeight - visibleHeight;
    } else if (y < scrollTop) {
      newScrollTop = y;
    }

    // Scroll if needed
    canvasContainer.scrollTo({
      left: newScrollLeft,
      top: newScrollTop,
      behavior: "auto", // or "smooth" if you want a smooth scroll
    });
  }

  static ifCellCanShift(key) {
    const { startRow, startCol } = Config.SELECTED_CELL_RANGE;

    if (startRow == -1 || startCol == -1) return false;

    if (key == "ArrowLeft") {
      return startCol > 0;
    } else if (key == "ArrowRight" || key == "Tab") {
      return startCol < Config.TOTAL_COLUMNS - 1;
    } else if (key == "ArrowUp") {
      return startRow > 0;
    } else if (key == "ArrowDown" || key == "Enter") {
      return startRow < Config.TOTAL_ROWS - 1;
    }
  }

  static shiftSelectedCell(key) {
    const { startRow, startCol, endCol, endRow } = Config.SELECTED_CELL_RANGE;

    if (startCol !== endCol || endRow !== startRow) {
      Config.SELECTED_CELL_RANGE.endCol = startCol;
      Config.SELECTED_CELL_RANGE.endRow = startRow;
    }
    if (key == "ArrowLeft") {
      Config.SELECTED_CELL_RANGE.startCol -= 1;
      Config.SELECTED_CELL_RANGE.endCol -= 1;
    } else if (key == "ArrowRight" || key == "Tab") {
      Config.SELECTED_CELL_RANGE.startCol += 1;
      Config.SELECTED_CELL_RANGE.endCol += 1;
    } else if (key == "ArrowUp") {
      Config.SELECTED_CELL_RANGE.startRow -= 1;
      Config.SELECTED_CELL_RANGE.endRow -= 1;
    } else if (key == "ArrowDown" || key == "Enter") {
      Config.SELECTED_CELL_RANGE.startRow += 1;
      Config.SELECTED_CELL_RANGE.endRow += 1;
    }
  }

  static handleNormalArrowKeyOperations(key) {
    if (!ArrowKeyHandler.ifCellCanShift(key)) {
      return false;
    }
    ArrowKeyHandler.shiftSelectedCell(key);
    return true;
  }

  static handleArrowKeyOperations(key) {
    if (Config.MODE == "normal") {
      if (ArrowKeyHandler.handleNormalArrowKeyOperations(key)) {
        this.scrollIntoViewIfNeeded();
        return true;
      }
      return false;
    }
  }
}
