export class Config {
}
Config.TOTAL_ROWS = 10000;
Config.TOTAL_COLUMNS = 1000;
Config.DEFAULT_COL_WIDTH = 100;
Config.DEFAULT_ROW_HEIGHT = 30;
Config.COL_HEADER_HEIGHT = 40;
Config.ROW_HEADER_WIDTH = 70;
Config.ROW_HEIGHTS = new Map();
Config.COL_WIDTHS = new Map();
Config.TEXT_PADDING_X = 5;
Config.TEXT_PADDING_Y = 5;
Config.CURSOR_CHANGE_THRESHOLD = 3;
Config.MODE = "normal";
Config.CURSOR_IS_SET = false;
Config.SELECTED_COL_HEADER = -1;
Config.ADJUSTED_x1 = -1;
Config.IS_COL_HEADER_SELECTED = false;
Config.SELECTED_ROW_HEADER = -1;
Config.ADJUSTED_y1 = -1;
Config.SELECTED_CELL_RANGE = {
    startRow: 0,
    endRow: 0,
    startCol: 0,
    endCol: -0,
};
// selecting the range or not while moveing mouse from down to up
Config.IS_SELECTING = false;
// col resiing part
Config.HOVERED_COL = -1;
Config.RESIZING_COL = -1;
Config.INITIAL_X = 0;
Config.RESIZING_COL_OLD_WIDTH = -1;
// row resizing part
Config.INITIAL_Y = 0;
Config.HOVERED_ROW = -1;
Config.RESIZING_ROW = -1;
Config.RESIZING_ROW_OLD_HEIGHT = -1;
// header selection part and col range part
Config.IS_SELECTING_HEADER = false;
Config.HEADER_SELECTION_TYPE = null;
Config.HEADER_SELECTION_START_ROW = -1;
Config.HEADER_SELECTION_END_ROW = -1;
Config.HEADER_SELECTION_START_COL = -1;
Config.HEADER_SELECTION_END_COL = -1;
// input part
Config.CURRENT_INPUT = null;
Config.INPUT_FINALIZED = false;
Config.DEFAULT_FONT_SIZE = 14;
