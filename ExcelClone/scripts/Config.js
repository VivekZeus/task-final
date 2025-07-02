export class Config {
  static TOTAL_ROWS = 1000;
  static TOTAL_COLUMNS = 1000;

  static COL_WIDTH = 100;
  static ROW_HEIGHT = 30;

  static COL_HEADER_HEIGHT = 40;
  static ROW_HEADER_WIDTH = 70;

  static ROW_HEIGHTS = new Array(this.TOTAL_ROWS).fill(this.ROW_HEIGHT);
  static COL_WIDTHS = new Array(this.TOTAL_COLUMNS).fill(this.COL_WIDTH);

  static TEXT_PADDING_X = 5;
  static TEXT_PADDING_Y = 5;

  static CURSOR_CHANGE_THRESHOLD = 3;


  static MODE = "normal"; // can be normal when doing nothing and when formula then formula insertion is happening

  static CURSOR_IS_SET = false;

  static SELECTED_CELL = {
    row: -1,
    col: -1,
  };

  static HOVERED_COL = -1;
  static RESIZING_COL = -1;
  static INITIAL_X = 0;
  static RESIZING_COL_OLD_WIDTH = -1;

  static INITIAL_Y = 0;
  static HOVERED_ROW = -1;
  static RESIZING_ROW = -1;

  static getColumnWidthSum(startCol, endCol) {
    let sum = 0;
    for (let i = startCol; i <= endCol; i++) {
      sum += Config.COL_WIDTHS[i];
    }
    return sum;
  }

  static getRowHeightSum(startRow, endRow) {
    let sum = 0;
    for (let i = startRow; i <= endRow; i++) {
      sum += Config.ROW_HEIGHTS[i];
    }
    return sum;
  }
}
