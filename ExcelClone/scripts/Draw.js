import { Config } from "./Config.js";
import { Utils } from "./Utils.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";

export class Draw {
  constructor() {}


  static drawSelectedCellCorrepondingRowCol(
  context,
  startRow,
  endRow,
  startCol,
  endCol,
  scrollLeft,
  scrollTop
) {
  const selStartRow = Config.SELECTED_CELL_RANGE.startRow;
  const selStartCol = Config.SELECTED_CELL_RANGE.startCol;
  const selEndRow = Config.SELECTED_CELL_RANGE.endRow;
  const selEndCol = Config.SELECTED_CELL_RANGE.endCol;

  // Also check for single cell selection for backwards compatibility
  const singleSelRow = Config.SELECTED_CELL.row;
  const singleSelCol = Config.SELECTED_CELL.col;

  // Determine if we have a range selection or single cell selection
  const hasRangeSelection = selStartRow !== -1 && selStartCol !== -1 && selEndRow !== -1 && selEndCol !== -1;
  const hasSingleSelection = singleSelRow !== -1 && singleSelCol !== -1;

  if (!hasRangeSelection && !hasSingleSelection) return;
  if (Config.RESIZING_COL !== -1) return;

  const highlightColor = "rgba(173, 235, 193, 0.6)";
  const borderColor = "#187c44";

  context.save();

  if (hasRangeSelection) {
    // Handle range selection
    const minRow = Math.min(selStartRow, selEndRow);
    const maxRow = Math.max(selStartRow, selEndRow);
    const minCol = Math.min(selStartCol, selEndCol);
    const maxCol = Math.max(selStartCol, selEndCol);

    // === Column Headers Highlight === (for all columns in range)
    for (let col = minCol; col <= maxCol; col++) {
      if (col >= startCol && col <= endCol) {
        const colPos = PrefixArrayManager.getCellPosition(0, col);
        const colX = colPos.x - scrollLeft;
        const colWidth = Config.COL_WIDTHS[col] || Config.COL_WIDTH;
        const colHeight = Config.COL_HEADER_HEIGHT;

        // Fill
        context.fillStyle = highlightColor;
        context.fillRect(colX, 0, colWidth, colHeight);

        // Border bottom
        context.strokeStyle = borderColor;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(colX, colHeight - 1);
        context.lineTo(colX + colWidth, colHeight - 1);
        context.stroke();
      }
    }

    // === Row Headers Highlight === (for all rows in range)
    for (let row = minRow; row <= maxRow; row++) {
      if (row >= startRow && row <= endRow) {
        const rowPos = PrefixArrayManager.getCellPosition(row, 0);
        const rowY = rowPos.y - scrollTop;
        const rowWidth = Config.ROW_HEADER_WIDTH;
        const rowHeight = Config.ROW_HEIGHTS[row] || Config.ROW_HEIGHT;

        // Fill
        context.fillStyle = highlightColor;
        context.fillRect(0, rowY, rowWidth, rowHeight);

        // Border right
        context.strokeStyle = borderColor;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(rowWidth - 1, rowY);
        context.lineTo(rowWidth - 1, rowY + rowHeight);
        context.stroke();
      }
    }
  } else {
    // Handle single cell selection (original behavior)
    const selRow = singleSelRow;
    const selCol = singleSelCol;

    // === Column Header Highlight === (Even if row is out of view)
    if (selCol >= startCol && selCol <= endCol) {
      const colPos = PrefixArrayManager.getCellPosition(0, selCol);
      const colX = colPos.x - scrollLeft;
      const colWidth = Config.COL_WIDTHS[selCol] || Config.COL_WIDTH;
      const colHeight = Config.COL_HEADER_HEIGHT;

      // Fill
      context.fillStyle = highlightColor;
      context.fillRect(colX, 0, colWidth, colHeight);

      // Border bottom
      context.strokeStyle = borderColor;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(colX, colHeight - 1);
      context.lineTo(colX + colWidth, colHeight - 1);
      context.stroke();
    }

    // === Row Header Highlight === (Even if col is out of view)
    if (selRow >= startRow && selRow <= endRow) {
      const rowPos = PrefixArrayManager.getCellPosition(selRow, 0);
      const rowY = rowPos.y - scrollTop;
      const rowWidth = Config.ROW_HEADER_WIDTH;
      const rowHeight = Config.ROW_HEIGHTS[selRow] || Config.ROW_HEIGHT;

      // Fill
      context.fillStyle = highlightColor;
      context.fillRect(0, rowY, rowWidth, rowHeight);

      // Border right
      context.strokeStyle = borderColor;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(rowWidth - 1, rowY);
      context.lineTo(rowWidth - 1, rowY + rowHeight);
      context.stroke();
    }
  }

  context.restore();
}

  static drawSelectedCellBorder(
  context,
  startRow,
  endRow,
  startCol,
  endCol,
  scrollLeft,
  scrollTop
) {
  const selStartRow = Config.SELECTED_CELL_RANGE.startRow;
  const selStartCol = Config.SELECTED_CELL_RANGE.startCol;
  const selEndCol = Config.SELECTED_CELL_RANGE.endCol;
  const selEndRow = Config.SELECTED_CELL_RANGE.endRow;

  const minRow = Math.min(selStartRow, selEndRow);
  const maxRow = Math.max(selStartRow, selEndRow);
  const minCol = Math.min(selStartCol, selEndCol);
  const maxCol = Math.max(selStartCol, selEndCol);

  // Reject if there's no selection or it's fully outside the visible area
  if (
    minRow === -1 ||
    minCol === -1 ||
    maxRow < startRow ||
    minRow > endRow ||
    maxCol < startCol ||
    minCol > endCol ||
    Config.RESIZING_COL !== -1
  ) {
    return;
  }

  // Single cell selection
  if (
    selStartRow === selEndRow &&
    selStartCol === selEndCol &&
    selStartRow !== -1 &&
    selStartCol !== -1
  ) {
    const pos = PrefixArrayManager.getCellPosition(selStartRow, selStartCol);
    const x = pos.x - scrollLeft;
    const y = pos.y - scrollTop;
    const width = Config.COL_WIDTHS[selStartCol] || Config.COL_WIDTH;
    const height = Config.ROW_HEIGHTS[selStartRow] || Config.ROW_HEIGHT;

    context.strokeStyle = "#187c44";
    context.lineWidth = 2;
    context.strokeRect(x, y, width, height);

    const handleSize = 6;
    const handleOffset = 2;

    context.fillStyle = "#187c44";
    context.fillRect(
      x + width - handleSize - handleOffset + 5,
      y + height - handleSize - handleOffset + 5,
      handleSize,
      handleSize
    );
  } else {
    // Multi-cell range selection
    const visibleMinRow = Math.max(minRow, startRow);
    const visibleMaxRow = Math.min(maxRow, endRow);
    const visibleMinCol = Math.max(minCol, startCol);
    const visibleMaxCol = Math.min(maxCol, endCol);

    // Fill the range with light green
    context.fillStyle = "rgba(24, 124, 68, 0.1)"; // Very light green
    
    for (let row = visibleMinRow; row <= visibleMaxRow; row++) {
      for (let col = visibleMinCol; col <= visibleMaxCol; col++) {
        const pos = PrefixArrayManager.getCellPosition(row, col);
        const x = pos.x - scrollLeft;
        const y = pos.y - scrollTop;
        const width = Config.COL_WIDTHS[col] || Config.COL_WIDTH;
        const height = Config.ROW_HEIGHTS[row] || Config.ROW_HEIGHT;

        // Skip the starting cell (will be filled white later)
        if (row === selStartRow && col === selStartCol) {
          continue;
        }

        context.fillRect(x, y, width, height);
      }
    }

    // Fill the starting cell with white
    if (
      selStartRow >= startRow && selStartRow <= endRow &&
      selStartCol >= startCol && selStartCol <= endCol
    ) {
      const startPos = PrefixArrayManager.getCellPosition(selStartRow, selStartCol);
      const startX = startPos.x - scrollLeft;
      const startY = startPos.y - scrollTop;
      const startWidth = Config.COL_WIDTHS[selStartCol] || Config.COL_WIDTH;
      const startHeight = Config.ROW_HEIGHTS[selStartRow] || Config.ROW_HEIGHT;

      context.fillStyle = "white";
      context.fillRect(startX, startY, startWidth, startHeight);
    }

    // Draw the border around the entire range
    const rangeStartPos = PrefixArrayManager.getCellPosition(minRow, minCol);
    const rangeEndPos = PrefixArrayManager.getCellPosition(maxRow, maxCol);
    
    const rangeX = rangeStartPos.x - scrollLeft;
    const rangeY = rangeStartPos.y - scrollTop;
    const rangeWidth = rangeEndPos.x - rangeStartPos.x + (Config.COL_WIDTHS[maxCol] || Config.COL_WIDTH);
    const rangeHeight = rangeEndPos.y - rangeStartPos.y + (Config.ROW_HEIGHTS[maxRow] || Config.ROW_HEIGHT);

    context.strokeStyle = "#187c44"; // Dark green border
    context.lineWidth = 2;
    context.strokeRect(rangeX, rangeY, rangeWidth, rangeHeight);

    // Draw the green square at bottom left of the range
    const handleSize = 6;
    context.fillStyle = "#187c44";
    context.fillRect(
      rangeX + rangeWidth - handleSize +2,
      rangeY + rangeHeight - handleSize +2,
      handleSize+1,
      handleSize+1
    );
  }
}

  static insertRowHeaderText(
    startRow,
    endRow,
    startCol,
    endCol,
    context,
    scrollTop
  ) {
    const paddingX = 5;

    for (let row = startRow; row <= endRow; row++) {
      const text = (row + 1).toString();
      const pos = Utils.getPosition(row, 0);

      const height = Config.ROW_HEIGHTS[row] || Config.ROW_HEIGHT;
      const width = Config.COL_WIDTHS[0] || Config.COL_WIDTH;

      const textY = pos.y - scrollTop + height / 2 + Config.TEXT_PADDING_Y;

      const measuredWidth = context.measureText(text).width;
      const textX = pos.x - measuredWidth - paddingX;

      context.font = "18px sans-serif";
      context.fillStyle = "rgba(0, 0, 0, 0.7)";
      context.textAlign = "left";
      context.textBaseline = "middle";

      context.fillText(text, textX, textY);
    }
  }

  static insertColHeaderText(
    startRow,
    endRow,
    startCol,
    endCol,
    context,
    scrollLeft
  ) {
    for (let col = startCol; col <= endCol; col++) {
      const text = Utils.numberToColheader(col);

      const pos = Utils.getPosition(0, col);
      const width = Config.COL_WIDTHS[col] || Config.COL_WIDTH;

      const textX = pos.x - scrollLeft + width / 2;
      const textY = Config.COL_HEADER_HEIGHT / 2 + Config.TEXT_PADDING_Y;

      context.font = "18px sans-serif";
      context.fillStyle = "rgba(0, 0, 0, 0.8)";
      context.textAlign = "center";
      context.textBaseline = "middle";

      context.fillText(text, textX, textY);
    }
  }

  static drawRowsCols(startRow, startCol, endRow, endCol, canvas, context) {
    let additional = 0.5;

    // Draw horizontal grid lines (row separators)
    for (let i = startRow; i < endRow; i++) {
      const y = PrefixArrayManager.getRowYPosition(i + 1);
      context.moveTo(Config.ROW_HEADER_WIDTH, y + additional); // Usually ROW_HEADER_WIDTH
      context.lineTo(
        PrefixArrayManager.getColXPosition(endCol),
        y + additional
      );
    }

    // Draw vertical grid lines (column separators)
    for (let j = startCol; j < endCol; j++) {
      const x = PrefixArrayManager.getColXPosition(j + 1);
      context.moveTo(x + additional, Config.COL_HEADER_HEIGHT);
      context.lineTo(
        x + additional,
        PrefixArrayManager.getRowYPosition(endRow)
      );
    }

    context.strokeStyle = "rgb(0,0,0)";
    context.lineWidth = 0.1;
    context.stroke();
    context.restore();
  }

  static drawColumnHeader(
    startRow,
    startCol,
    endRow,
    endCol,
    canvas,
    context,
    scrollLeft,
    scrollTop
  ) {
    context.fillStyle = "#f0f0f0";
    context.fillRect(
      0,
      0,
      PrefixArrayManager.getColXPosition(endCol),
      Config.COL_HEADER_HEIGHT + 0.5
    );
  }

  static drawRowHeader(
    startRow,
    startCol,
    endRow,
    endCol,
    canvas,
    context,
    scrollLeft,
    scrollTop
  ) {
    context.fillStyle = "#f0f0f0";
    context.fillRect(
      0,
      0,
      Config.ROW_HEADER_WIDTH + 0.5,
      PrefixArrayManager.getRowYPosition(endRow)
    );
  }

  static drawCornerBox(context) {
    context.fillStyle = "white";
    context.fillRect(
      0,
      0,
      Config.ROW_HEADER_WIDTH + 0.5,
      Config.COL_HEADER_HEIGHT + 0.5
    );
  }

  static drawVerticalLinesColResizing(col, context, height) {
    if (Config.RESIZING_COL == -1) return;

    let currentResizingColPos = PrefixArrayManager.getColXPosition(col);

    context.save();
    context.strokeStyle = "#187c44";
    context.lineWidth = 2;

    // Draw line at previous column position
    context.beginPath();
    context.moveTo(currentResizingColPos, Config.COL_HEADER_HEIGHT);
    context.lineTo(currentResizingColPos, height);

    // context.stroke();

    // Draw line at current resizing column position
    // context.beginPath();
    if (col != 1) {
      let prevCol = PrefixArrayManager.getColXPosition(col - 1);
      context.moveTo(prevCol, Config.COL_HEADER_HEIGHT);
      context.lineTo(prevCol, height);
    }
    context.stroke();

    context.restore();
  }

  static drawVerticalDashedLine(x, context, height) {
    if (Config.RESIZING_COL == -1) return;

    context.save();
    context.strokeStyle = "#187c44"; // Green color
    context.lineWidth = 2;

    context.setLineDash([5, 3]); // Dash pattern: 5px line, 3px gap

    context.beginPath();
    context.moveTo(x, Config.COL_HEADER_HEIGHT);
    context.lineTo(x, height);
    context.stroke();

    context.restore();
  }

  static drawHorizontalDashedLine(y, context, width) {
    if (Config.RESIZING_ROW == -1) return;

    context.save();
    context.strokeStyle = "#187c44"; // Green color
    context.lineWidth = 2;

    context.setLineDash([5, 3]); // Dash pattern: 5px line, 3px gap

    context.beginPath();
    context.moveTo(Config.ROW_HEADER_WIDTH, y);
    context.lineTo(width, y);
    context.stroke();

    context.restore();
  }

  static rowHorizontalLinesRowResizing(row, context, width) {
    if (Config.RESIZING_ROW == -1) return;
    let currentResizingRowPos = PrefixArrayManager.getRowYPosition(row);

    context.save();
    context.strokeStyle = "#187c44";
    context.lineWidth = 2;

    // Draw line at previous column position
    context.beginPath();
    context.moveTo(Config.ROW_HEADER_WIDTH, currentResizingRowPos);
    context.lineTo(width, currentResizingRowPos);

    if (row != 1) {
      let prevRowPos = PrefixArrayManager.getRowYPosition(row - 1);
      context.moveTo(Config.ROW_HEADER_WIDTH, prevRowPos);
      context.lineTo(width, prevRowPos);
    }
    context.stroke();

    context.restore();
  }

  static drawResizeIndicator(context, colIndex, scrollLeft) {
    if (colIndex === -1) return;

    // Get the x position of the column edge (right edge of the column)
    let x =
      PrefixArrayManager.getColXPosition(colIndex) +
      (Config.COL_WIDTHS[colIndex] || Config.COL_WIDTH);
    x -= scrollLeft;

    // Make sure the indicator is visible
    if (x < Config.ROW_HEADER_WIDTH || x > context.canvas.width) return;

    const pillWidth = 6;
    const pillHeight = (Config.COL_HEADER_HEIGHT - 6) * 0.6; // Reduced height to 60% of original
    const radius = pillWidth / 2;

    const pillX = x - pillWidth / 2;
    const pillY = 3 + (Config.COL_HEADER_HEIGHT - 6 - pillHeight) / 2; // Center vertically

    context.save();
    context.fillStyle = "white"; // White fill
    context.strokeStyle = "green"; // Green border
    context.lineWidth = 1;

    // Draw pill
    context.beginPath();
    context.moveTo(pillX + radius, pillY);
    context.lineTo(pillX + pillWidth - radius, pillY);
    context.quadraticCurveTo(
      pillX + pillWidth,
      pillY,
      pillX + pillWidth,
      pillY + radius
    );
    context.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
    context.quadraticCurveTo(
      pillX + pillWidth,
      pillY + pillHeight,
      pillX + pillWidth - radius,
      pillY + pillHeight
    );
    context.lineTo(pillX + radius, pillY + pillHeight);
    context.quadraticCurveTo(
      pillX,
      pillY + pillHeight,
      pillX,
      pillY + pillHeight - radius
    );
    context.lineTo(pillX, pillY + radius);
    context.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
    context.closePath();

    context.fill(); // Fill with white
    context.stroke(); // Stroke with green border
    context.restore();
  }

  static drawRowResizeIndicator(context, rowIndex, scrollTop) {
    if (rowIndex === -1) return;

    // Get the y position of the row edge (bottom edge of the row)
    let y =
      PrefixArrayManager.getRowYPosition(rowIndex) +
      (Config.ROW_HEIGHTS[rowIndex] || Config.ROW_HEIGHT);
    y -= scrollTop;

    // Make sure the indicator is visible
    if (y < Config.COL_HEADER_HEIGHT || y > context.canvas.height) return;

    const pillWidth = Config.ROW_HEADER_WIDTH * 0.35; // Reduced from 0.6 to 0.35 (about 35% of row header width)
    const pillHeight = 4; // Small height
    const radius = pillHeight / 2;

    const pillX = (Config.ROW_HEADER_WIDTH - pillWidth) / 2; // Center horizontally in row header
    const pillY = y - pillHeight / 2; // Center on the row edge

    context.save();
    context.fillStyle = "white"; // White fill
    context.strokeStyle = "green"; // Green border
    context.lineWidth = 1;

    // Draw horizontal pill
    context.beginPath();
    context.moveTo(pillX + radius, pillY);
    context.lineTo(pillX + pillWidth - radius, pillY);
    context.quadraticCurveTo(
      pillX + pillWidth,
      pillY,
      pillX + pillWidth,
      pillY + radius
    );
    context.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
    context.quadraticCurveTo(
      pillX + pillWidth,
      pillY + pillHeight,
      pillX + pillWidth - radius,
      pillY + pillHeight
    );
    context.lineTo(pillX + radius, pillY + pillHeight);
    context.quadraticCurveTo(
      pillX,
      pillY + pillHeight,
      pillX,
      pillY + pillHeight - radius
    );
    context.lineTo(pillX, pillY + radius);
    context.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
    context.closePath();

    context.fill(); // Fill with white
    context.stroke(); // Stroke with green border
    context.restore();
  }
}
