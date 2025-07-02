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
    const selRow = Config.SELECTED_CELL.row;
    const selCol = Config.SELECTED_CELL.col;

    if (selRow === -1 || selCol === -1) return;
    if (Config.RESIZING_COL !== -1) return;

    const highlightColor = "rgba(173, 235, 193, 0.6)";
    const borderColor = "#187c44";

    context.save();

    // === Column Header Highlight === (Even if row is out of view)
    if (selCol >= startCol && selCol <= endCol) {
      const colPos = PrefixArrayManager.getCellPosition(0, selCol);
      const colX = colPos.x - scrollLeft;
      const colWidth = Config.COL_WIDTHS[selCol];
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
      const rowHeight = Config.ROW_HEIGHTS[selRow];

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
    const selRow = Config.SELECTED_CELL.row;
    const selCol = Config.SELECTED_CELL.col;

    if (
      selRow < startRow ||
      selRow > endRow ||
      selCol < startCol ||
      selCol > endCol ||
      selRow === -1 ||
      selCol === -1
    )
      return;

    if (Config.RESIZING_COL !== -1) return;

    const pos = PrefixArrayManager.getCellPosition(selRow, selCol);

    const x = pos.x - scrollLeft;
    const y = pos.y - scrollTop;
    const width = Config.COL_WIDTHS[selCol];
    const height = Config.ROW_HEIGHTS[selRow];

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

    for (let row = Math.max(startRow, 1); row <= endRow; row++) {
      const text = row.toString();
      const pos = Utils.getPosition(row - 1, 0);

      const height = Config.ROW_HEIGHTS[row];
      const width = Config.COL_WIDTHS[0];

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
      const width = Config.COL_WIDTHS[col];

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

  // static drawRowsCols(startRow, startCol, endRow, endCol, canvas, context) {

  //   let additional = 0.5;

  //   // Draw horizontal grid lines (row separators)
  //   for (let i = startRow; i < endRow; i++) {
  //     let y = Config.COL_HEADER_HEIGHT;
  //     for (let r = 0; r < i; r++) {
  //       y += Config.ROW_HEIGHTS[r];
  //     }

  //     context.moveTo(Config.ROW_HEADER_WIDTH, y + additional);
  //     context.lineTo(Config.getColumnWidthSum(0, endCol), y + additional);
  //   }

  //   // Draw vertical grid lines (column separators)
  //   for (let j = startCol; j < endCol; j++) {
  //     let x = Config.ROW_HEADER_WIDTH;
  //     for (let k = 0; k < j; k++) {
  //       x += Config.COL_WIDTHS[k];
  //     }

  //     context.moveTo(x + additional, Config.COL_HEADER_HEIGHT);
  //     context.lineTo(x + additional, Config.getRowHeightSum(0, endRow));
  //   }

  //   context.strokeStyle = "rgb(0,0,0)";
  //   context.lineWidth = 0.1;
  //   context.stroke();
  //   context.restore();
  //   // let additional = 0.5;

  //   // for (let i = startRow; i < endRow; i++) {
  //   //   let y = Config.COL_HEADER_HEIGHT;
  //   //   for (let r = 0; r < i; r++) {
  //   //     y += Config.ROW_HEIGHTS[r];
  //   //   }

  //   //   // X positions for full row line
  //   //   let startX = Config.ROW_HEADER_WIDTH;
  //   //   for (let j = 0; j < startCol; j++) {
  //   //     startX += Config.COL_WIDTHS[j];
  //   //   }
  //   //   let endX = startX;
  //   //   for (let j = startCol; j < endCol; j++) {
  //   //     endX += Config.COL_WIDTHS[j];
  //   //   }

  //   //   context.moveTo(startX, y + additional);
  //   //   context.lineTo(endX, y + additional);
  //   // }

  //   // for (let j = startCol; j < endCol; j++) {
  //   //   let x = Config.ROW_HEADER_WIDTH;
  //   //   for (let k = 0; k < j; k++) {
  //   //     x += Config.COL_WIDTHS[k];
  //   //   }

  //   //   // Y positions for full column line
  //   //   let startY = Config.COL_HEADER_HEIGHT;
  //   //   for (let i = 0; i < startRow; i++) {
  //   //     startY += Config.ROW_HEIGHTS[i];
  //   //   }
  //   //   let endY = startY;
  //   //   for (let i = startRow; i < endRow; i++) {
  //   //     endY += Config.ROW_HEIGHTS[i];
  //   //   }

  //   //   context.moveTo(x + additional, startY);
  //   //   context.lineTo(x + additional, endY);
  //   // }
  // }

  //   static drawRowsCols(startRow, startCol, endRow, endCol, canvas, context) {
  //     context.beginPath();

  //     // Pre-calculate cumulative positions for better performance
  //     const getCumulativeHeight = (row) => {
  //         let height = Config.COL_HEADER_HEIGHT;
  //         for (let r = 0; r < row; r++) {
  //             height += Config.ROW_HEIGHTS[r];
  //         }
  //         return height;
  //     };

  //     const getCumulativeWidth = (col) => {
  //         let width = Config.ROW_HEADER_WIDTH;
  //         for (let k = 0; k < col; k++) {
  //             width += Config.COL_WIDTHS[k];
  //         }
  //         return width;
  //     };

  //     // Draw horizontal lines (row separators)
  //     const startX = getCumulativeWidth(startCol);
  //     const endX = getCumulativeWidth(endCol);

  //     for (let i = startRow; i <= endRow; i++) {
  //         const y = getCumulativeHeight(i);
  //         context.moveTo(startX, y + 0.5);
  //         context.lineTo(endX, y + 0.5);
  //     }

  //     // Draw vertical lines (column separators)
  //     const startY = getCumulativeHeight(startRow);
  //     const endY = getCumulativeHeight(endRow);

  //     for (let j = startCol; j <= endCol; j++) {
  //         const x = getCumulativeWidth(j);
  //         context.moveTo(x + 0.5, startY);
  //         context.lineTo(x + 0.5, endY);
  //     }

  //     context.strokeStyle = "rgb(0,0,0)";
  //     context.lineWidth = 0.1;
  //     context.stroke();
  // }

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

    // console.log(currentResizingColPos, prevCol);
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

  static drawResizeIndicator(context,i, scrollLeft) {
    if (Config.HOVERED_COL === -1) return;
    console.log("came here");
    let x = PrefixArrayManager.getColXPosition(i);

    x -= scrollLeft;
    console.log(x);

    const pillWidth = 6;
    const pillHeight = Config.COL_HEADER_HEIGHT - 6;
    const radius = pillWidth / 2;

    const pillX = x - pillWidth / 2;
    const pillY = 3;

    context.save();
    context.fillStyle = "green";
    context.strokeStyle = "green";
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

    context.fill();
    context.stroke();
    context.restore();
  }
}
