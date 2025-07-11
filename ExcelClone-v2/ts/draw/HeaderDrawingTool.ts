import { Grid } from "../Grid.js";
import { Utils } from "../Utils.js";

export class HeaderDrawingTool {
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }
  drawHeaderRange(
    from: number,
    to: number,
    start: number,
    end: number,
    drawFn: (index: number) => void
  ) {
    const min = Math.min(from, to);
    const max = Math.max(from, to);
    const drawStart = Math.max(min, start);
    const drawEnd = Math.min(max, end);

    for (let i = drawStart; i <= drawEnd; i++) {
      drawFn(i);
    }
  }
  drawHighlighedColumnHeader(
    startCol: number,
    endCol: number,
    scrollLeft: number
  ) {
    if (this.grid.SELECTED_COL_HEADER === -1) return;

    const draw = (col: number) => this.drawSingleColumnHeader(col, scrollLeft);

    if (
      this.grid.IS_SELECTING_HEADER &&
      this.grid.HEADER_SELECTION_TYPE === "column"
    ) {
      this.drawHeaderRange(
        this.grid.HEADER_SELECTION_START_COL,
        this.grid.HEADER_SELECTION_END_COL,
        startCol,
        endCol,
        draw
      );
    } else if (this.grid.SELECTED_COL_RANGE) {
      this.drawHeaderRange(
        this.grid.SELECTED_COL_RANGE.startCol,
        this.grid.SELECTED_COL_RANGE.endCol,
        startCol,
        endCol,
        draw
      );
    } else {
      const selectedCol = this.grid.SELECTED_COL_HEADER - 1;
      if (selectedCol >= startCol && selectedCol <= endCol) {
        draw(selectedCol);
      }
    }
  }
  drawHighlighedRowHeader(startRow: number, endRow: number, scrollTop: number) {
    if (this.grid.SELECTED_ROW_HEADER === -1) return;

    const draw = (row: number) => this.drawSingleRowHeader(row, scrollTop);

    if (
      this.grid.IS_SELECTING_HEADER &&
      this.grid.HEADER_SELECTION_TYPE === "row"
    ) {
      this.drawHeaderRange(
        this.grid.HEADER_SELECTION_START_ROW,
        this.grid.HEADER_SELECTION_END_ROW,
        startRow,
        endRow,
        draw
      );
    } else if (this.grid.SELECTED_ROW_RANGE) {
      this.drawHeaderRange(
        this.grid.SELECTED_ROW_RANGE.startRow,
        this.grid.SELECTED_ROW_RANGE.endRow,
        startRow,
        endRow,
        draw
      );
    } else {
      const selectedRow = this.grid.SELECTED_ROW_HEADER - 1;
      if (selectedRow >= startRow && selectedRow <= endRow) {
        draw(selectedRow);
      }
    }
  }
  drawSingleColumnHeader(col: number, scrollLeft: number) {
    const ctx = this.grid.context;
    const colWidth =
      this.grid.COL_WIDTHS.get(col) || this.grid.DEFAULT_COL_WIDTH;
    const x = this.grid.getXPosition(col) - scrollLeft;

    ctx.fillStyle = "#187c44";
    ctx.fillRect(x, 0, colWidth, this.grid.COL_HEADER_HEIGHT);

    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const label = Utils.numberToColheader(col);
    ctx.fillText(label, x + colWidth / 2, this.grid.COL_HEADER_HEIGHT / 2 + 2);

    ctx.strokeStyle = "#187c44";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 0, colWidth, this.grid.COL_HEADER_HEIGHT);
  }
  drawSingleRowHeader(row: number, scrollTop: number) {
    const ctx = this.grid.context;
    const rowHeight =
      this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;
    const y = this.grid.getYPosition(row) - scrollTop;

    ctx.fillStyle = "#187c44";
    ctx.fillRect(0, y, this.grid.ROW_HEADER_WIDTH, rowHeight);

    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center"; // cleaner than calculating textX manually
    ctx.textBaseline = "middle";

    const label = (row + 1).toString();
    ctx.fillText(label, this.grid.ROW_HEADER_WIDTH / 2, y + rowHeight / 2);

    ctx.strokeStyle = "#187c44";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, y, this.grid.ROW_HEADER_WIDTH, rowHeight);
  }

}