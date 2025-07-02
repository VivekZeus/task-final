import { Config } from "./Config.js";
import { Utils } from "./Utils.js";

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

    const highlightColor = "rgba(173, 235, 193, 0.6)";
    const borderColor = "#187c44";

    context.save();

    // === Column Header Highlight === (Even if row is out of view)
    if (selCol >= startCol && selCol <= endCol) {
      const colPos = Utils.getPosition(0, selCol);
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
      const rowPos = Utils.getPosition(selRow, 0);
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

    const pos = Utils.getPosition(selRow, selCol);
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
      // const text = HeaderData.headerSpreadSheetData.get(`${row}-0`);

      const pos = Utils.getPosition(row - 1, 0); // Top-left of (row, 0) cell
      const height = Config.ROW_HEIGHTS[row];
      const width = Config.COL_WIDTHS[0]; // Width of the row header column

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
    // let additional = 0.5;
    // for (let i = startRow; i < endRow; i++) {
    //   let y = Config.COL_HEADER_HEIGHT;
    //   for (let r = 1; r < i; r++) {
    //     y += Config.ROW_HEIGHTS[r];
    //   }

    //   context.moveTo(startCol * Config.COL_WIDTHS[i], y);
    //   context.lineTo(endCol * Config.COL_WIDTHS[i], y);
    // }

    // for (let j = startCol; j < endCol; j++) {
    //   let x = Config.ROW_HEADER_WIDTH;
    //   for (let k = 0; k < j; k++) {
    //     x += Config.COL_WIDTHS[k];
    //   }

    //   context.moveTo(x + additional, startRow * Config.ROW_HEIGHTS[0]);
    //   context.lineTo(x + additional, endRow * Config.ROW_HEIGHTS[0]);
    // }

    let additional = 0.5;

    // Draw horizontal grid lines (row separators)
    for (let i = startRow; i < endRow; i++) {
      let y = Config.COL_HEADER_HEIGHT;
      for (let r = 0; r < i; r++) {
        y += Config.ROW_HEIGHTS[r];
      }

      context.moveTo(Config.ROW_HEADER_WIDTH, y + additional);
      context.lineTo(Config.getColumnWidthSum(0, endCol), y + additional);
    }

    // Draw vertical grid lines (column separators)
    for (let j = startCol; j < endCol; j++) {
      let x = Config.ROW_HEADER_WIDTH;
      for (let k = 0; k < j; k++) {
        x += Config.COL_WIDTHS[k];
      }

      context.moveTo(x + additional, Config.COL_HEADER_HEIGHT);
      context.lineTo(x + additional, Config.getRowHeightSum(0, endRow));
    }

    context.strokeStyle = "rgb(0,0,0)";
    context.lineWidth = 0.1;
    context.stroke();
    context.restore();
    // let additional = 0.5;

    // for (let i = startRow; i < endRow; i++) {
    //   let y = Config.COL_HEADER_HEIGHT;
    //   for (let r = 0; r < i; r++) {
    //     y += Config.ROW_HEIGHTS[r];
    //   }

    //   // X positions for full row line
    //   let startX = Config.ROW_HEADER_WIDTH;
    //   for (let j = 0; j < startCol; j++) {
    //     startX += Config.COL_WIDTHS[j];
    //   }
    //   let endX = startX;
    //   for (let j = startCol; j < endCol; j++) {
    //     endX += Config.COL_WIDTHS[j];
    //   }

    //   context.moveTo(startX, y + additional);
    //   context.lineTo(endX, y + additional);
    // }

    // for (let j = startCol; j < endCol; j++) {
    //   let x = Config.ROW_HEADER_WIDTH;
    //   for (let k = 0; k < j; k++) {
    //     x += Config.COL_WIDTHS[k];
    //   }

    //   // Y positions for full column line
    //   let startY = Config.COL_HEADER_HEIGHT;
    //   for (let i = 0; i < startRow; i++) {
    //     startY += Config.ROW_HEIGHTS[i];
    //   }
    //   let endY = startY;
    //   for (let i = startRow; i < endRow; i++) {
    //     endY += Config.ROW_HEIGHTS[i];
    //   }

    //   context.moveTo(x + additional, startY);
    //   context.lineTo(x + additional, endY);
    // }
  }

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
      Config.getColumnWidthSum(startCol, endCol),
      Config.COL_HEADER_HEIGHT + 0.5
    );

    // context.save();
    // context.translate(-scrollLeft, -scrollTop);
    // context.beginPath();

    // let additional= 0.5+Config.ROW_HEADER_WIDTH;
    // for (let j = startCol; j < endCol; j++) {
    //   let x = j * Config.COL_WIDTHS[j] +additional;
    //   context.moveTo(x, startRow * Config.ROW_HEIGHTS[j]);
    //   context.lineTo(x, endRow * Config.ROW_HEIGHTS[j]);
    //   break;
    // }

    // context.strokeStyle = "rgb(0,0,0)";
    // context.lineWidth = 0.1;
    // context.stroke();
    // context.restore();
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
      Config.getRowHeightSum(startRow, endRow)
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
}
