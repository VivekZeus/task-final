import { Config } from "./Config.js";
// import { Draw } from "./Draw.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";

export class Grid {
  constructor(canvasContainer, canvas, context) {
    this.canvasContainer = canvasContainer;
    this.canvas = canvas;
    this.context = context;

    this.TOTAL_ROWS = Config.TOTAL_ROWS;
    this.TOTAL_COLUMNS = Config.TOTAL_COLUMNS;

    this.COL_HEADER_HEIGHT = Config.COL_HEADER_HEIGHT;
    this.ROW_HEADER_WIDTH = Config.ROW_HEADER_WIDTH;

    this.DEFAULT_COL_WIDTH = Config.DEFAULT_COL_WIDTH;
    this.DEFAULT_ROW_HEIGHT = Config.DEFAULT_ROW_HEIGHT;
    this.DEFAULT_FONT_SIZE = Config.DEFAULT_FONT_SIZE;
    this.CURRENT_INPUT = null;
    this.INPUT_FINALIZED = false;

    this.ROW_HEIGHTS = new Map();
    this.COL_WIDTHS = new Map();

    this.TEXT_PADDING_X = 5;
    this.TEXT_PADDING_Y = 5;

    this.CURSOR_CHANGE_THRESHOLD = 3;
    this.MODE = "normal";
    this.CURSOR_IS_SET = false;

    this.SELECTED_COL_HEADER = -1;
    this.ADJUSTED_x1 = -1;
    this.IS_COL_HEADER_SELECTED = false;

    this.SELECTED_ROW_HEADER = -1;
    this.ADJUSTED_y1 = -1;

    this.SELECTED_CELL_RANGE = {
      startRow: 0,
      endRow: 0,
      startCol: 0,
      endCol: -0,
    };

    // selecting the range or not while moveing mouse from down to up
    this.IS_SELECTING = false;

    // col resiing part

    this.HOVERED_COL = -1;
    this.RESIZING_COL = -1;
    this.INITIAL_X = 0;
    this.RESIZING_COL_OLD_WIDTH = -1;

    // row resizing part
    this.INITIAL_Y = 0;
    this.HOVERED_ROW = -1;
    this.RESIZING_ROW = -1;
    this.RESIZING_ROW_OLD_HEIGHT = -1;

    // header selection part and col range part

    this.IS_SELECTING_HEADER = false;
    this.HEADER_SELECTION_TYPE = null;
    this.HEADER_SELECTION_START_ROW = -1;
    this.HEADER_SELECTION_END_ROW = -1;
    this.HEADER_SELECTION_START_COL = -1;
    this.HEADER_SELECTION_END_COL = -1;
    this.SELECTED_COL_RANGE = null;
    this.SELECTED_ROW_RANGE = null;

    this.prefixArrayManager = new PrefixArrayManager(this);

    this._init();
  }

  _init() {
    const dpr = window.devicePixelRatio || 1;

    // Storing viewport size
    this.viewWidth = this.canvasContainer.clientWidth;
    this.viewHeight = this.canvasContainer.clientHeight;

    // Set canvas to screen size (Internal Resolution)
    this.canvas.width = this.viewWidth * dpr;
    this.canvas.height = this.viewHeight * dpr;

    // Set CSS(visual) canvas size
    this.canvas.style.width = `${this.viewWidth}px`;
    this.canvas.style.height = `${this.viewHeight}px`;

    // Scales the canvas coordinate system to match the DPR
    this.context.scale(dpr, dpr);

    // Set Grid Size on Wrapper Div
    const wrapper = document.getElementById("canvasWrapper");
    wrapper.style.width = `${this.TOTAL_COLUMNS * this.DEFAULT_COL_WIDTH}px`;
    wrapper.style.height = `${
      this.DEFAULT_ROW_HEIGHT * this.DEFAULT_ROW_HEIGHT
    }px`;
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    // Get new viewport size
    this.viewWidth = this.canvasContainer.clientWidth;
    this.viewHeight = this.canvasContainer.clientHeight;

    // Update canvas internal resolution
    this.canvas.width = this.viewWidth * dpr;
    this.canvas.height = this.viewHeight * dpr;

    // Match actual css size
    this.canvas.style.width = `${this.viewWidth}px`;
    this.canvas.style.height = `${this.viewHeight}px`;

    // Reset context and scale
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.scale(dpr, dpr);
    this.render();
  }

  getVisibleRowCols() {
    const scrollLeft = this.canvasContainer.scrollLeft;
    const scrollTop = this.canvasContainer.scrollTop;
    const viewportWidth = this.canvasContainer.clientWidth;
    const viewportHeight = this.canvasContainer.clientHeight;

    // Find startCol using binary search
    let startCol = 0;
    let left = 0,
      right = this.TOTAL_COLUMNS - 1;
    const targetX = scrollLeft + Config.ROW_HEADER_WIDTH;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const colX = PrefixArrayManager.getColXPosition(mid);
      const colWidth = Config.COL_WIDTHS[mid] || Config.COL_WIDTH;

      if (colX + colWidth > targetX) {
        startCol = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // Find endCol
    let endCol = startCol;
    for (let i = startCol; i < this.TOTAL_COLUMNS; i++) {
      const colX = PrefixArrayManager.getColXPosition(i);
      if (colX - scrollLeft > viewportWidth) {
        break;
      }
      endCol = i;
    }
    endCol = Math.min(this.TOTAL_COLUMNS - 1, endCol + 1);

    // Find startRow using binary search (similar to columns)
    let startRow = 0;
    let rowLeft = 0,
      rowRight = this.DEFAULT_ROW_HEIGHT - 1;
    const targetY = scrollTop + Config.COL_HEADER_HEIGHT;

    while (rowLeft <= rowRight) {
      const mid = Math.floor((rowLeft + rowRight) / 2);
      const rowY = PrefixArrayManager.getRowYPosition(mid);
      const rowHeight = Config.ROW_HEIGHTS[mid] || Config.ROW_HEIGHT;

      if (rowY + rowHeight > targetY) {
        startRow = mid;
        rowRight = mid - 1;
      } else {
        rowLeft = mid + 1;
      }
    }

    // Find endRow
    let endRow = startRow;
    for (let i = startRow; i < this.DEFAULT_ROW_HEIGHT; i++) {
      const rowY = PrefixArrayManager.getRowYPosition(i);
      if (rowY - scrollTop > viewportHeight) {
        break;
      }
      endRow = i;
    }
    endRow = Math.min(this.DEFAULT_ROW_HEIGHT - 1, endRow + 1);

    return { startRow, endRow, startCol, endCol, scrollLeft, scrollTop };
  }

  render() {
    const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
      this.getVisibleRowCols();

    console.log(
      "Drawing rows from",
      startRow,
      "to",
      endRow,
      "and cols",
      startCol,
      "to",
      endCol
    );

    this.context.clearRect(0, 0, this.viewWidth, this.viewHeight);

    this.context.save();

    this.context.translate(-scrollLeft, -scrollTop);

    this.context.beginPath();

    Draw.drawRowsCols(
      startRow,
      startCol,
      endRow,
      endCol,
      this.canvas,
      this.context
    );

    Draw.updateInputPosition(this.canvas, scrollLeft, scrollTop);

    Draw.drawSelectedCellBorder(
      this.context,
      startRow,
      endRow,
      startCol,
      endCol,
      scrollLeft,
      scrollTop
    );

    Draw.drawVisibleText(
      startRow,
      endRow,
      startCol,
      endCol,
      this.context,
      scrollLeft,
      scrollTop
    );

    Draw.drawColumnHeader(
      startRow,
      startCol,
      endRow,
      endCol,
      this.canvas,
      this.context,
      scrollLeft,
      scrollTop
    );

    Draw.drawRowHeader(
      startRow,
      startCol,
      endRow,
      endCol,
      this.canvas,
      this.context,
      scrollLeft,
      scrollTop
    );

    Draw.drawSelectedCellCorrepondingRowCol(
      this.context,
      startRow,
      endRow,
      startCol,
      endCol,
      scrollLeft,
      scrollTop
    );
    Draw.insertRowHeaderText(
      startRow,
      endRow,
      startCol,
      endCol,
      this.context,
      scrollTop
    );
    Draw.insertColHeaderText(
      startRow,
      endRow,
      startCol,
      endCol,
      this.context,
      scrollLeft
    );

    Draw.drawHighlighedColumnHeader(this.context, startCol, endCol, scrollLeft);
    Draw.drawHighlighedRowHeader(this.context, startRow, endRow, scrollTop);

    Draw.drawCornerBox(this.context);
  }
}
