import { Config } from "./Config.js";
import { Utils } from "./Utils.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { CellDataManager } from "./CellDataManager.js";

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
    if (Config.SELECTED_CELL_RANGE == null) return;
    const selStartRow = Config.SELECTED_CELL_RANGE.startRow;
    const selStartCol = Config.SELECTED_CELL_RANGE.startCol;
    const selEndRow = Config.SELECTED_CELL_RANGE.endRow;
    const selEndCol = Config.SELECTED_CELL_RANGE.endCol;

    // Also check for single cell selection for backwards compatibility
    const singleSelRow = Config.SELECTED_CELL.row;
    const singleSelCol = Config.SELECTED_CELL.col;

    // Determine if we have a range selection or single cell selection
    const hasRangeSelection =
      selStartRow !== -1 &&
      selStartCol !== -1 &&
      selEndRow !== -1 &&
      selEndCol !== -1;
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
    if (Config.SELECTED_CELL_RANGE == null) return;
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
        selStartRow >= startRow &&
        selStartRow <= endRow &&
        selStartCol >= startCol &&
        selStartCol <= endCol
      ) {
        const startPos = PrefixArrayManager.getCellPosition(
          selStartRow,
          selStartCol
        );
        const startX = startPos.x - scrollLeft;
        const startY = startPos.y - scrollTop;
        const startWidth = Config.COL_WIDTHS[selStartCol] || Config.COL_WIDTH;
        const startHeight =
          Config.ROW_HEIGHTS[selStartRow] || Config.ROW_HEIGHT;

        context.fillStyle = "white";
        context.fillRect(startX, startY, startWidth, startHeight);
      }

      // Draw the border around the entire range
      const rangeStartPos = PrefixArrayManager.getCellPosition(minRow, minCol);
      const rangeEndPos = PrefixArrayManager.getCellPosition(maxRow, maxCol);

      const rangeX = rangeStartPos.x - scrollLeft;
      const rangeY = rangeStartPos.y - scrollTop;
      const rangeWidth =
        rangeEndPos.x -
        rangeStartPos.x +
        (Config.COL_WIDTHS[maxCol] || Config.COL_WIDTH);
      const rangeHeight =
        rangeEndPos.y -
        rangeStartPos.y +
        (Config.ROW_HEIGHTS[maxRow] || Config.ROW_HEIGHT);

      context.strokeStyle = "#187c44"; // Dark green border
      context.lineWidth = 2;
      context.strokeRect(rangeX, rangeY, rangeWidth, rangeHeight);

      // Draw the green square at bottom left of the range
      const handleSize = 6;
      context.fillStyle = "#187c44";
      context.fillRect(
        rangeX + rangeWidth - handleSize + 2,
        rangeY + rangeHeight - handleSize + 2,
        handleSize + 1,
        handleSize + 1
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

  static drawHorizontalLinesRowResizing(row, context, width) {
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


static drawHighlighedColumnHeader(context, startCol, endCol, scrollLeft) {
  if (Config.SELECTED_COL_HEADER === -1) return;

  // If we're in header selection mode, draw the range
  if (Config.IS_SELECTING_HEADER && Config.HEADER_SELECTION_TYPE === 'column') {
    const minCol = Math.min(Config.HEADER_SELECTION_START_COL, Config.HEADER_SELECTION_END_COL);
    const maxCol = Math.max(Config.HEADER_SELECTION_START_COL, Config.HEADER_SELECTION_END_COL);
    
    // Draw all columns in the selection range
    for (let col = Math.max(minCol, startCol); col <= Math.min(maxCol, endCol); col++) {
      this.drawSingleColumnHeader(context, col, scrollLeft);
    }
  } else if (Config.SELECTED_COL_RANGE) {
    // Draw persistent selection range after mouse up
    const minCol = Config.SELECTED_COL_RANGE.startCol;
    const maxCol = Config.SELECTED_COL_RANGE.endCol;
    
    for (let col = Math.max(minCol, startCol); col <= Math.min(maxCol, endCol); col++) {
      this.drawSingleColumnHeader(context, col, scrollLeft);
    }
  } else {
    // Draw single column selection (original behavior)
    const selectedCol = Config.SELECTED_COL_HEADER - 1;
    if (selectedCol >= startCol && selectedCol <= endCol) {
      this.drawSingleColumnHeader(context, selectedCol, scrollLeft);
    }
  }
}

static drawSingleColumnHeader(context, col, scrollLeft) {
  let colWidth = Config.COL_WIDTHS[col] || Config.COL_WIDTH;
  
  // Recalculate adjusted X position based on current scroll
  let x1Pos = Utils.getXPosition(col);
  let adjustedX1 = x1Pos - scrollLeft;

  context.fillStyle = "#187c44"; // Dark green background
  context.fillRect(adjustedX1, 0, colWidth, Config.COL_HEADER_HEIGHT);

  // Draw column label with white text
  context.fillStyle = "white";
  context.font = "bold 18px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";

  const columnLabel = Utils.numberToColheader(col);
  context.fillText(
    columnLabel,
    adjustedX1 + colWidth / 2,
    Config.COL_HEADER_HEIGHT / 2 + 2
  );

  // Draw border around the header
  context.strokeStyle = "#187c44";
  context.lineWidth = 2;
  context.strokeRect(adjustedX1, 0, colWidth, Config.COL_HEADER_HEIGHT);
}

static drawHighlighedRowHeader(context, startRow, endRow, scrollTop) {
  if (Config.SELECTED_ROW_HEADER === -1) return;

  // If we're in header selection mode, draw the range
  if (Config.IS_SELECTING_HEADER && Config.HEADER_SELECTION_TYPE === 'row') {
    const minRow = Math.min(Config.HEADER_SELECTION_START_ROW, Config.HEADER_SELECTION_END_ROW);
    const maxRow = Math.max(Config.HEADER_SELECTION_START_ROW, Config.HEADER_SELECTION_END_ROW);
    
    // Draw all rows in the selection range
    for (let row = Math.max(minRow, startRow); row <= Math.min(maxRow, endRow); row++) {
      this.drawSingleRowHeader(context, row, scrollTop);
    }
  } else if (Config.SELECTED_ROW_RANGE) {
    // Draw persistent selection range after mouse up
    const minRow = Config.SELECTED_ROW_RANGE.startRow;
    const maxRow = Config.SELECTED_ROW_RANGE.endRow;
    
    for (let row = Math.max(minRow, startRow); row <= Math.min(maxRow, endRow); row++) {
      this.drawSingleRowHeader(context, row, scrollTop);
    }
  } else {
    // Draw single row selection (original behavior)
    const selectedRow = Config.SELECTED_ROW_HEADER - 1;
    if (selectedRow >= startRow && selectedRow <= endRow) {
      this.drawSingleRowHeader(context, selectedRow, scrollTop);
    }
  }
}

static drawSingleRowHeader(context, row, scrollTop) {
  let rowHeight = Config.ROW_HEIGHTS[row] || Config.ROW_HEIGHT;
  
  // Recalculate adjusted Y position based on current scroll
  let y1Pos = Utils.getYPosition(row);
  let adjustedY1 = y1Pos - scrollTop;

  context.fillStyle = "#187c44"; // Dark green background
  context.fillRect(0, adjustedY1, Config.ROW_HEADER_WIDTH, rowHeight);

  // Draw row label with white text - right aligned
  context.fillStyle = "white";
  context.font = "bold 18px Arial";
  context.textAlign = "left"; // Change to left for manual positioning
  context.textBaseline = "middle";

  const rowLabel = (row + 1).toString();
  const measuredWidth = context.measureText(rowLabel).width;
  const paddingX = 8; // Right padding from the edge
  const textX = Config.ROW_HEADER_WIDTH - measuredWidth - paddingX;

  context.fillText(rowLabel, textX, adjustedY1 + rowHeight / 2);

  // Draw border around the header
  context.strokeStyle = "#187c44";
  context.lineWidth = 2;
  context.strokeRect(0, adjustedY1, Config.ROW_HEADER_WIDTH, rowHeight);
}


static updateInputPosition(canvas,scrollLeft,scrollTop) {
  const input = document.querySelector('.cellInput');
  if (!input || input.style.display === 'none') return;

      const row = Config.SELECTED_CELL_RANGE.startRow;
      const col = Config.SELECTED_CELL_RANGE.startCol;
  
  if (row === -1 || col === -1) return;
  
  // Get current canvas position
  const canvasRect = canvas.getBoundingClientRect();
  
  // Calculate new position accounting for scroll
  const cellX =  PrefixArrayManager.getColXPosition(col) - scrollLeft;
  const cellY = PrefixArrayManager.getRowYPosition(row) -scrollTop+(Config.ROW_HEIGHTS[row]||Config.ROW_HEIGHT-Config.ROW_HEIGHT);


  const cellWidth = Config.COL_WIDTHS[col]||Config.COL_WIDTH;
  const cellHeight = Config.ROW_HEIGHT;


  input.style.left = cellX + 'px';
  input.style.top = cellY + 'px';
  input.style.width = cellWidth + 'px';
  input.style.height = cellHeight + 'px';

  
}

// static updateInputPosition(canvas,scrollLeft,scrollTop) {
//   const input = document.querySelector('.cellInput');
//   if (!input || input.style.display === 'none') return;
  
//       const row = Config.SELECTED_CELL_RANGE.startRow;
//       const col = Config.SELECTED_CELL_RANGE.startCol;
  
//   if (row === -1 || col === -1) return;
  
//   const canvasRect = canvas.getBoundingClientRect();
  
//   // Calculate new position accounting for scroll
//   const cellX = canvasRect.left + PrefixArrayManager.getColXPosition(col) - scrollLeft;
//   const cellY = canvasRect.top + PrefixArrayManager.getRowYPosition(row) - scrollTop;
  
//   // Check if cell is in header regions
//   const isInRowHeader = cellX < (canvasRect.left + Config.ROW_HEADER_WIDTH);
//   const isInColHeader = cellY < (canvasRect.top + Config.COL_HEADER_HEIGHT);
  
//   // Hide if in header regions, show if in main grid area
//   if (isInRowHeader || isInColHeader) {
//     input.style.display = 'none';
//   } else {
//     input.style.display = 'block';
//     input.style.left = cellX + 'px';
//     input.style.top = cellY + 'px';
//   }
// }

  // static renderVisibleCells(startRow, endRow, startCol, endCol) {

  //     let firstRow = startRow;
  //     let lastRow = endRow;


  //     while (firstRow <= lastRow) {
  //         const firstRowData = CellDataManager.CellData.get(firstRow);
  //         const lastRowData = CellDataManager.CellData.get(lastRow);



  //         // Skip if row data is missing
  //         if (!firstRowData || !lastRowData) {
  //           console.log(firstRowData,lastRow)
  //             firstRow++;
  //             lastRow--;

  //             continue;
  //         }
  //         console.log("came in cell func");
  //         for (let i = startCol; i <= endCol; i++) {
  //             const cell1 = firstRowData.get(i);
  //             const cell2 = lastRowData.get(i);

  //             const value1 = cell1?.value;
  //             const value2 = cell2?.value;
                        
  //             console.log(value1,value2);

  //             if (value1 !== undefined) {
  //                 console.log(`${firstRow}-${i} : ${value1}`);
  //             }
  //             // Prevent duplicate logging when firstRow === lastRow
  //             if (firstRow !== lastRow && value2 !== undefined) {
  //                 console.log(`${lastRow}-${i} : ${value2}`);
  //             }
  //         }

  //         firstRow++;
  //         lastRow--;
  //     }
  // }

// static renderCell(ctx, row, col, value, startRow, startCol, scrollLeft, scrollTop) {
//     const x =  PrefixArrayManager.getColXPosition(col) - scrollLeft;
//     const y = PrefixArrayManager.getRowYPosition(row) -scrollTop;
//     const colWidth=Config.COL_WIDTHS[col]||Config.COL_WIDTH;
//     const colHeight= Config.ROW_HEIGHTS[row]||Config.ROW_HEIGHT;

//     ctx.fillStyle = '#000';
//     ctx.textBaseline = 'middle';

//     const isNumber = typeof value === 'number' || (!isNaN(value) && !isNaN(parseFloat(value)));

//     if (isNumber) {
//         ctx.textAlign = 'right';
//         ctx.fillText(String(value), x +colWidth  - 5, y + colHeight-10);
//     } else {
//         ctx.textAlign = 'left';
//         ctx.fillText(String(value), x + 5, y + colHeight-10); 
//     }
// }

static renderCell(ctx, row, col, value, startRow, startCol, scrollLeft, scrollTop) {
    const x = PrefixArrayManager.getColXPosition(col) - scrollLeft;
    const y = PrefixArrayManager.getRowYPosition(row) - scrollTop;
    const colWidth = Config.COL_WIDTHS[col] || Config.COL_WIDTH;
    const colHeight = Config.ROW_HEIGHTS[row] || Config.ROW_HEIGHT;

    ctx.fillStyle = '#000';
    ctx.textBaseline = 'middle';

    const strValue = String(value);
    const isNumber = typeof value === 'number' || (!isNaN(value) && !isNaN(parseFloat(value)));

    // Trim the text based on available width (no ellipses)
    let visibleText = '';
    let currentText = '';
    for (let i = 0; i < strValue.length; i++) {
        currentText += strValue[i];
        const width = ctx.measureText(currentText).width;
        if (width <= colWidth - 10) { // 10px total padding
            visibleText = currentText;
        } else {
            break;
        }
    }

    if (isNumber) {
        ctx.textAlign = 'right';
        ctx.fillText(visibleText, x + colWidth - 5, y + colHeight - 10); // padding right
    } else {
        ctx.textAlign = 'left';
        ctx.fillText(visibleText, x + 5, y + colHeight - 10); // padding left
    }
}



 static renderVisibleCells(startRow, endRow, startCol, endCol, ctx,scrollLeft,scrollTop){
  // if(Config.RESIZING_COL!=-1)return;
    let firstRow = startRow;
    let lastRow = endRow;
    let delay=50;
    
    ctx.font = `${Config.DEFAULT_FONT_SIZE}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // const step = () => {
    //     if (firstRow > lastRow) return; // Done

    //     const firstRowData = CellDataManager.CellData.get(firstRow);
    //     const lastRowData = CellDataManager.CellData.get(lastRow);

    //     for (let i = startCol; i <= endCol; i++) {
    //         // Render firstRow
    //         if (firstRowData && firstRowData.has(i)) {
    //             const cell1 = firstRowData.get(i);
    //             const value1 = cell1?.value;
    //             if (value1 !== undefined) {
    //                 this.renderCell(ctx, firstRow, i, value1, startRow, startCol, scrollLeft, scrollTop);
    //             }
    //         }

    //         // Render lastRow (if different)
    //         if (firstRow !== lastRow && lastRowData && lastRowData.has(i)) {
    //             const cell2 = lastRowData.get(i);
    //             const value2 = cell2?.value;
    //             if (value2 !== undefined) {
    //                 this.renderCell(ctx, lastRow, i, value2, startRow, startCol, scrollLeft, scrollTop);
    //             }
    //         }
    //     }

    //     firstRow++;
    //     lastRow--;

    //     // Delay before rendering the next pair of rows
    //     setTimeout(step, delay);
    // };

    // step(); // Start the loop

    while (firstRow <= lastRow) {
        const firstRowData = CellDataManager.CellData.get(firstRow);
        const lastRowData = CellDataManager.CellData.get(lastRow);

        for (let i = startCol; i <= endCol; i++) {
            // Process firstRowData
            if (firstRowData && firstRowData.has(i)) {
                const cell1 = firstRowData.get(i);
                const value1 = cell1?.value;
                if (value1 !== undefined) {
                    this.renderCell(ctx, firstRow, i, value1, startRow, startCol,  scrollLeft, scrollTop);
                }
            }

            // Process lastRowData, only if it's a different row
            if (firstRow !== lastRow && lastRowData && lastRowData.has(i)) {
                const cell2 = lastRowData.get(i);
                const value2 = cell2?.value;
                if (value2 !== undefined) {
                    this.renderCell(ctx, lastRow, i, value2, startRow, startCol,  scrollLeft, scrollTop);
                }
            }
        }

        firstRow++;
        lastRow--;
    }
}


}
