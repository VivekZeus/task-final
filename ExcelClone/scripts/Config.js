export class Config {
  static TOTAL_ROWS = 1000;
  static TOTAL_COLUMNS = 1000;

  static COL_WIDTH = 100;
  static ROW_HEIGHT = 30;

  static COL_HEADER_HEIGHT = 40;
  static ROW_HEADER_WIDTH = 70;


  static ROW_HEIGHTS = new Map();
  static COL_WIDTHS = new Map();

  static TEXT_PADDING_X = 5;
  static TEXT_PADDING_Y = 5;

  static CURSOR_CHANGE_THRESHOLD = 1;

  static MODE = "normal"; // can be normal when doing nothing and when formula then formula insertion is happening

  static CURSOR_IS_SET = false;

  static SELECTED_CELL = {
    row: -1,
    col: -1,
  };

  static SELECTED_COL_HEADER=-1;

  static SELECTED_CELL_RANGE={
    startRow:-1,
    endRow:-1,
    startCol:-1,
    endCol:-1
  }

  static IS_SELECTING=false;

  static HOVERED_COL = -1;
  static RESIZING_COL = -1;
  static INITIAL_X = 0;
  static RESIZING_COL_OLD_WIDTH = -1;

  static INITIAL_Y = 0;
  static HOVERED_ROW = -1;
  static RESIZING_ROW = -1;
  static RESIZING_ROW_OLD_HEIGHT = -1;

  static getColumnWidthSum(startCol, endCol) {
    let sum = 0;
    for (let i = startCol; i <= endCol; i++) {
      sum += Config.COL_WIDTHS[i] || this.COL_WIDTH;
    }
    return sum;
  }

  static getRowHeightSum(startRow, endRow) {
    let sum = 0;
    for (let i = startRow; i <= endRow; i++) {
      sum += Config.ROW_HEIGHTS[i] || this.ROW_HEIGHT;
    }
    return sum;
  }
}
