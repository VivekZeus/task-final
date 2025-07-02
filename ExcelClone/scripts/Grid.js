import { Config } from "./Config.js";
import { Draw } from "./Draw.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";

export class Grid {
  constructor(
    canvasContainer,
    canvas,
    context,
    totalRows,
    totalColumns,
    cellWidth,
    cellHeight
  ) {
    this.canvasContainer = canvasContainer;
    this.canvas = canvas;
    this.context = context;
    this.totalRows = totalRows;
    this.totalColumns = totalColumns;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.rows = [];
    this.cols = [];
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
    wrapper.style.width = `${this.totalColumns * this.cellWidth}px`;
    wrapper.style.height = `${this.totalRows * this.cellHeight}px`;
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

  getColumnXPosition(columnIndex) {
    let x = Config.ROW_HEADER_WIDTH;
    for (let i = 0; i < columnIndex; i++) {
      x += Config.COL_WIDTHS[i] || this.cellWidth;
    }
    return x;
  }


  getVisibleRowCols() {
    const scrollLeft = this.canvasContainer.scrollLeft;
    const scrollTop = this.canvasContainer.scrollTop;
    const viewportWidth = this.canvasContainer.clientWidth;
    const viewportHeight = this.canvasContainer.clientHeight;

    let startCol = 0;
    let left = 0,
      right = this.totalColumns - 1;
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
    for (let i = startCol; i < this.totalColumns; i++) {
      const colX = PrefixArrayManager.getColXPosition(i);
      if (colX - scrollLeft > viewportWidth) {
        break;
      }
      endCol = i;
    }
    endCol = Math.min(this.totalColumns - 1, endCol + 1);

    // Similar logic for rows (can also use binary search)
    const startRow = Math.floor(scrollTop / Config.ROW_HEIGHT);
    const endRow = Math.min(
      this.totalRows - 1,
      startRow + Math.ceil(viewportHeight / Config.ROW_HEIGHT) + 1
    );

    // Check if we need to expand columns (when endCol reaches 80% of totalColumns)
    const colThreshold = Math.floor(this.totalColumns * 0.8);
    if (endCol >= colThreshold) {
      Config.TOTAL_COLUMNS += 300;
      this.totalColumns += 300;

      // Update prefix array for new columns
      console.log("col expansion started");
      console.log(this.totalColumns);
      PrefixArrayManager.createColPrefixArray(this.totalColumns);
      console.log("col expansion ended");
    }

    // Check if we need to expand rows (when endRow reaches 80% of totalRows)
    const rowThreshold = Math.floor(this.totalRows * 0.8);
    if (endRow >= rowThreshold) {
      Config.TOTAL_ROWS += 300;
      this.totalRows += 300;

      // Update prefix array for new rows (if needed)
      PrefixArrayManager.createRowPrefixArray(this.totalRows);

      // console.log(`Expanded rows from ${oldTotalRows} to ${this.totalRows}`);
    }

    return {
      startRow,
      endRow,
      startCol,
      endCol,
      scrollLeft,
      scrollTop,
    };
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

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

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


    Draw.drawSelectedCellBorder(
      this.context,
      startRow,
      endRow,
      startCol,
      endCol,
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

    // Draw.drawResizeIndicator(this.context,scrollLeft)
    Draw.drawCornerBox(this.context);
  }
}
