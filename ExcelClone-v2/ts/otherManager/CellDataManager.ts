
import { Grid } from "../Grid";

export class CellDataManager {
  cellData: Map<number, any> = new Map();
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }


    updateInputPosition(input: HTMLInputElement) {

    
    if (!input) return;
    console.log("came in event listnerr");
    const row = this.grid.SELECTED_CELL_RANGE.startRow;
    const col = this.grid.SELECTED_CELL_RANGE.startCol;

    const isVisible = this.grid.isVisible();


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
    input.style.display = "block";
  }

  clearInputState() {
  this.grid.CURRENT_INPUT = null;
  this.grid.INPUT_FINALIZED = false;
}


  getCellValue(row:number, col:number) {
    const rowMap = this.cellData.get(row);
    if (!rowMap) return undefined;
    
    const cellData = rowMap.get(col);
    return cellData?.value;
}

  // showCellInputAtPosition(initialChar: string, input: HTMLInputElement) {
  //   if (!input) return;

  //   this.updateInputPosition(input);

  //   input.style.display = "block";
  //   input.value = initialChar;
  //   this.grid.CURRENT_INPUT = initialChar;
  //   input.focus();

  //   if (initialChar.length === 1) {
  //     input.setSelectionRange(1, 1);
  //   } else {
  //     const len = input.value.length;
  //     input.setSelectionRange(len, len);
  //   }

  //   this.grid.canvasContainer.onscroll = () => this.updateInputPosition(input);
  // }

showCellInputAtPosition(initialChar: string, input: HTMLInputElement) {
  if (!input) return;

  // 💡 Finalize any previous unsaved input
  if (!this.grid.INPUT_FINALIZED && this.grid.CURRENT_INPUT != null) {
    this.saveInputToCell();
  }

  input.value = ""; // Clear any leftover value first
  input.style.display = "block";
  this.updateInputPosition(input);

  input.value = initialChar;
  this.grid.CURRENT_INPUT = initialChar;
  this.grid.INPUT_FINALIZED = false;

  input.focus();
  input.setSelectionRange(initialChar.length, initialChar.length);

  this.grid.canvasContainer.onscroll = () => this.updateInputPosition(input);
}



  saveInputToCell() {
    if(this.grid.CURRENT_INPUT==null)return;
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

