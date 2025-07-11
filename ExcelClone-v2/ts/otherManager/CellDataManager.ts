import { Grid } from "../Grid";

export class CellDataManager {
  cellData: Map<number, any> = new Map();
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }
  updateInputPosition(input: HTMLInputElement) {
    if (!input || !this.grid.SELECTED_CELL_RANGE) return;

    const row = this.grid.SELECTED_CELL_RANGE.startRow;
    const col = this.grid.SELECTED_CELL_RANGE.startCol;

    const { startRow, endRow, startCol, endCol } =
      this.grid.getVisibleRowCols();

    const isVisible =
      row >= startRow && row <= endRow && col >= startCol && col <= endCol;

    if (!isVisible) {
      input.style.display = "none";
      return;
    }

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

    const canvasOffsetTop =
      this.grid.canvasContainer.getBoundingClientRect().top;

    input.style.left = cellX + "px";
    input.style.top = cellY + canvasOffsetTop + "px";
    input.style.width = cellWidth + "px";
    input.style.height = cellHeight + "px";
    input.style.display = "block"; // 👈 show only if visible
  }

  //   updateInputPosition(input: HTMLInputElement) {
  //   if (!input || !this.grid.SELECTED_CELL_RANGE) return;

  //   const row = this.grid.SELECTED_CELL_RANGE.startRow;
  //   const col = this.grid.SELECTED_CELL_RANGE.startCol;

  //   const { startRow, endRow, startCol, endCol } =
  //     this.grid.getVisibleRowCols();

  //   const isVisible =
  //     row >= startRow && row <= endRow && col >= startCol && col <= endCol;

  //   if (!isVisible) {
  //     input.style.display = "none";
  //     input.value = ""; // 👈 Clear value when out of view
  //     this.grid.CURRENT_INPUT = null; // optional: reset your grid state
  //     this.grid.canvasContainer.onscroll = null; // 👈 remove listener
  //     return;
  //   }

  //   const scrollLeft = this.grid.canvasContainer.scrollLeft;
  //   const scrollTop = this.grid.canvasContainer.scrollTop;

  //   const cellX =
  //     this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
  //   const cellY =
  //     this.grid.prefixArrayManager.getRowYPosition(row) -
  //     scrollTop +
  //     ((this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT) -
  //       this.grid.DEFAULT_ROW_HEIGHT);

  //   const cellWidth =
  //     this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
  //   const cellHeight = this.grid.DEFAULT_ROW_HEIGHT;

  //   const canvasOffsetTop =
  //     this.grid.canvasContainer.getBoundingClientRect().top;

  //   input.style.left = cellX + "px";
  //   input.style.top = cellY + canvasOffsetTop + "px";
  //   input.style.width = cellWidth + "px";
  //   input.style.height = cellHeight + "px";
  //   input.style.display = "block";
  // }

  // updateInputPosition(input: HTMLInputElement) {
  //   if (!input || !this.grid.SELECTED_CELL_RANGE) return;

  //   const row = this.grid.SELECTED_CELL_RANGE.startRow;
  //   const col = this.grid.SELECTED_CELL_RANGE.startCol;

  //   const { startRow, endRow, startCol, endCol } = this.grid.getVisibleRowCols();

  //   const isVisible =
  //     row >= startRow && row <= endRow && col >= startCol && col <= endCol;

  //   if (!isVisible) {
  //     // Save only if not already saved
  //     if (input.style.display !== "none") {
  //       this.saveInputToCell();
  //     }

  //     input.style.display = "none";
  //     return;
  //   }

  //   const scrollLeft = this.grid.canvasContainer.scrollLeft;
  //   const scrollTop = this.grid.canvasContainer.scrollTop;

  //   const cellX =
  //     this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
  //   const cellY =
  //     this.grid.prefixArrayManager.getRowYPosition(row) -
  //     scrollTop +
  //     ((this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT) -
  //       this.grid.DEFAULT_ROW_HEIGHT);

  //   const cellWidth =
  //     this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
  //   const cellHeight = this.grid.DEFAULT_ROW_HEIGHT;

  //   const canvasOffsetTop =
  //     this.grid.canvasContainer.getBoundingClientRect().top;

  //   input.style.left = cellX + "px";
  //   input.style.top = cellY + canvasOffsetTop + "px";
  //   input.style.width = cellWidth + "px";
  //   input.style.height = cellHeight + "px";
  //   input.style.display = "block";
  // }

  // updateInputPosition(input: HTMLInputElement) {
  //   if (!input || !this.grid.SELECTED_CELL_RANGE) return;

  //   const row = this.grid.SELECTED_CELL_RANGE.startRow;
  //   const col = this.grid.SELECTED_CELL_RANGE.startCol;

  //   const { startRow, endRow, startCol, endCol } =
  //     this.grid.getVisibleRowCols();

  //   const isVisible =
  //     row >= startRow && row <= endRow && col >= startCol && col <= endCol;

  //   if (!isVisible) {
  //     // Save the input value before hiding
  //     if (input.style.display !== "none") {
  //       this.saveInputToCell();
  //       // Clear the current input to prevent canvas rendering
  //       this.grid.CURRENT_INPUT = null;
  //       // Trigger a re-render to clear the canvas text
  //       this.grid.render();
  //     }

  //     input.style.display = "none";
  //     return;
  //   }

  //   // If we're making it visible again, restore the input value
  //   if (input.style.display === "none") {
  //     const cellValue = this.getCellValue(row, col);
  //     if (cellValue !== undefined) {
  //       input.value = cellValue;
  //       this.grid.CURRENT_INPUT = cellValue;
  //     }
  //   }

  //   const scrollLeft = this.grid.canvasContainer.scrollLeft;
  //   const scrollTop = this.grid.canvasContainer.scrollTop;

  //   const cellX =
  //     this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
  //   const cellY =
  //     this.grid.prefixArrayManager.getRowYPosition(row) -
  //     scrollTop +
  //     ((this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT) -
  //       this.grid.DEFAULT_ROW_HEIGHT);

  //   const cellWidth =
  //     this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
  //   const cellHeight = this.grid.DEFAULT_ROW_HEIGHT;

  //   const canvasOffsetTop =
  //     this.grid.canvasContainer.getBoundingClientRect().top;

  //   input.style.left = cellX + "px";
  //   input.style.top = cellY + canvasOffsetTop + "px";
  //   input.style.width = cellWidth + "px";
  //   input.style.height = cellHeight + "px";
  //   input.style.display = "block";
  // }

  // // Helper method to get cell value
  // private getCellValue(row: number, col: number): string | undefined {
  //   const rowMap = this.cellData.get(row);
  //   if (!rowMap) return undefined;

  //   const cellData = rowMap.get(col);
  //   return cellData?.value;
  // }

  showCellInputAtPosition(initialChar: any, input: HTMLInputElement) {
    if (!input || !this.grid.SELECTED_CELL_RANGE) return;

    this.updateInputPosition(input);

    input.style.display = "block";
    input.value = initialChar;
    this.grid.CURRENT_INPUT = initialChar;
    input.focus();

    if (initialChar.length === 1) {
      input.setSelectionRange(1, 1);
    } else {
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }

    this.grid.canvasContainer.onscroll = () => this.updateInputPosition(input);
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

// updateInputPosition(input: HTMLInputElement) {
//   if (!input || !this.grid.SELECTED_CELL_RANGE) return;

//   const row = this.grid.SELECTED_CELL_RANGE.startRow;
//   const col = this.grid.SELECTED_CELL_RANGE.startCol;

//   const scrollLeft = this.grid.canvasContainer.scrollLeft;
//   const scrollTop = this.grid.canvasContainer.scrollTop;

//   const cellX =
//     this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
//   const cellY =
//     this.grid.prefixArrayManager.getRowYPosition(row) -
//     scrollTop +
//     ((this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT) -
//       this.grid.DEFAULT_ROW_HEIGHT);

//   const cellWidth =
//     this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
//   const cellHeight = this.grid.DEFAULT_ROW_HEIGHT;

//   const canvasOffsetTop =
//     this.grid.canvasContainer.getBoundingClientRect().top;

//   input.style.left = cellX + "px";
//   input.style.top = cellY + canvasOffsetTop + "px";
//   input.style.width = cellWidth + "px";
//   input.style.height = cellHeight + "px";
// }

// showCellInputAtPosition(initialChar: any, input: HTMLInputElement) {
//   if (!input || !this.grid.SELECTED_CELL_RANGE) return;

//   const row = this.grid.SELECTED_CELL_RANGE.startRow;
//   const col = this.grid.SELECTED_CELL_RANGE.startCol;

//   const scrollLeft = this.grid.canvasContainer.scrollLeft;
//   const scrollTop = this.grid.canvasContainer.scrollTop;

//   const cellX =
//     this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
//   const cellY =
//     this.grid.prefixArrayManager.getRowYPosition(row) -
//     scrollTop +
//     ((this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT) -
//       this.grid.DEFAULT_ROW_HEIGHT);

//   const cellWidth =
//     this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
//   const cellHeight = this.grid.DEFAULT_ROW_HEIGHT;

//   // 🔥 Here's the fix: offset canvas-container's position
//   const canvasOffsetTop =
//     this.grid.canvasContainer.getBoundingClientRect().top;

//   input.style.left = cellX + "px";
//   input.style.top = cellY + canvasOffsetTop + "px"; // ⬅️ apply correction
//   input.style.width = cellWidth + "px";
//   input.style.height = cellHeight + "px";
//   input.style.display = "block";

//   // Set initial value and focus
//   input.value = initialChar;
//   this.grid.CURRENT_INPUT = initialChar;
//   input.focus();

//   if (initialChar.length === 1) {
//     input.setSelectionRange(1, 1);
//   } else {
//     const len = input.value.length;
//     input.setSelectionRange(len, len);
//   }
// }
