import { Grid } from "../Grid.js";

export class CellRangeDrawingTool {
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }


  drawSelectedCellCorrepondingRowCol(
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    scrollLeft: number,
    scrollTop: number
  ) {
    const sel = this.grid.SELECTED_CELL_RANGE;
    if (!sel || this.grid.RESIZING_COL !== -1) return;

    const { startRow: sRow, endRow: eRow, startCol: sCol, endCol: eCol } = sel;
    const hasRange = sRow !== -1 && sCol !== -1 && eRow !== -1 && eCol !== -1;
    const hasSingle = sRow !== -1 && eRow !== -1;

    if (!hasRange && !hasSingle) return;

    const ctx = this.grid.context;
    const getColWidth = (col: number) =>
      this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
    const getRowHeight = (row: number) =>
      this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;
    const getCellPos = this.grid.prefixArrayManager.getCellPosition.bind(
      this.grid.prefixArrayManager
    );

    const fillHeader = (
      x: number,
      y: number,
      w: number,
      h: number,
      borderDir: "bottom" | "right"
    ) => {
      ctx.fillStyle = "rgba(173, 235, 193, 0.6)";
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#187c44";
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (borderDir === "bottom") {
        ctx.moveTo(x, y + h - 1);
        ctx.lineTo(x + w, y + h - 1);
      } else {
        ctx.moveTo(x + w - 1, y);
        ctx.lineTo(x + w - 1, y + h);
      }
      ctx.stroke();
    };

    ctx.save();

    if (hasRange) {
      const minRow = Math.min(sRow, eRow);
      const maxRow = Math.max(sRow, eRow);
      const minCol = Math.min(sCol, eCol);
      const maxCol = Math.max(sCol, eCol);

      for (let col = minCol; col <= maxCol; col++) {
        if (col < startCol || col > endCol) continue;
        const { x } = getCellPos(0, col);
        fillHeader(
          x - scrollLeft,
          0,
          getColWidth(col),
          this.grid.COL_HEADER_HEIGHT,
          "bottom"
        );
      }

      for (let row = minRow; row <= maxRow; row++) {
        if (row < startRow || row > endRow) continue;
        const { y } = getCellPos(row, 0);
        fillHeader(
          0,
          y - scrollTop,
          this.grid.ROW_HEADER_WIDTH,
          getRowHeight(row),
          "right"
        );
      }
    } else {
      const col = eCol;
      const row = sRow;

      if (col >= startCol && col <= endCol) {
        const { x } = getCellPos(0, col);
        fillHeader(
          x - scrollLeft,
          0,
          getColWidth(col),
          this.grid.COL_HEADER_HEIGHT,
          "bottom"
        );
      }

      if (row >= startRow && row <= endRow) {
        const { y } = getCellPos(row, 0);
        fillHeader(
          0,
          y - scrollTop,
          this.grid.ROW_HEADER_WIDTH,
          getRowHeight(row),
          "right"
        );
      }
    }

    ctx.restore();
  }

  drawSelectedCellBorder(
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    scrollLeft: number,
    scrollTop: number
  ) {
    const sel = this.grid.SELECTED_CELL_RANGE;
    if (!sel || this.grid.RESIZING_COL !== -1 || this.grid.RESIZING_ROW !== -1)
      return;

    const { startRow: sRow, endRow: eRow, startCol: sCol, endCol: eCol } = sel;

    const minRow = Math.min(sRow, eRow);
    const maxRow = Math.max(sRow, eRow);
    const minCol = Math.min(sCol, eCol);
    const maxCol = Math.max(sCol, eCol);

    if (minRow === -1 || minCol === -1) return;

    this.grid.SELECTED_CELL_RANGE_STAT = {
      startRow: minRow,
      endRow: maxRow,
      startCol: minCol,
      endCol: maxCol,
    };

    const ctx = this.grid.context;
    const getWidth = (col: number) =>
      this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
    const getHeight = (row: number) =>
      this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;
    const getPos = this.grid.prefixArrayManager.getCellPosition.bind(
      this.grid.prefixArrayManager
    );

    ctx.save();

    // === SINGLE CELL SELECTION ===
    if (sRow === eRow && sCol === eCol) {
      const { x, y } = getPos(sRow, sCol);
      const width = getWidth(sCol);
      const height = getHeight(sRow);

      const drawX = x - scrollLeft;
      const drawY = y - scrollTop;

      ctx.strokeStyle = "#187c44";
      ctx.lineWidth = 2;
      ctx.strokeRect(drawX, drawY, width, height);

      // Draw resize handle
      const handleSize = 6;
      ctx.fillStyle = "#187c44";
      ctx.fillRect(
        drawX + width - handleSize + 3,
        drawY + height - handleSize + 3,
        handleSize,
        handleSize
      );

      ctx.restore();
      return;
    }

    // Fill background (excluding starting cell)
    const totalCols = maxCol - minCol + 1;
    const totalRows = maxRow - minRow + 1;
    const totalCells = totalCols * totalRows;

    ctx.fillStyle = "rgba(24, 124, 68, 0.1)";
    for (let i = 0; i < totalCells; i++) {
      const row = minRow + Math.floor(i / totalCols);
      const col = minCol + (i % totalCols);

      if (row === sRow && col === sCol) continue;

      const { x, y } = this.grid.prefixArrayManager.getCellPosition(row, col);
      ctx.fillRect(
        x - scrollLeft,
        y - scrollTop,
        getWidth(col),
        getHeight(row)
      );
    }

    // Fill the starting cell white
    const startPos = getPos(sRow, sCol);
    const startX = startPos.x - scrollLeft;
    const startY = startPos.y - scrollTop;
    const startWidth = getWidth(sCol);
    const startHeight = getHeight(sRow);

    ctx.fillStyle = "white";
    ctx.fillRect(startX, startY, startWidth, startHeight);

    // Draw outer green border
    const topLeft = getPos(minRow, minCol);
    const bottomRight = getPos(maxRow, maxCol);
    const borderX = topLeft.x - scrollLeft;
    const borderY = topLeft.y - scrollTop;
    const borderW = bottomRight.x - topLeft.x + getWidth(maxCol);
    const borderH = bottomRight.y - topLeft.y + getHeight(maxRow);

    ctx.strokeStyle = "#187c44";
    ctx.lineWidth = 2;
    ctx.strokeRect(borderX, borderY, borderW, borderH);

    // Draw resize handle
    const handleSize = 6;
    ctx.fillStyle = "#187c44";
    ctx.fillRect(
      borderX + borderW - handleSize + 2,
      borderY + borderH - handleSize + 2,
      handleSize + 1,
      handleSize + 1
    );

    ctx.restore();
  }
}
