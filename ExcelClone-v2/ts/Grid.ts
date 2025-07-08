import { Config } from "./Config.js";
import { Draw } from "./Draw.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { MouseHoverHandler } from "./MouseHoverHandler.js";
import { CellDataManager } from "./CellDataManager.js";
import { ColumnResizingManager } from "./ColumnResizingManager.js";
import { RowResizingManager } from "./RowResizingManager.js";
import { ColHeaderSelector } from "./ColHeaderSelector.js";
import { RowHeaderSelector } from "./RowHeaderSelector.js";
import { CellSelectionManager } from "./CellSelectionManager.js";
import { ArrowKeyHandler } from "./ArrowKeyHandler.js";

export class Grid {
  canvasContainer: HTMLDivElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  draw: Draw;
  mouseHoverHandler: MouseHoverHandler;
  cellDataManager: CellDataManager;
  columnResizingManager: ColumnResizingManager;
  rowResizingManager: RowResizingManager;
  colHeaderSelector:ColHeaderSelector;
  rowHeaderSelector:RowHeaderSelector;
  cellSelectionManager:CellSelectionManager;
  arrowKeyHandler:ArrowKeyHandler;

  TOTAL_ROWS = Config.TOTAL_ROWS;
  TOTAL_COLUMNS = Config.TOTAL_COLUMNS;

  COL_HEADER_HEIGHT = Config.COL_HEADER_HEIGHT;
  ROW_HEADER_WIDTH = Config.ROW_HEADER_WIDTH;

  DEFAULT_COL_WIDTH = Config.DEFAULT_COL_WIDTH;
  DEFAULT_ROW_HEIGHT = Config.DEFAULT_ROW_HEIGHT;
  DEFAULT_FONT_SIZE = Config.DEFAULT_FONT_SIZE;
  CURRENT_INPUT = null;
  INPUT_FINALIZED = false;

  ROW_HEIGHTS: Map<number, number> = new Map();
  COL_WIDTHS: Map<number, number> = new Map();

  TEXT_PADDING_X = 5;
  TEXT_PADDING_Y = 5;

  CURSOR_CHANGE_THRESHOLD = 3;
  MODE = "normal";
  CURSOR_IS_SET = false;

  SELECTED_COL_HEADER = -1;
  ADJUSTED_x1 = -1;
  IS_COL_HEADER_SELECTED = false;

  SELECTED_ROW_HEADER = -1;
  ADJUSTED_y1 = -1;

  SELECTED_CELL_RANGE = {
    startRow: 0,
    endRow: 0,
    startCol: 0,
    endCol: 0,
  };
  SELECTED_CELL = {
    row: 0,
    col: 0,
  };

  SELECTION_BEFORE_RESIZE: { [key: string]: any } | null = {};

  IS_SELECTING = false;

  HOVERED_COL = -1;
  RESIZING_COL = -1;
  INITIAL_X = 0;
  RESIZING_COL_OLD_WIDTH = -1;

  INITIAL_Y = 0;
  HOVERED_ROW = -1;
  RESIZING_ROW = -1;
  RESIZING_ROW_OLD_HEIGHT = -1;

  IS_SELECTING_HEADER = false;
  HEADER_SELECTION_TYPE:string | null = null;
  HEADER_SELECTION_START_ROW = -1;
  HEADER_SELECTION_END_ROW = -1;
  HEADER_SELECTION_START_COL = -1;
  HEADER_SELECTION_END_COL = -1;
  SELECTED_COL_RANGE: { [key: string]: any } | null = null;
  SELECTED_ROW_RANGE: { [key: string]: any } | null = null;

  prefixArrayManager = new PrefixArrayManager(this);

  viewWidth: number;
  viewHeight: number;

  constructor(
    canvasContainer: HTMLDivElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    this.canvasContainer = canvasContainer;
    this.canvas = canvas;
    this.context = context;
    this.viewWidth = this.canvasContainer.clientWidth;
    this.viewHeight = this.canvasContainer.clientHeight;

    this.draw = new Draw(this);
    this.mouseHoverHandler = new MouseHoverHandler(this);
    this.cellDataManager = new CellDataManager(this);
    this.rowResizingManager = new RowResizingManager(this);
    this.columnResizingManager = new ColumnResizingManager(this);
    this.colHeaderSelector = new ColHeaderSelector(this);
    this.rowHeaderSelector = new RowHeaderSelector(this);
    this.cellSelectionManager=new CellSelectionManager(this);
    this.arrowKeyHandler=new ArrowKeyHandler(this);
    this._init();
  }

  getSelectedCol(startCol: number, endCol: number, x: number) {
    let currentX = this.ROW_HEADER_WIDTH;
    for (let i = startCol; i <= endCol; i++) {
      currentX += this.COL_WIDTHS.get(i) ?? this.DEFAULT_COL_WIDTH;
      if (currentX > x) {
        console.log("Column selected:", i);
        return i;
      }
    }
    return -1;
  }

  getSelectedRow(startRow: number, endRow: number, y: number) {
    let currentY = this.COL_HEADER_HEIGHT;

    for (let i = startRow; i < endRow; i++) {
      currentY += this.ROW_HEIGHTS.get(i) ?? this.DEFAULT_ROW_HEIGHT;
      if (currentY > y) {
        console.log("Row selected:", i);
        return i;
      }
    }
    return -1;
  }

  getPosition(row: number, col: number) {
    let y = this.COL_HEADER_HEIGHT;
    let x = this.ROW_HEADER_WIDTH;

    for (let r = 0; r < row; r++) {
      y += this.ROW_HEIGHTS.get(r) ?? this.DEFAULT_ROW_HEIGHT;
    }
    for (let c = 0; c < col; c++) {
      x += this.COL_WIDTHS.get(c) ?? this.DEFAULT_COL_WIDTH;
    }
    return { x, y };
  }

  getXPosition(col: number) {
    let x = this.ROW_HEADER_WIDTH;

    for (let c = 0; c < col; c++) {
      x += this.COL_WIDTHS.get(c) ?? this.DEFAULT_COL_WIDTH;
    }
    return x;
  }

  getYPosition(row: number) {
    let y = this.COL_HEADER_HEIGHT;

    for (let r = 0; r < row; r++) {
      y += this.ROW_HEIGHTS.get(r) ?? this.DEFAULT_ROW_HEIGHT;
    }

    return y;
  }

  _init() {
    this.prefixArrayManager.createColPrefixArray(this.TOTAL_COLUMNS);
    this.prefixArrayManager.createRowPrefixArray(this.TOTAL_ROWS);

    const dpr = window.devicePixelRatio ?? 1;

    this.viewWidth = this.canvasContainer.clientWidth;
    this.viewHeight = this.canvasContainer.clientHeight;

    this.canvas.width = this.viewWidth * dpr;
    this.canvas.height = this.viewHeight * dpr;

    this.canvas.style.width = `${this.viewWidth}px`;
    this.canvas.style.height = `${this.viewHeight}px`;

    this.context.scale(dpr, dpr);

    const wrapper = document.getElementById("canvasWrapper") as HTMLDivElement;
    wrapper.style.width = `${this.TOTAL_COLUMNS * this.DEFAULT_COL_WIDTH}px`;
    wrapper.style.height = `${this.TOTAL_ROWS * this.DEFAULT_ROW_HEIGHT}px`;
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
    // console.log(this.prefixArrayManager.rowPrefixArray);
    const scrollLeft = this.canvasContainer.scrollLeft;
    const scrollTop = this.canvasContainer.scrollTop;
    const viewportWidth = this.canvasContainer.clientWidth;
    const viewportHeight = this.canvasContainer.clientHeight;

    // Find startCol using binary search
    let startCol = 0;
    let left = 0,
      right = this.TOTAL_COLUMNS - 1;
    const targetX = scrollLeft + this.ROW_HEADER_WIDTH;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const colX = this.prefixArrayManager.getColXPosition(mid);
      const colWidth = this.COL_WIDTHS.get(mid) ?? this.DEFAULT_COL_WIDTH;

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
      const colX = this.prefixArrayManager.getColXPosition(i);
      if (colX - scrollLeft > viewportWidth) {
        break;
      }
      endCol = i;
    }
    endCol = Math.min(this.TOTAL_COLUMNS - 1, endCol + 1);

    // Find startRow using binary search (similar to columns)
    let startRow = 0;
    let rowLeft = 0,
      rowRight = this.TOTAL_ROWS - 1; // Fixed: was this.DEFAULT_ROW_HEIGHT - 1
    const targetY = scrollTop + this.COL_HEADER_HEIGHT;

    while (rowLeft <= rowRight) {
      const mid = Math.floor((rowLeft + rowRight) / 2);
      const rowY = this.prefixArrayManager.getRowYPosition(mid);
      const rowHeight = this.ROW_HEIGHTS.get(mid) ?? this.DEFAULT_ROW_HEIGHT;

      if (rowY + rowHeight > targetY) {
        startRow = mid;
        rowRight = mid - 1;
      } else {
        rowLeft = mid + 1;
      }
    }

    // Find endRow
    let endRow = startRow;
    for (let i = startRow; i < this.TOTAL_ROWS; i++) {
      // Fixed: was this.DEFAULT_ROW_HEIGHT
      const rowY = this.prefixArrayManager.getRowYPosition(i);
      if (rowY - scrollTop > viewportHeight) {
        break;
      }
      endRow = i;
    }
    endRow = Math.min(this.TOTAL_ROWS - 1, endRow + 1); // Fixed: was this.DEFAULT_ROW_HEIGHT - 1

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

    this.draw.drawRowsCols(startRow, startCol, endRow, endCol);

    // Draw.updateInputPosition(this.canvas, scrollLeft, scrollTop);

    this.draw.drawSelectedCellBorder(
      startRow,
      endRow,
      startCol,
      endCol,
      scrollLeft,
      scrollTop
    );

    // this.draw.drawVisibleText(
    //   startRow,
    //   endRow,
    //   startCol,
    //   endCol,
    //   this.context,
    //   scrollLeft,
    //   scrollTop
    // );

    this.draw.drawColumnHeader(endCol);

    this.draw.drawRowHeader(endRow);

    this.draw.drawSelectedCellCorrepondingRowCol(
      startRow,
      endRow,
      startCol,
      endCol,
      scrollLeft,
      scrollTop
    );
    this.draw.insertRowHeaderText(startRow, endRow, scrollTop);
    this.draw.insertColHeaderText(startCol, endCol, scrollLeft);

    // this.draw.drawHighlighedColumnHeader(this.context, startCol, endCol, scrollLeft);
    // this.draw.drawHighlighedRowHeader(this.context, startRow, endRow, scrollTop);

    this.draw.drawCornerBox();
  }
}
