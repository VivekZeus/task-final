import { Grid } from "./Grid.js";

export class ArrowKeyHandler {
  grid: Grid;
  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }

  scrollIntoViewIfNeeded() {
    const { startRow, endRow, startCol, endCol } =
      this.grid.SELECTED_CELL_RANGE;

    const selRow = Math.max(startRow, endRow);
    const selCol = Math.max(startCol, endCol);

    const scrollLeft = this.grid.canvasContainer.scrollLeft;
    const scrollTop = this.grid.canvasContainer.scrollTop;
    const visibleWidth = this.grid.canvasContainer.clientWidth;
    const visibleHeight = this.grid.canvasContainer.clientHeight;

    let x = this.grid.prefixArrayManager.getColXPosition(selCol);
    const cellWidth =
      this.grid.COL_WIDTHS.get(selCol) ?? this.grid.DEFAULT_COL_WIDTH;
    let y = this.grid.prefixArrayManager.getRowYPosition(selRow);
    const cellHeight =
      this.grid.ROW_HEIGHTS.get(selRow) ?? this.grid.DEFAULT_ROW_HEIGHT;

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
    this.grid.canvasContainer.scrollTo({
      left: newScrollLeft,
      top: newScrollTop,
      behavior: "auto", // or "smooth" if you want a smooth scroll
    });
  }

  ifCellRangeCanShift(key: string): boolean {
    const { endRow, endCol } = this.grid.SELECTED_CELL_RANGE;

    if (key === "ArrowUp") {
      return endRow > 0;
    } else if (key === "ArrowDown") {
      return endRow < this.grid.TOTAL_ROWS - 1;
    } else if (key === "ArrowLeft") {
      return endCol > 0;
    } else if (key === "ArrowRight") {
      return endCol < this.grid.TOTAL_COLUMNS - 1;
    }

    return false; // if the key isn't an arrow key
  }

  ifCellCanShift(key: string): boolean {
    const { startRow, startCol } = this.grid.SELECTED_CELL_RANGE;

    if (startRow == -1 || startCol == -1) return false;

    if (key == "ArrowLeft") {
      return startCol > 0;
    } else if (key == "ArrowRight" || key == "Tab") {
      return startCol < this.grid.TOTAL_COLUMNS - 1;
    } else if (key == "ArrowUp") {
      return startRow > 0;
    } else if (key == "ArrowDown" || key == "Enter") {
      return startRow < this.grid.TOTAL_ROWS - 1;
    }

    return false;
  }

  shiftSelectedCell(key: string) {
    const { startRow, startCol, endCol, endRow } =
      this.grid.SELECTED_CELL_RANGE;

    if (startCol !== endCol || endRow !== startRow) {
      this.grid.SELECTED_CELL_RANGE.endCol = startCol;
      this.grid.SELECTED_CELL_RANGE.endRow = startRow;
    }
    if (key == "ArrowLeft") {
      this.grid.SELECTED_CELL_RANGE.startCol -= 1;
      this.grid.SELECTED_CELL_RANGE.endCol -= 1;
    } else if (key == "ArrowRight" || key == "Tab") {
      this.grid.SELECTED_CELL_RANGE.startCol += 1;
      this.grid.SELECTED_CELL_RANGE.endCol += 1;
    } else if (key == "ArrowUp") {
      this.grid.SELECTED_CELL_RANGE.startRow -= 1;
      this.grid.SELECTED_CELL_RANGE.endRow -= 1;
    } else if (key == "ArrowDown" || key == "Enter") {
      this.grid.SELECTED_CELL_RANGE.startRow += 1;
      this.grid.SELECTED_CELL_RANGE.endRow += 1;
    }
  }

  handleNormalArrowKeyOperations(key: string): boolean {
    if (!this.ifCellCanShift(key)) {
      return false;
    }
    this.shiftSelectedCell(key);
    return true;
  }

  handleArrowKeyOperations(key: string): boolean {
    if (this.grid.MODE == "normal") {
      if (this.handleNormalArrowKeyOperations(key)) {
        this.scrollIntoViewIfNeeded();
        return true;
      }
      return false;
    }
    return false;
  }

  handleShiftAndArrowKeyOperations(key: string) {
    if (key == "ArrowLeft") {
      this.grid.SELECTED_CELL_RANGE.endCol -= 1;
    } else if (key == "ArrowRight" || key == "Tab") {
      this.grid.SELECTED_CELL_RANGE.endCol += 1;
    } else if (key == "ArrowUp") {
      this.grid.SELECTED_CELL_RANGE.endRow -= 1;
    } else if (key == "ArrowDown") {
      this.grid.SELECTED_CELL_RANGE.endRow += 1;
    }
    this.scrollIntoViewIfNeeded();
  }

  handleTabEnterKeyOperations(key: string, shiftKey: boolean = false): boolean {
    if (shiftKey) {
      if (key == "Tab" && this.ifCellCanShift("ArrowLeft")) {
        this.shiftSelectedCell("ArrowLeft");
        this.scrollIntoViewIfNeeded();
        return true;
      } else if (key == "Enter" && this.ifCellCanShift("ArrowUp")) {
        this.shiftSelectedCell("ArrowUp");
        this.scrollIntoViewIfNeeded();
        return true;
      }
    } else {
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
