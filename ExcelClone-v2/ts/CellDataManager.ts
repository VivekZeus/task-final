import { Grid } from "./Grid";

export class CellDataManager {
  cellData: Map<number, any> = new Map();
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }

  showCellInputAtPosition(initialChar: any, input: HTMLInputElement) {
    if (!input || !this.grid.SELECTED_CELL_RANGE) return;

    const row = this.grid.SELECTED_CELL_RANGE.startRow;
    const col = this.grid.SELECTED_CELL_RANGE.startCol;

    const scrollLeft = this.grid.canvasContainer.scrollLeft;
    const scrollTop = this.grid.canvasContainer.scrollTop;

    const cellX =
      this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
    const cellY =
      this.grid.prefixArrayManager.getRowYPosition(row) -
      scrollTop +
      ((this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT) -
        this.grid.DEFAULT_ROW_HEIGHT);

    const cellWidth =
      this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
    const cellHeight = this.grid.DEFAULT_ROW_HEIGHT;

    // 🔥 Here's the fix: offset canvas-container's position
    const canvasOffsetTop =
      this.grid.canvasContainer.getBoundingClientRect().top;

    input.style.left = cellX + "px";
    input.style.top = cellY + canvasOffsetTop + "px"; // ⬅️ apply correction
    input.style.width = cellWidth + "px";
    input.style.height = cellHeight + "px";
    input.style.display = "block";

    // Set initial value and focus
    input.value = initialChar;
    this.grid.CURRENT_INPUT = initialChar;
    input.focus();

    if (initialChar.length === 1) {
      input.setSelectionRange(1, 1);
    } else {
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  }

  saveInputToCell() {
    const row = this.grid.SELECTED_CELL_RANGE.startRow;
    const col = this.grid.SELECTED_CELL_RANGE.startCol;

    if (!this.cellData.has(row)) {
      this.cellData.set(row, new Map());
    }

    const colMap = this.cellData.get(row);
    if (!colMap.has(col)) {
      colMap.set(col, {});
    }

    colMap.get(col).value = this.grid.CURRENT_INPUT;
    this.grid.CURRENT_INPUT = null;
    this.grid.INPUT_FINALIZED = true;

    // let textLength=context.measureText(Config.CURRENT_INPUT).width+5;
    // if(!(Config.COL_WIDTHS[col] && Config.COL_WIDTHS[col]>textLength))Config.COL_WIDTHS[col]=textLength;
    // console.log(CellDataManager.CellData);
  }
}
