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

  // getColumnXPosition(columnIndex) {
  //   let x = Config.ROW_HEADER_WIDTH;
  //   for (let i = 0; i < columnIndex; i++) {
  //     x += Config.COL_WIDTHS[i] ||Config.COL_WIDTH;
  //   }
  //   return x;
  // }

  getVisibleRowCols() {
    const scrollLeft = this.canvasContainer.scrollLeft;
    const scrollTop = this.canvasContainer.scrollTop;
    const viewportWidth = this.canvasContainer.clientWidth;
    const viewportHeight = this.canvasContainer.clientHeight;

    // Find startCol using binary search
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

    // Find startRow using binary search (similar to columns)
    let startRow = 0;
    let rowLeft = 0,
      rowRight = this.totalRows - 1;
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
    for (let i = startRow; i < this.totalRows; i++) {
      const rowY = PrefixArrayManager.getRowYPosition(i);
      if (rowY - scrollTop > viewportHeight) {
        break;
      }
      endRow = i;
    }
    endRow = Math.min(this.totalRows - 1, endRow + 1);

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

    // Clear the canvas using viewport dimensions, not internal resolution
    this.context.clearRect(0, 0, this.viewWidth, this.viewHeight);

    // Save context state before transformations
    this.context.save();

    // Apply scroll translation
    this.context.translate(-scrollLeft, -scrollTop);

    // Begin your drawing operations
    this.context.beginPath();

    // ... rest of your drawing code here ...

    // Make sure to restore context state after drawing
    // this.context.restore();

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

    Draw.drawHighlighedColumnHeader(this.context, startCol, endCol, scrollLeft);
    Draw.drawHighlighedRowHeader(this.context, startRow, endRow, scrollTop);
    Draw.drawCornerBox(this.context);
  }
}
