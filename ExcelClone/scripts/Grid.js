import { Config } from "./Config.js";
import { Draw } from "./Draw.js";

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

  getVisibleRowCols() {
    const scrollLeft = this.canvasContainer.scrollLeft;
    const scrollTop = this.canvasContainer.scrollTop;
    const viewportWidth = this.canvasContainer.clientWidth;
    const viewportHeight = this.canvasContainer.clientHeight;

    // Calculate Visible Cell Range
    const startCol = Math.floor(scrollLeft / this.cellWidth);
    const endCol = Math.min(
      this.totalColumns,
      startCol + Math.ceil(viewportWidth / this.cellWidth) + 1
    );

    const startRow = Math.floor(scrollTop / this.cellHeight);
    const endRow = Math.min(
      this.totalRows,
      startRow + Math.ceil(viewportHeight / this.cellHeight) + 1
    );

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

    Draw.drawCornerBox(this.context);

    Draw.drawSelectedCellBorder(
      this.context,
      startRow,
      endRow,
      startCol,
      endCol,
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
  }
}
