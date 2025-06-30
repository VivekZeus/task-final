import { Config } from "./Config.js";
import { Utils } from "./Utils.js";
import { HeaderData } from "./HeaderData.js";

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

    if (
      selRow < startRow ||
      selRow > endRow ||
      selCol < startCol ||
      selCol > endCol ||
      selRow === -1 ||
      selCol === -1
    )
      return;

    const handleSize = 6;
    const handleOffset = 2;

    const highlightColor = "rgba(173, 235, 193, 0.6)"; // light green
    const borderColor = "#187c44";

    // === Column Header Highlight ===
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

    // === Row Header Highlight ===
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

    // const highlightColor = "rgba(173, 235, 193, 0.6)"; // light green
    // const borderColor = "#187c44";

    // // === Column Header Highlight ===
    // const colPos = Utils.getPosition(0, selCol);
    // const colX = colPos.x -scrollLeft;
    // const colWidth = Config.COL_WIDTHS[selCol];
    // const colHeight = Config.COL_HEADER_HEIGHT;

    // // Fill
    // context.fillStyle = highlightColor;
    // context.fillRect(colX, 0, colWidth, colHeight);

    // // Border bottom
    // context.strokeStyle = borderColor;
    // context.lineWidth = 2;
    // context.beginPath();
    // context.moveTo(colX, colHeight - 1);
    // context.lineTo(colX + colWidth, colHeight - 1);
    // context.stroke();

    // // === Row Header Highlight ===
    // const rowPos = Utils.getPosition(selRow, 0);
    // const rowY = rowPos.y - scrollTop;
    // const rowWidth = Config.ROW_HEADER_WIDTH;
    // const rowHeight = Config.ROW_HEIGHTS[selRow];

    // // Fill
    // context.fillStyle = highlightColor;
    // context.fillRect(0, rowY, rowWidth, rowHeight);

    // // Border right
    // context.strokeStyle = borderColor;
    // context.lineWidth = 2;
    // context.beginPath();
    // context.moveTo(rowWidth - 1, rowY);
    // context.lineTo(rowWidth - 1, rowY + rowHeight);
    // context.stroke();
    // context.restore();
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
      const text = HeaderData.headerSpreadSheetData.get(`${row}-0`);
      if (!text) continue;

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
      if (col === 0) continue;

      const key = `0-${col}`;
      const text = HeaderData.headerSpreadSheetData.get(key);

      const pos = Utils.getPosition(0, col - 1);
      const width = Config.COL_WIDTHS[col];

      const textX = pos.x - scrollLeft + width / 2;
      const textY = Config.COL_HEADER_HEIGHT / 2 + Config.TEXT_PADDING_Y;

      context.font = "18px sans-serif";
      context.fillStyle = "rgba(0, 0, 0, 0.8)";
      context.textAlign = "center";
      context.textBaseline = "middle";

      context.fillText(text, textX, textY);
    }

    // for (let i = startCol; i <= endCol; i++) {
    //   let text = HeaderData.headerSpreadSheetData.get(`0-${i}`);
    //   let pos = Utils.getPosition(0, 0, startCol, i);
    //   if (text == undefined) {
    //     console.log("Undefined value came");
    //     continue;
    //   }

    //   context.font = "18px sans-serif";
    //   context.fillStyle = "rgba(0, 0, 0, 0.7)";
    //   context.textAlign = "left";
    //   context.textBaseline = "middle";

    //   let textX;
    //   let textY;

    //   // if (row == 0) {
    //   textX = pos.x + Config.COL_WIDTHS[i] / 2;
    //   // } else if (col == 0) {
    //   //   const measured = context.measureText(text).width;
    //   //   textX = pos.x + Config.COL_WIDTHS[col] - measured - paddingX;
    //   // } else {
    //   //   textX = paddingX + pos.x;
    //   // }
    //   textY = Config.ROW_HEIGHTS[0] / 2 + pos.y + Config.TEXT_PADDING_Y;
    //   context.fillText(text, textX, textY);
    // }

    // for (const [rowCol, cellText] of data) {

    //   const [rowStr, colStr] = rowCol.split("-");
    //   let row = parseInt(rowStr, 10);
    //   let col = parseInt(colStr, 10);

    //   const pos = Utils.getPosition(row, col);
    //   context.font = "18px sans-serif";
    //   context.fillStyle = "rgba(0, 0, 0, 0.7)";
    //   context.textAlign = "left";
    //   context.textBaseline = "middle";

    //   const paddingX = 5;
    //   const paddingY = 5;

    //   let textX;
    //   let textY;

    //   if (row == 0) {
    //     textX = pos.x + Config.colWidths[col] / 2;
    //   } else if (col == 0) {
    //     const measured = this.context.measureText(cellText).width;
    //     textX = pos.x + Config.colWidths[col] - measured - paddingX;
    //   } else {
    //     textX = paddingX + pos.x;
    //   }
    //   textY = Config.rowHeights[row] / 2 + pos.y;
    //   this.context.fillText(cellText, textX, textY);
    // }
  }

  static drawRowsCols(startRow, startCol, endRow, endCol, canvas, context) {
    let additional = 0.5 + Config.COL_HEADER_HEIGHT;
    for (let i = startRow; i < endRow; i++) {
      let y = i * Config.ROW_HEIGHTS[i] + additional;
      context.moveTo(startCol * Config.COL_WIDTHS[i], y);
      context.lineTo(endCol * Config.COL_WIDTHS[i], y);
    }

    additional = 0.5 + Config.ROW_HEADER_WIDTH;
    for (let j = startCol; j < endCol; j++) {
      let x = j * Config.COL_WIDTHS[j] + additional;
      context.moveTo(x, startRow * Config.ROW_HEIGHTS[j]);
      context.lineTo(x, endRow * Config.ROW_HEIGHTS[j]);
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
      Config.getColumnWidthSum(startCol, endCol),
      Config.COL_HEADER_HEIGHT + 0.5
    );
    Draw.insertColHeaderText(
      startRow,
      endRow,
      startCol,
      endCol,
      context,
      scrollLeft
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
    Draw.insertRowHeaderText(
      startRow,
      endRow,
      startCol,
      endCol,
      context,
      scrollTop
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
