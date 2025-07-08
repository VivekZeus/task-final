import { Config } from "./Config.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";

export class CellDataManager {
  static CellData = new Map();

  static showCellInputAtPosition(initialChar, input, canvasContainer) {
    if (!input || !Config.SELECTED_CELL_RANGE) return;

    const row = Config.SELECTED_CELL_RANGE.startRow;
    const col = Config.SELECTED_CELL_RANGE.startCol;

    const scrollLeft = canvasContainer.scrollLeft;
    const scrollTop = canvasContainer.scrollTop;

    const cellX = PrefixArrayManager.getColXPosition(col) - scrollLeft;
    const cellY =PrefixArrayManager.getRowYPosition(row) -scrollTop +(Config.ROW_HEIGHTS[row] - Config.ROW_HEIGHT);
    const cellWidth = Config.COL_WIDTHS[col] || Config.COL_WIDTH;
    const cellHeight = Config.ROW_HEIGHT;

    input.style.left = cellX + "px";
    input.style.top = cellY + "px";
    input.style.width = cellWidth + "px";
    input.style.height = cellHeight + "px";
    input.style.display = "block";

    // Set initial value and focus
    input.value = initialChar;
    Config.CURRENT_INPUT = initialChar;
    input.focus();
    if (initialChar.length === 1) {
    input.setSelectionRange(1, 1);
  } else {
    const len = input.value.length;
    input.setSelectionRange(len, len); // place cursor at end
  }
  }

  static saveInputToCell(context) {
    const row = Config.SELECTED_CELL_RANGE.startRow;
    const col = Config.SELECTED_CELL_RANGE.startCol;

    if (!this.CellData.has(row)) {
      this.CellData.set(row, new Map());
    }

    const colMap = this.CellData.get(row);
    if (!colMap.has(col)) {
      colMap.set(col, {});
    }

    colMap.get(col).value = Config.CURRENT_INPUT;
    Config.CURRENT_INPUT=null;
    Config.INPUT_FINALIZED=true;

    // let textLength=context.measureText(Config.CURRENT_INPUT).width+5;
    // if(!(Config.COL_WIDTHS[col] && Config.COL_WIDTHS[col]>textLength))Config.COL_WIDTHS[col]=textLength;
    // console.log(CellDataManager.CellData);
  }
}
