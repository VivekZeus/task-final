export class Config {
  static TOTAL_ROWS = 1000;
  static TOTAL_COLUMNS = 1000;

  static DEFAULT_COL_WIDTH = 100;
  static DEFAULT_ROW_HEIGHT = 30;

  static COL_HEADER_HEIGHT = 40;
  static ROW_HEADER_WIDTH = 70;

  static ROW_HEIGHTS = new Map();
  static COL_WIDTHS = new Map();

  static TEXT_PADDING_X = 5;
  static TEXT_PADDING_Y = 5;

  static CURSOR_CHANGE_THRESHOLD = 3;

  static MODE = "normal";

  static CURSOR_IS_SET = false;

  static SELECTED_CELL = {
    row: -1,
    col: -1,
  };

  static SELECTED_COL_HEADER = -1;
  static ADJUSTED_x1 = -1;
  static IS_COL_HEADER_SELECTED = false;

  static SELECTED_ROW_HEADER = -1;
  static ADJUSTED_y1 = -1;

  static SELECTED_CELL_RANGE = {
    startRow: 0,
    endRow: 0,
    startCol: 0,
    endCol: -0,
  };

  // selecting the range or not while moveing mouse from down to up
  static IS_SELECTING = false;

  // col resiing part

  static HOVERED_COL = -1;
  static RESIZING_COL = -1;
  static INITIAL_X = 0;
  static RESIZING_COL_OLD_WIDTH = -1;


// row resizing part
  static INITIAL_Y = 0;
  static HOVERED_ROW = -1;
  static RESIZING_ROW = -1;
  static RESIZING_ROW_OLD_HEIGHT = -1;


  // header selection part and col range part

  static IS_SELECTING_HEADER = false;
  static HEADER_SELECTION_TYPE = null;
  static HEADER_SELECTION_START_ROW = -1;
  static HEADER_SELECTION_END_ROW = -1;
  static HEADER_SELECTION_START_COL = -1;
  static HEADER_SELECTION_END_COL = -1;
  static SELECTED_COL_RANGE = null; 
  static SELECTED_ROW_RANGE = null; 


  // input part
  static CURRENT_INPUT=null;
  static INPUT_FINALIZED=false;

  static DEFAULT_FONT_SIZE=14;

}
