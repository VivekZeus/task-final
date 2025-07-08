import { Config } from "./Config.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";

export class ArrowKeyHandler {
  static scrollIntoViewIfNeeded() {
     const { startRow, endRow, startCol, endCol } = Config.SELECTED_CELL_RANGE;

  const selRow = Math.max(startRow, endRow);
  const selCol = Math.max(startCol, endCol);

    const canvasContainer = document.getElementById("canvasContainer");
    const scrollLeft = canvasContainer.scrollLeft;
    const scrollTop = canvasContainer.scrollTop;
    const visibleWidth = canvasContainer.clientWidth;
    const visibleHeight = canvasContainer.clientHeight;



    let x = PrefixArrayManager.getColXPosition(selCol);
    const cellWidth = Config.COL_WIDTHS[selCol] || Config.COL_WIDTH;
    let y = PrefixArrayManager.getRowYPosition(selRow);
    const cellHeight = Config.ROW_HEIGHTS[selRow] || Config.ROW_HEIGHT;

    let newScrollLeft = scrollLeft;
    let newScrollTop = scrollTop;

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

  static ifCellRangeCanShift(key) {
  const { endRow, endCol } = Config.SELECTED_CELL_RANGE;

  if (key === "ArrowUp") {
    return endRow > 0;
  } 
  else if (key === "ArrowDown") {
    return endRow < Config.TOTAL_ROWS - 1;
  } 
  else if (key === "ArrowLeft") {
    return endCol > 0;
  } 
  else if (key === "ArrowRight") {
    return endCol < Config.TOTAL_COLUMNS - 1;
  }

  return false; // if the key isn't an arrow key
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

    return false;
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

  static handleShiftAndArrowKeyOperations(key){
    if (key == "ArrowLeft") {
      Config.SELECTED_CELL_RANGE.endCol -= 1;
    } else if (key == "ArrowRight" || key == "Tab") {
      Config.SELECTED_CELL_RANGE.endCol += 1;
    } else if (key == "ArrowUp") {
      Config.SELECTED_CELL_RANGE.endRow -= 1;
    } else if (key == "ArrowDown") {
      Config.SELECTED_CELL_RANGE.endRow += 1;
    }
    this.scrollIntoViewIfNeeded();

  }

  static handleTabEnterKeyOperations(key,shiftKey=false){
    if(shiftKey){
      if (key == "Tab" && this.ifCellCanShift("ArrowLeft")) {
        this.shiftSelectedCell("ArrowLeft");
        this.scrollIntoViewIfNeeded();
        return true;
      }
      else if (key == "Enter" && this.ifCellCanShift("ArrowUp")) {
        this.shiftSelectedCell("ArrowUp");
        this.scrollIntoViewIfNeeded();
        return true;
      }
    }
    else{
      if (key == "Tab" && this.ifCellCanShift(key)) {
        this.shiftSelectedCell(key);
        this.scrollIntoViewIfNeeded();
        return true;
      }
      if (key == "Enter" && this.ifCellCanShift(key)) {
        this.shiftSelectedCell(key);
        this.scrollIntoViewIfNeeded();
        return true;
      }

    }

    return false;
  }
}
