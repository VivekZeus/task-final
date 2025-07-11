import { Grid } from "../Grid.js";
import { CellDataRemovalStrategy } from "../startegy/CellDataRemovalStrategy.js";

export class KeyboardKeyHandler {
  grid: Grid;
  private cellDataRemovalStrategy: CellDataRemovalStrategy;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
    this.cellDataRemovalStrategy = new CellDataRemovalStrategy(gridObj);
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

    const selStartRow = this.grid.SELECTED_CELL_RANGE.startRow;
    const selStartCol = this.grid.SELECTED_CELL_RANGE.startCol;
    const selEndCol = this.grid.SELECTED_CELL_RANGE.endCol;
    const selEndRow = this.grid.SELECTED_CELL_RANGE.endRow;
    const minRow = Math.min(selStartRow, selEndRow);
    const maxRow = Math.max(selStartRow, selEndRow);
    const minCol = Math.min(selStartCol, selEndCol);
    const maxCol = Math.max(selStartCol, selEndCol);

    this.grid.SELECTED_CELL_RANGE_STAT = {
      startRow: minRow,
      endRow: maxRow,
      startCol: minCol,
      endCol: maxCol,
    };

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

  handleBackspaceKeyOperation(input: HTMLInputElement) {
    this.cellDataRemovalStrategy.fullRemoval();
    this.grid.cellDataManager.showCellInputAtPosition("", input);
  }

  handleDeleteKeyOperation() {
    this.cellDataRemovalStrategy.fullRemoval();
  }

  handleCharacterKeyOperation(key: string, input: HTMLInputElement) {
    this.cellDataRemovalStrategy.fullRemoval();
    this.grid.cellDataManager.showCellInputAtPosition(key, input);
  }

  handleDoubleClick(input: HTMLInputElement) {
    const cellValue = this.cellDataRemovalStrategy.nonRemoval();
    this.grid.cellDataManager.showCellInputAtPosition(cellValue, input);
  }

  handleColKeyboardRangeSelection(event: KeyboardEvent) {
    if (
      this.grid.HEADER_SELECTION_START_COL === -1 ||
      this.grid.HEADER_SELECTION_END_COL === -1
    ) {
      return false;
    }

    if (
      event.shiftKey &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight")
    ) {
      let currentCol: number | undefined = 0;

      if (event.key === "ArrowRight") {
        currentCol = this.grid.HEADER_SELECTION_END_COL + 1;
      } else if (event.key === "ArrowLeft") {
        currentCol = this.grid.HEADER_SELECTION_END_COL - 1;
      }

      // Clamp the column to valid range (same as mouse move)
      currentCol = Math.max(
        0,
        Math.min(currentCol, this.grid.TOTAL_COLUMNS - 1)
      );

      this.grid.HEADER_SELECTION_END_COL = currentCol;

      // Update the selection range (same as mouse move)
      let minCol = Math.min(
        this.grid.HEADER_SELECTION_START_COL,
        this.grid.HEADER_SELECTION_END_COL
      );
      let maxCol = Math.max(
        this.grid.HEADER_SELECTION_START_COL,
        this.grid.HEADER_SELECTION_END_COL
      );

      this.grid.SELECTED_CELL_RANGE = {
        startRow: 0,
        endRow: this.grid.TOTAL_ROWS - 1,
        startCol: minCol,
        endCol: maxCol,
      };

      // Update visual indicators (same as mouse move)
      this.grid.SELECTED_COL_HEADER = this.grid.HEADER_SELECTION_START_COL + 1; // Keep original selection visible

      // Finalize the selection (same as mouse up)
      this.grid.SELECTED_COL_RANGE = {
        startCol: minCol,
        endCol: maxCol,
      };

      return true; // Selection was handled
    }

    return false; // Key event not handled
  }

  handleRowKeyboardRangeSelection(event: KeyboardEvent) {
    // Check if we have a valid row selection started
    if (
      this.grid.HEADER_SELECTION_START_ROW === -1 ||
      this.grid.HEADER_SELECTION_END_ROW === -1
    ) {
      return false; // No selection to extend
    }

    if (
      event.shiftKey &&
      (event.key === "ArrowUp" || event.key === "ArrowDown")
    ) {
      let currentRow = 0;

      if (event.key === "ArrowDown") {
        currentRow = this.grid.HEADER_SELECTION_END_ROW + 1;
      } else if (event.key === "ArrowUp") {
        currentRow = this.grid.HEADER_SELECTION_END_ROW - 1;
      }

      // Clamp the row to valid range (same as mouse move)
      currentRow = Math.max(0, Math.min(currentRow, this.grid.TOTAL_ROWS - 1));

      this.grid.HEADER_SELECTION_END_ROW = currentRow;

      // Update the selection range (same as mouse move)
      let minRow = Math.min(
        this.grid.HEADER_SELECTION_START_ROW,
        this.grid.HEADER_SELECTION_END_ROW
      );
      let maxRow = Math.max(
        this.grid.HEADER_SELECTION_START_ROW,
        this.grid.HEADER_SELECTION_END_ROW
      );

      this.grid.SELECTED_CELL_RANGE = {
        startRow: minRow,
        endRow: maxRow,
        startCol: 0,
        endCol: this.grid.TOTAL_COLUMNS - 1,
      };

      // Update visual indicators (same as mouse move)
      this.grid.SELECTED_ROW_HEADER = this.grid.HEADER_SELECTION_START_ROW + 1; // Keep original selection visible

      // Finalize the selection (same as mouse up)
      this.grid.SELECTED_ROW_RANGE = {
        startRow: minRow,
        endRow: maxRow,
      };

      return true; // Selection was handled
    }

    return false; // Key event not handled
  }
}
