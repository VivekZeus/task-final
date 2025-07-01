import { Config } from "./Config.js";

export class ArrowKeyHandler {
  static scrollIntoViewIfNeeded() {
    const selRow = Config.SELECTED_CELL.row;
    const selCol = Config.SELECTED_CELL.col;

    const canvasContainer = document.getElementById("canvasContainer");
    const scrollLeft = canvasContainer.scrollLeft;
    const scrollTop = canvasContainer.scrollTop;
    const visibleWidth = canvasContainer.clientWidth;
    const visibleHeight = canvasContainer.clientHeight;

    let x = Config.ROW_HEADER_WIDTH;
    for (let c = 0; c < selCol; c++) x += Config.COL_WIDTHS[c];
    const cellWidth = Config.COL_WIDTHS[selCol];

    let y = Config.COL_HEADER_HEIGHT;
    for (let r = 0; r < selRow; r++) y += Config.ROW_HEIGHTS[r];
    const cellHeight = Config.ROW_HEIGHTS[selRow];

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
    const { row, col } = Config.SELECTED_CELL;

    if (row == -1 || col == -1) return false;

    if (key == "ArrowLeft") {
      return col > 0;
    } else if (key == "ArrowRight") {
      return col < Config.TOTAL_COLUMNS - 1;
    } else if (key == "ArrowUp") {
      return row > 0;
    } else if (key == "ArrowDown") {
      return row < Config.TOTAL_ROWS - 1;
    }
  }

  static shiftSelectedCell(key) {
    if (key == "ArrowLeft") {
      Config.SELECTED_CELL.col -= 1;
    } else if (key == "ArrowRight") {
      Config.SELECTED_CELL.col += 1;
    } else if (key == "ArrowUp") {
      Config.SELECTED_CELL.row -= 1;
    } else if (key == "ArrowDown") {
      Config.SELECTED_CELL.row += 1;
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
      if(ArrowKeyHandler.handleNormalArrowKeyOperations(key)){
        this.scrollIntoViewIfNeeded();
        return true;
      }
      return false;
      
    }
  }
}
