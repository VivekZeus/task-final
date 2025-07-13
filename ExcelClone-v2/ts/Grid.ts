import { Config } from "./Config.js";
import { PrefixArrayManager } from "./otherManager/PrefixArrayManager.js";
import { MouseHoverManager } from "./manager/MouseHoverManager.js";
import { CellDataManager } from "./otherManager/CellDataManager.js";
import { ColumnResizingManager } from "./manager/ColumnResizingManager.js";
import { RowResizingManager } from "./manager/RowResizingManager.js";
import { CellSelectionManager } from "./manager/CellSelectionManager.js";
import { HeaderSelectionManager } from "./manager/HeaderSelectionManager.js";
import { StatisticsManager } from "./statistics/StatisticsManager.js";
import { AutoScrollManager } from "./otherManager/AutoScrollManager.js";
import { KeyDownEventOrchestrator } from "./orchestrator/KeyDownEventOrchestrator.js";
import { DoubleClickEventOrchestrator } from "./orchestrator/DoubleClickEventOrchestrator.js";
import { CellInputOrchestrator } from "./orchestrator/CellInputOrchestrator.js";
import { PointerOrchestrator } from "./orchestrator/PointerOrchestrator.js";
import { Utils } from "./Utils.js";
import { CellRangeDrawingTool } from "./draw/CellRangeDrawingTool.js";
import { HeaderTextDrawingTool } from "./draw/HeaderTextDrawingTool.js";
import { DataDrawingTool } from "./draw/DataDrawingTool.js";
import { ResizingDrawingTool } from "./draw/ResizingDrawingTool.js";
import { GridDrawingTool } from "./draw/GridDrawingTool.js";
import { HeaderDrawingTool } from "./draw/HeaderDrawingTool.js";
import { DataLoaderManager } from "./otherManager/DataLoaderManager.js";
import { CommandManager } from "./CommandManager.js";

export class Grid {
  canvasContainer: HTMLDivElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  // draw: Draw;
  cellDataManager: CellDataManager;
  keyDownEventOrchestrator: KeyDownEventOrchestrator;
  statisticsManager: StatisticsManager;
  autoScrollManager: AutoScrollManager;
  doubleClickEventOrchestrator: DoubleClickEventOrchestrator;
  cellInputOrchestrator: CellInputOrchestrator;
  pointerOrchestrator: PointerOrchestrator;

  cellRangeDrawingTool: CellRangeDrawingTool;
  headerTextDrawingTool: HeaderTextDrawingTool;
  dataDrawingTool: DataDrawingTool;
  resizingDrawingTool: ResizingDrawingTool;
  gridDrawingTool: GridDrawingTool;
  headerDrawingTool: HeaderDrawingTool;
  dataLoaderManager:DataLoaderManager;
   commandManager: CommandManager;

  

  viewWidth: number;
  viewHeight: number;

  autoScrollDir: string | null = null;
  autoScrollFrameId: number | null = null;

  TOTAL_ROWS = structuredClone(Config.TOTAL_ROWS);
  TOTAL_COLUMNS = structuredClone(Config.TOTAL_COLUMNS);

  COL_HEADER_HEIGHT = structuredClone(Config.COL_HEADER_HEIGHT);
  ROW_HEADER_WIDTH = structuredClone(Config.ROW_HEADER_WIDTH);

  DEFAULT_COL_WIDTH = structuredClone(Config.DEFAULT_COL_WIDTH);
  DEFAULT_ROW_HEIGHT = structuredClone(Config.DEFAULT_ROW_HEIGHT);
  DEFAULT_FONT_SIZE = structuredClone(Config.DEFAULT_FONT_SIZE);

  CURRENT_INPUT: string | null = null;
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

  SELECTED_CELL_RANGE_STAT = {
    startRow: 0,
    endRow: 0,
    startCol: 0,
    endCol: 0,
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
  HEADER_SELECTION_TYPE: string | null = null;
  HEADER_SELECTION_START_ROW = -1;
  HEADER_SELECTION_END_ROW = -1;
  HEADER_SELECTION_START_COL = -1;
  HEADER_SELECTION_END_COL = -1;
  SELECTED_COL_RANGE: { [key: string]: any } | null = null;
  SELECTED_ROW_RANGE: { [key: string]: any } | null = null;

  prefixArrayManager: PrefixArrayManager;

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

    // this.draw = new Draw(this);

    this.prefixArrayManager = new PrefixArrayManager(this);
    this.cellDataManager = new CellDataManager(this);

    this.keyDownEventOrchestrator = new KeyDownEventOrchestrator(this);
    this.statisticsManager = new StatisticsManager(this);
    this.autoScrollManager = new AutoScrollManager(this);
    this.doubleClickEventOrchestrator = new DoubleClickEventOrchestrator(
      this,
      this.keyDownEventOrchestrator.getKeyboardKeyHandler()
    );
    this.cellInputOrchestrator = new CellInputOrchestrator(this);
    this.pointerOrchestrator = new PointerOrchestrator(this);
    this.cellRangeDrawingTool = new CellRangeDrawingTool(this);
    this.headerTextDrawingTool = new HeaderTextDrawingTool(this);
    this.dataDrawingTool = new DataDrawingTool(this);
    this.resizingDrawingTool = new ResizingDrawingTool(this);
    this.gridDrawingTool = new GridDrawingTool(this);
    this.headerDrawingTool = new HeaderDrawingTool(this);
    this.dataLoaderManager=new DataLoaderManager(this);
     this.commandManager = new CommandManager();
    this.init();
    this.inializeManagers();
  }

  isVisible(){
    const row = this.SELECTED_CELL_RANGE.startRow;
    const col = this.SELECTED_CELL_RANGE.startCol;
    const { startRow, endRow, startCol, endCol } =
    this.getVisibleRowCols();

    return row >= startRow+1 && row <= endRow && col >= startCol && col <= endCol;  
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

  private init() {
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

  private inializeManagers() {
    this.pointerOrchestrator.registerManager(new MouseHoverManager(this));
    this.pointerOrchestrator.registerManager(new ColumnResizingManager(this,this.commandManager));
    this.pointerOrchestrator.registerManager(new RowResizingManager(this,this.commandManager));
    this.pointerOrchestrator.registerManager(new HeaderSelectionManager(this));
    this.pointerOrchestrator.registerManager(new CellSelectionManager(this));
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

    this.gridDrawingTool.drawRowsCols(startRow, startCol, endRow, endCol);

    Utils.updateCellSelectionInfo(this);

    this.cellRangeDrawingTool.drawSelectedCellBorder(
      startRow,
      endRow,
      startCol,
      endCol,
      scrollLeft,
      scrollTop
    );

    this.dataDrawingTool.drawVisibleText(
      startRow,
      endRow,
      startCol,
      endCol,
      scrollLeft,
      scrollTop
    );

    this.gridDrawingTool.drawColumnHeader(endCol);

    this.gridDrawingTool.drawRowHeader(endRow);

    this.cellRangeDrawingTool.drawSelectedCellCorrepondingRowCol(
      startRow,
      endRow,
      startCol,
      endCol,
      scrollLeft,
      scrollTop
    );

    this.headerTextDrawingTool.insertRowHeaderText(startRow, endRow, scrollTop);
    this.headerTextDrawingTool.insertColHeaderText(
      startCol,
      endCol,
      scrollLeft
    );

    this.headerDrawingTool.drawHighlighedColumnHeader(
      startCol,
      endCol,
      scrollLeft
    );
    this.headerDrawingTool.drawHighlighedRowHeader(startRow, endRow, scrollTop);

    this.gridDrawingTool.drawCornerBox();
  }
}
