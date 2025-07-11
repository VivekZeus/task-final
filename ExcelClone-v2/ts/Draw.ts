// import { Grid } from "./Grid.js";
// import { Utils } from "./Utils.js";

// export class Draw {
//   grid: Grid;

//   constructor(gridObj: Grid) {
//     this.grid = gridObj;
//   }


//   drawSelectedCellCorrepondingRowCol(
//     startRow: number,
//     endRow: number,
//     startCol: number,
//     endCol: number,
//     scrollLeft: number,
//     scrollTop: number
//   ) {
//     const sel = this.grid.SELECTED_CELL_RANGE;
//     if (!sel || this.grid.RESIZING_COL !== -1) return;

//     const { startRow: sRow, endRow: eRow, startCol: sCol, endCol: eCol } = sel;
//     const hasRange = sRow !== -1 && sCol !== -1 && eRow !== -1 && eCol !== -1;
//     const hasSingle = sRow !== -1 && eRow !== -1;

//     if (!hasRange && !hasSingle) return;

//     const ctx = this.grid.context;
//     const getColWidth = (col: number) =>
//       this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
//     const getRowHeight = (row: number) =>
//       this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;
//     const getCellPos = this.grid.prefixArrayManager.getCellPosition.bind(
//       this.grid.prefixArrayManager
//     );

//     const fillHeader = (
//       x: number,
//       y: number,
//       w: number,
//       h: number,
//       borderDir: "bottom" | "right"
//     ) => {
//       ctx.fillStyle = "rgba(173, 235, 193, 0.6)";
//       ctx.fillRect(x, y, w, h);
//       ctx.strokeStyle = "#187c44";
//       ctx.lineWidth = 2;
//       ctx.beginPath();
//       if (borderDir === "bottom") {
//         ctx.moveTo(x, y + h - 1);
//         ctx.lineTo(x + w, y + h - 1);
//       } else {
//         ctx.moveTo(x + w - 1, y);
//         ctx.lineTo(x + w - 1, y + h);
//       }
//       ctx.stroke();
//     };

//     ctx.save();

//     if (hasRange) {
//       const minRow = Math.min(sRow, eRow);
//       const maxRow = Math.max(sRow, eRow);
//       const minCol = Math.min(sCol, eCol);
//       const maxCol = Math.max(sCol, eCol);

//       for (let col = minCol; col <= maxCol; col++) {
//         if (col < startCol || col > endCol) continue;
//         const { x } = getCellPos(0, col);
//         fillHeader(
//           x - scrollLeft,
//           0,
//           getColWidth(col),
//           this.grid.COL_HEADER_HEIGHT,
//           "bottom"
//         );
//       }

//       for (let row = minRow; row <= maxRow; row++) {
//         if (row < startRow || row > endRow) continue;
//         const { y } = getCellPos(row, 0);
//         fillHeader(
//           0,
//           y - scrollTop,
//           this.grid.ROW_HEADER_WIDTH,
//           getRowHeight(row),
//           "right"
//         );
//       }
//     } else {
//       const col = eCol;
//       const row = sRow;

//       if (col >= startCol && col <= endCol) {
//         const { x } = getCellPos(0, col);
//         fillHeader(
//           x - scrollLeft,
//           0,
//           getColWidth(col),
//           this.grid.COL_HEADER_HEIGHT,
//           "bottom"
//         );
//       }

//       if (row >= startRow && row <= endRow) {
//         const { y } = getCellPos(row, 0);
//         fillHeader(
//           0,
//           y - scrollTop,
//           this.grid.ROW_HEADER_WIDTH,
//           getRowHeight(row),
//           "right"
//         );
//       }
//     }

//     ctx.restore();
//   }


//   drawSelectedCellBorder(
//     startRow: number,
//     endRow: number,
//     startCol: number,
//     endCol: number,
//     scrollLeft: number,
//     scrollTop: number
//   ) {
//     const sel = this.grid.SELECTED_CELL_RANGE;
//     if (!sel || this.grid.RESIZING_COL !== -1 || this.grid.RESIZING_ROW !== -1)
//       return;

//     const { startRow: sRow, endRow: eRow, startCol: sCol, endCol: eCol } = sel;

//     const minRow = Math.min(sRow, eRow);
//     const maxRow = Math.max(sRow, eRow);
//     const minCol = Math.min(sCol, eCol);
//     const maxCol = Math.max(sCol, eCol);

//     if (minRow === -1 || minCol === -1) return;

//     this.grid.SELECTED_CELL_RANGE_STAT = {
//       startRow: minRow,
//       endRow: maxRow,
//       startCol: minCol,
//       endCol: maxCol,
//     };

//     const ctx = this.grid.context;
//     const getWidth = (col: number) =>
//       this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
//     const getHeight = (row: number) =>
//       this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;
//     const getPos = this.grid.prefixArrayManager.getCellPosition.bind(
//       this.grid.prefixArrayManager
//     );

//     ctx.save();

//     // === SINGLE CELL SELECTION ===
//     if (sRow === eRow && sCol === eCol) {
//       const { x, y } = getPos(sRow, sCol);
//       const width = getWidth(sCol);
//       const height = getHeight(sRow);

//       const drawX = x - scrollLeft;
//       const drawY = y - scrollTop;

//       ctx.strokeStyle = "#187c44";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(drawX, drawY, width, height);

//       // Draw resize handle
//       const handleSize = 6;
//       ctx.fillStyle = "#187c44";
//       ctx.fillRect(
//         drawX + width - handleSize + 3,
//         drawY + height - handleSize + 3,
//         handleSize,
//         handleSize
//       );

//       ctx.restore();
//       return;
//     }

//     // Fill background (excluding starting cell)
//     const totalCols = maxCol - minCol + 1;
//     const totalRows = maxRow - minRow + 1;
//     const totalCells = totalCols * totalRows;

//     ctx.fillStyle = "rgba(24, 124, 68, 0.1)";
//     for (let i = 0; i < totalCells; i++) {
//       const row = minRow + Math.floor(i / totalCols);
//       const col = minCol + (i % totalCols);

//       if (row === sRow && col === sCol) continue;

//       const { x, y } = this.grid.prefixArrayManager.getCellPosition(row, col);
//       ctx.fillRect(
//         x - scrollLeft,
//         y - scrollTop,
//         getWidth(col),
//         getHeight(row)
//       );
//     }

//     // Fill the starting cell white
//     const startPos = getPos(sRow, sCol);
//     const startX = startPos.x - scrollLeft;
//     const startY = startPos.y - scrollTop;
//     const startWidth = getWidth(sCol);
//     const startHeight = getHeight(sRow);

//     ctx.fillStyle = "white";
//     ctx.fillRect(startX, startY, startWidth, startHeight);

//     // Draw outer green border
//     const topLeft = getPos(minRow, minCol);
//     const bottomRight = getPos(maxRow, maxCol);
//     const borderX = topLeft.x - scrollLeft;
//     const borderY = topLeft.y - scrollTop;
//     const borderW = bottomRight.x - topLeft.x + getWidth(maxCol);
//     const borderH = bottomRight.y - topLeft.y + getHeight(maxRow);

//     ctx.strokeStyle = "#187c44";
//     ctx.lineWidth = 2;
//     ctx.strokeRect(borderX, borderY, borderW, borderH);

//     // Draw resize handle
//     const handleSize = 6;
//     ctx.fillStyle = "#187c44";
//     ctx.fillRect(
//       borderX + borderW - handleSize + 2,
//       borderY + borderH - handleSize + 2,
//       handleSize + 1,
//       handleSize + 1
//     );

//     ctx.restore();
//   }

//   insertRowHeaderText(startRow: number, endRow: number, scrollTop: number) {
//     const paddingX = 5;

//     for (let row = startRow; row <= endRow; row++) {
//       const text = (row + 1).toString();
//       const pos = this.grid.prefixArrayManager.getCellPosition(row, 0);

//       const height =
//         this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;

//       const textY = pos.y - scrollTop + height / 2 + this.grid.TEXT_PADDING_Y;

//       const measuredWidth = this.grid.context.measureText(text).width;
//       let textX = pos.x - measuredWidth - paddingX;
//       textX = row == startRow ? textX - 3 : textX;

//       this.grid.context.font = "18px sans-serif";
//       this.grid.context.fillStyle = "rgba(0, 0, 0, 0.7)";
//       this.grid.context.textAlign = "left";
//       this.grid.context.textBaseline = "middle";

//       this.grid.context.fillText(text, textX, textY);
//     }
//   }

//   insertColHeaderText(startCol: number, endCol: number, scrollLeft: number) {
//     for (let col = startCol; col <= endCol; col++) {
//       const text = Utils.numberToColheader(col);

//       const pos = this.grid.getPosition(0, col);
//       const width =
//         this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;

//       const textX = pos.x - scrollLeft + width / 2;
//       const textY = this.grid.COL_HEADER_HEIGHT / 2 + this.grid.TEXT_PADDING_Y;

//       this.grid.context.font = "18px sans-serif";
//       this.grid.context.fillStyle = "rgba(0, 0, 0, 0.8)";
//       this.grid.context.textAlign = "center";
//       this.grid.context.textBaseline = "middle";

//       this.grid.context.fillText(text, textX, textY);
//     }
//   }

//   drawRowsCols(
//     startRow: number,
//     startCol: number,
//     endRow: number,
//     endCol: number
//   ) {
//     let additional = 0.5;

//     // Draw horizontal grid lines (row separators)
//     for (let i = startRow; i < endRow; i++) {
//       const y = this.grid.prefixArrayManager.getRowYPosition(i + 1);
//       this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, y + additional); // Usually ROW_HEADER_WIDTH
//       this.grid.context.lineTo(
//         this.grid.prefixArrayManager.getColXPosition(endCol),
//         y + additional
//       );
//     }

//     // Draw vertical grid lines (column separators)
//     for (let j = startCol; j < endCol; j++) {
//       const x = this.grid.prefixArrayManager.getColXPosition(j + 1);
//       this.grid.context.moveTo(x + additional, this.grid.COL_HEADER_HEIGHT);
//       this.grid.context.lineTo(
//         x + additional,
//         this.grid.prefixArrayManager.getRowYPosition(endRow)
//       );
//     }

//     this.grid.context.strokeStyle = "rgb(0,0,0)";
//     this.grid.context.lineWidth = 0.1;
//     this.grid.context.stroke();
//     this.grid.context.restore();
//   }

//   drawColumnHeader(endCol: number) {
//     this.grid.context.fillStyle = "#f0f0f0";
//     this.grid.context.fillRect(
//       0,
//       0,
//       this.grid.prefixArrayManager.getColXPosition(endCol),
//       this.grid.COL_HEADER_HEIGHT + 0.5
//     );
//   }

//   drawRowHeader(endRow: number) {
//     this.grid.context.fillStyle = "#f0f0f0";
//     this.grid.context.fillRect(
//       0,
//       0,
//       this.grid.ROW_HEADER_WIDTH + 0.5,
//       this.grid.prefixArrayManager.getRowYPosition(endRow)
//     );
//   }

//   drawCornerBox() {
//     this.grid.context.fillStyle = "white";
//     this.grid.context.fillRect(
//       0,
//       0,
//       this.grid.ROW_HEADER_WIDTH + 0.5,
//       this.grid.COL_HEADER_HEIGHT + 0.5
//     );
//   }

//   drawVerticalLinesColResizing(col: number, height: number) {
//     if (this.grid.RESIZING_COL == -1) return;

//     let currentResizingColPos =
//       this.grid.prefixArrayManager.getColXPosition(col);

//     this.grid.context.save();
//     this.grid.context.strokeStyle = "#187c44";
//     this.grid.context.lineWidth = 2;

//     // Draw line at previous column position
//     this.grid.context.beginPath();
//     this.grid.context.moveTo(
//       currentResizingColPos,
//       this.grid.COL_HEADER_HEIGHT
//     );
//     this.grid.context.lineTo(currentResizingColPos, height);
//     if (col != 1) {
//       let prevCol = this.grid.prefixArrayManager.getColXPosition(col - 1);
//       this.grid.context.moveTo(prevCol, this.grid.COL_HEADER_HEIGHT);
//       this.grid.context.lineTo(prevCol, height);
//     }
//     this.grid.context.stroke();

//     this.grid.context.restore();
//   }

//   drawVerticalDashedLine(x: number, height: number) {
//     if (this.grid.RESIZING_COL == -1) return;

//     this.grid.context.save();
//     this.grid.context.strokeStyle = "#187c44"; // Green color
//     this.grid.context.lineWidth = 2;

//     this.grid.context.setLineDash([5, 3]); // Dash pattern: 5px line, 3px gap

//     this.grid.context.beginPath();
//     this.grid.context.moveTo(x, this.grid.COL_HEADER_HEIGHT);
//     this.grid.context.lineTo(x, height);
//     this.grid.context.stroke();

//     this.grid.context.restore();
//   }

//   drawHorizontalDashedLine(y: number, width: number) {
//     if (this.grid.RESIZING_ROW == -1) return;

//     this.grid.context.save();
//     this.grid.context.strokeStyle = "#187c44"; // Green color
//     this.grid.context.lineWidth = 2;

//     this.grid.context.setLineDash([5, 3]); // Dash pattern: 5px line, 3px gap

//     this.grid.context.beginPath();
//     this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, y - 100);
//     this.grid.context.lineTo(width, y - 100);
//     this.grid.context.stroke();

//     this.grid.context.restore();
//   }

//   drawHorizontalLinesRowResizing(row: number, width: number) {
//     if (this.grid.RESIZING_ROW == -1) return;
//     let currentResizingRowPos =
//       this.grid.prefixArrayManager.getRowYPosition(row);

//     this.grid.context.save();
//     this.grid.context.strokeStyle = "#187c44";
//     this.grid.context.lineWidth = 2;

//     // Draw line at previous column position
//     this.grid.context.beginPath();
//     this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, currentResizingRowPos);
//     this.grid.context.lineTo(width, currentResizingRowPos);

//     if (row != 1) {
//       let prevRowPos = this.grid.prefixArrayManager.getRowYPosition(row - 1);
//       this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, prevRowPos);
//       this.grid.context.lineTo(width, prevRowPos);
//     }
//     this.grid.context.stroke();

//     this.grid.context.restore();
//   }

//   drawResizeIndicator(colIndex: number, scrollLeft: number) {
//     if (colIndex === -1) return;

//     // Get the x position of the column edge (right edge of the column)
//     let x =
//       this.grid.prefixArrayManager.getColXPosition(colIndex) +
//       (this.grid.COL_WIDTHS.get(colIndex) ?? this.grid.DEFAULT_COL_WIDTH);
//     x -= scrollLeft;

//     // Make sure the indicator is visible
//     if (x < this.grid.ROW_HEADER_WIDTH || x > this.grid.context.canvas.width)
//       return;

//     const pillWidth = 6;
//     const pillHeight = (this.grid.COL_HEADER_HEIGHT - 6) * 0.6; // Reduced height to 60% of original
//     const radius = pillWidth / 2;

//     const pillX = x - pillWidth / 2;
//     const pillY = 3 + (this.grid.COL_HEADER_HEIGHT - 6 - pillHeight) / 2; // Center vertically

//     this.grid.context.save();
//     this.grid.context.fillStyle = "white"; // White fill
//     this.grid.context.strokeStyle = "green"; // Green border
//     this.grid.context.lineWidth = 1;

//     // Draw pill
//     this.grid.context.beginPath();
//     this.grid.context.moveTo(pillX + radius, pillY);
//     this.grid.context.lineTo(pillX + pillWidth - radius, pillY);
//     this.grid.context.quadraticCurveTo(
//       pillX + pillWidth,
//       pillY,
//       pillX + pillWidth,
//       pillY + radius
//     );
//     this.grid.context.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
//     this.grid.context.quadraticCurveTo(
//       pillX + pillWidth,
//       pillY + pillHeight,
//       pillX + pillWidth - radius,
//       pillY + pillHeight
//     );
//     this.grid.context.lineTo(pillX + radius, pillY + pillHeight);
//     this.grid.context.quadraticCurveTo(
//       pillX,
//       pillY + pillHeight,
//       pillX,
//       pillY + pillHeight - radius
//     );
//     this.grid.context.lineTo(pillX, pillY + radius);
//     this.grid.context.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
//     this.grid.context.closePath();

//     this.grid.context.fill(); // Fill with white
//     this.grid.context.stroke(); // Stroke with green border
//     this.grid.context.restore();
//   }

//   drawRowResizeIndicator(rowIndex: number, scrollTop: number) {
//     if (rowIndex === -1) return;

//     // Get the y position of the row edge (bottom edge of the row)
//     let y =
//       this.grid.prefixArrayManager.getRowYPosition(rowIndex) +
//       (this.grid.ROW_HEIGHTS.get(rowIndex) ?? this.grid.DEFAULT_ROW_HEIGHT);
//     y -= scrollTop;

//     // Make sure the indicator is visible
//     if (y < this.grid.COL_HEADER_HEIGHT || y > this.grid.context.canvas.height)
//       return;

//     const pillWidth = this.grid.ROW_HEADER_WIDTH * 0.35; // Reduced from 0.6 to 0.35 (about 35% of row header width)
//     const pillHeight = 4; // Small height
//     const radius = pillHeight / 2;

//     const pillX = (this.grid.ROW_HEADER_WIDTH - pillWidth) / 2; // Center horizontally in row header
//     const pillY = y - pillHeight / 2; // Center on the row edge

//     this.grid.context.save();
//     this.grid.context.fillStyle = "white"; // White fill
//     this.grid.context.strokeStyle = "green"; // Green border
//     this.grid.context.lineWidth = 1;

//     // Draw horizontal pill
//     this.grid.context.beginPath();
//     this.grid.context.moveTo(pillX + radius, pillY);
//     this.grid.context.lineTo(pillX + pillWidth - radius, pillY);
//     this.grid.context.quadraticCurveTo(
//       pillX + pillWidth,
//       pillY,
//       pillX + pillWidth,
//       pillY + radius
//     );
//     this.grid.context.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
//     this.grid.context.quadraticCurveTo(
//       pillX + pillWidth,
//       pillY + pillHeight,
//       pillX + pillWidth - radius,
//       pillY + pillHeight
//     );
//     this.grid.context.lineTo(pillX + radius, pillY + pillHeight);
//     this.grid.context.quadraticCurveTo(
//       pillX,
//       pillY + pillHeight,
//       pillX,
//       pillY + pillHeight - radius
//     );
//     this.grid.context.lineTo(pillX, pillY + radius);
//     this.grid.context.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
//     this.grid.context.closePath();

//     this.grid.context.fill(); // Fill with white
//     this.grid.context.stroke(); // Stroke with green border
//     this.grid.context.restore();
//   }

//   // drawHighlighedColumnHeader(
//   //   startCol: number,
//   //   endCol: number,
//   //   scrollLeft: number
//   // ) {
//   //   if (this.grid.SELECTED_COL_HEADER === -1) return;

//   //   // If we're in header selection mode, draw the range
//   //   if (
//   //     this.grid.IS_SELECTING_HEADER &&
//   //     this.grid.HEADER_SELECTION_TYPE === "column"
//   //   ) {
//   //     const minCol = Math.min(
//   //       this.grid.HEADER_SELECTION_START_COL,
//   //       this.grid.HEADER_SELECTION_END_COL
//   //     );
//   //     const maxCol = Math.max(
//   //       this.grid.HEADER_SELECTION_START_COL,
//   //       this.grid.HEADER_SELECTION_END_COL
//   //     );

//   //     // Draw all columns in the selection range
//   //     for (
//   //       let col = Math.max(minCol, startCol);
//   //       col <= Math.min(maxCol, endCol);
//   //       col++
//   //     ) {
//   //       this.drawSingleColumnHeader(col, scrollLeft);
//   //     }
//   //   } else if (this.grid.SELECTED_COL_RANGE) {
//   //     // Draw persistent selection range after mouse up
//   //     const minCol = this.grid.SELECTED_COL_RANGE.startCol;
//   //     const maxCol = this.grid.SELECTED_COL_RANGE.endCol;

//   //     for (
//   //       let col = Math.max(minCol, startCol);
//   //       col <= Math.min(maxCol, endCol);
//   //       col++
//   //     ) {
//   //       this.drawSingleColumnHeader(col, scrollLeft);
//   //     }
//   //   } else {
//   //     // Draw single column selection (original behavior)
//   //     const selectedCol = this.grid.SELECTED_COL_HEADER - 1;
//   //     if (selectedCol >= startCol && selectedCol <= endCol) {
//   //       this.drawSingleColumnHeader(selectedCol, scrollLeft);
//   //     }
//   //   }
//   // }

//   // drawSingleColumnHeader(col: number, scrollLeft: number) {
//   //   let colWidth = this.grid.COL_WIDTHS.get(col) || this.grid.DEFAULT_COL_WIDTH;

//   //   // Recalculate adjusted X position based on current scroll
//   //   let x1Pos = this.grid.getXPosition(col);
//   //   let adjustedX1 = x1Pos - scrollLeft;

//   //   this.grid.context.fillStyle = "#187c44"; // Dark green background
//   //   this.grid.context.fillRect(
//   //     adjustedX1,
//   //     0,
//   //     colWidth,
//   //     this.grid.COL_HEADER_HEIGHT
//   //   );

//   //   // Draw column label with white text
//   //   this.grid.context.fillStyle = "white";
//   //   this.grid.context.font = "bold 18px Arial";
//   //   this.grid.context.textAlign = "center";
//   //   this.grid.context.textBaseline = "middle";

//   //   const columnLabel = Utils.numberToColheader(col);
//   //   this.grid.context.fillText(
//   //     columnLabel,
//   //     adjustedX1 + colWidth / 2,
//   //     this.grid.COL_HEADER_HEIGHT / 2 + 2
//   //   );

//   //   // Draw border around the header
//   //   this.grid.context.strokeStyle = "#187c44";
//   //   this.grid.context.lineWidth = 2;
//   //   this.grid.context.strokeRect(
//   //     adjustedX1,
//   //     0,
//   //     colWidth,
//   //     this.grid.COL_HEADER_HEIGHT
//   //   );
//   // }

//   // drawHighlighedRowHeader(startRow: number, endRow: number, scrollTop: number) {
//   //   if (this.grid.SELECTED_ROW_HEADER === -1) return;

//   //   if (
//   //     this.grid.IS_SELECTING_HEADER &&
//   //     this.grid.HEADER_SELECTION_TYPE === "row"
//   //   ) {
//   //     const minRow = Math.min(
//   //       this.grid.HEADER_SELECTION_START_ROW,
//   //       this.grid.HEADER_SELECTION_END_ROW
//   //     );
//   //     const maxRow = Math.max(
//   //       this.grid.HEADER_SELECTION_START_ROW,
//   //       this.grid.HEADER_SELECTION_END_ROW
//   //     );

//   //     for (
//   //       let row = Math.max(minRow, startRow);
//   //       row <= Math.min(maxRow, endRow);
//   //       row++
//   //     ) {
//   //       this.drawSingleRowHeader(row, scrollTop);
//   //     }
//   //   } else if (this.grid.SELECTED_ROW_RANGE) {
//   //     const minRow = this.grid.SELECTED_ROW_RANGE.startRow;
//   //     const maxRow = this.grid.SELECTED_ROW_RANGE.endRow;

//   //     for (
//   //       let row = Math.max(minRow, startRow);
//   //       row <= Math.min(maxRow, endRow);
//   //       row++
//   //     ) {
//   //       this.drawSingleRowHeader(row, scrollTop);
//   //     }
//   //   } else {
//   //     const selectedRow = this.grid.SELECTED_ROW_HEADER - 1;
//   //     if (selectedRow >= startRow && selectedRow <= endRow) {
//   //       this.drawSingleRowHeader(selectedRow, scrollTop);
//   //     }
//   //   }
//   // }

//   // drawSingleRowHeader(row: number, scrollTop: number) {
//   //   let rowHeight =
//   //     this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;

//   //   let y1Pos = this.grid.getYPosition(row);
//   //   let adjustedY1 = y1Pos - scrollTop;

//   //   this.grid.context.fillStyle = "#187c44";
//   //   this.grid.context.fillRect(
//   //     0,
//   //     adjustedY1,
//   //     this.grid.ROW_HEADER_WIDTH,
//   //     rowHeight
//   //   );

//   //   this.grid.context.fillStyle = "white";
//   //   this.grid.context.font = "bold 18px Arial";
//   //   this.grid.context.textAlign = "left";
//   //   this.grid.context.textBaseline = "middle";

//   //   const rowLabel = (row + 1).toString();
//   //   const measuredWidth = this.grid.context.measureText(rowLabel).width;
//   //   const paddingX = 8;
//   //   const textX = this.grid.ROW_HEADER_WIDTH - measuredWidth - paddingX;

//   //   this.grid.context.fillText(rowLabel, textX, adjustedY1 + rowHeight / 2);

//   //   this.grid.context.strokeStyle = "#187c44";
//   //   this.grid.context.lineWidth = 2;
//   //   this.grid.context.strokeRect(
//   //     0,
//   //     adjustedY1,
//   //     this.grid.ROW_HEADER_WIDTH,
//   //     rowHeight
//   //   );
//   // }

//   updateInputPosition(scrollLeft: number, scrollTop: number) {
//     const input = document.querySelector(".cellInput") as HTMLInputElement;
//     if (!input || input.style.display === "none") return;

//     const row = this.grid.SELECTED_CELL_RANGE.startRow;
//     const col = this.grid.SELECTED_CELL_RANGE.startCol;

//     if (row === -1 || col === -1) return;

//     const canvasRect = this.grid.canvas.getBoundingClientRect();

//     const cellX =
//       this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
//     const cellY =
//       this.grid.prefixArrayManager.getRowYPosition(row) -
//       scrollTop +
//       (this.grid.ROW_HEIGHTS.get(row) ??
//         this.grid.DEFAULT_ROW_HEIGHT - this.grid.DEFAULT_ROW_HEIGHT);

//     const cellWidth =
//       this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
//     const cellHeight = this.grid.DEFAULT_ROW_HEIGHT;

//     input.style.left = cellX + "px";
//     input.style.top = cellY + "px";
//     input.style.width = cellWidth + "px";
//     input.style.height = cellHeight + "px";
//   }

//   renderCell(
//     row: number,
//     col: number,
//     value: any,
//     scrollLeft: number,
//     scrollTop: number
//   ) {
//     const x = this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
//     const y = this.grid.prefixArrayManager.getRowYPosition(row) - scrollTop;

//     const colWidth =
//       this.grid.RESIZING_COL == col
//         ? this.grid.RESIZING_COL_OLD_WIDTH
//         : this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
//     const colHeight =
//       this.grid.RESIZING_ROW == row
//         ? this.grid.RESIZING_ROW_OLD_HEIGHT
//         : this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;

//     this.grid.context.fillStyle = "#000";
//     this.grid.context.textBaseline = "middle";

//     const strValue = String(value);
//     const isNumber =
//       typeof value === "number" || (!isNaN(value) && !isNaN(parseFloat(value)));

//     let visibleText = "";
//     let currentText = "";
//     for (let i = 0; i < strValue.length; i++) {
//       currentText += strValue[i];
//       const width = this.grid.context.measureText(currentText).width;
//       if (width <= colWidth - 10) {
//         visibleText = currentText;
//       } else {
//         break;
//       }
//     }

//     if (isNumber) {
//       this.grid.context.textAlign = "right";
//       this.grid.context.fillText(
//         visibleText,
//         x + colWidth - 5,
//         y + colHeight - 10
//       );
//     } else {
//       this.grid.context.textAlign = "left";
//       this.grid.context.fillText(visibleText, x + 5, y + colHeight - 10);
//     }
//   }

//   drawVisibleText(
//     startRow: number,
//     endRow: number,
//     startCol: number,
//     endCol: number,
//     scrollLeft: number,
//     scrollTop: number
//   ) {
//     let firstRow = startRow;
//     let lastRow = endRow;
//     let delay = 50;

//     this.grid.context.font = `${this.grid.DEFAULT_FONT_SIZE}px Arial`;
//     this.grid.context.textAlign = "center";
//     this.grid.context.textBaseline = "middle";

//     while (firstRow <= lastRow) {
//       const firstRowData = this.grid.cellDataManager.cellData.get(firstRow);
//       const lastRowData = this.grid.cellDataManager.cellData.get(lastRow);

//       for (let i = startCol; i <= endCol; i++) {
//         // Process firstRowData
//         if (firstRowData && firstRowData.has(i)) {
//           const cell1 = firstRowData.get(i);
//           const value1 = cell1?.value;
//           if (value1 !== undefined) {
//             this.renderCell(firstRow, i, value1, scrollLeft, scrollTop);
//           }
//         }

//         // Process lastRowData, only if it's a different row
//         if (firstRow !== lastRow && lastRowData && lastRowData.has(i)) {
//           const cell2 = lastRowData.get(i);
//           const value2 = cell2?.value;
//           if (value2 !== undefined) {
//             this.renderCell(lastRow, i, value2, scrollLeft, scrollTop);
//           }
//         }
//       }

//       firstRow++;
//       lastRow--;
//     }
//   }

//   drawHeaderRange(
//     from: number,
//     to: number,
//     start: number,
//     end: number,
//     drawFn: (index: number) => void
//   ) {
//     const min = Math.min(from, to);
//     const max = Math.max(from, to);
//     const drawStart = Math.max(min, start);
//     const drawEnd = Math.min(max, end);

//     for (let i = drawStart; i <= drawEnd; i++) {
//       drawFn(i);
//     }
//   }
//   drawHighlighedColumnHeader(
//     startCol: number,
//     endCol: number,
//     scrollLeft: number
//   ) {
//     if (this.grid.SELECTED_COL_HEADER === -1) return;

//     const draw = (col: number) => this.drawSingleColumnHeader(col, scrollLeft);

//     if (
//       this.grid.IS_SELECTING_HEADER &&
//       this.grid.HEADER_SELECTION_TYPE === "column"
//     ) {
//       this.drawHeaderRange(
//         this.grid.HEADER_SELECTION_START_COL,
//         this.grid.HEADER_SELECTION_END_COL,
//         startCol,
//         endCol,
//         draw
//       );
//     } else if (this.grid.SELECTED_COL_RANGE) {
//       this.drawHeaderRange(
//         this.grid.SELECTED_COL_RANGE.startCol,
//         this.grid.SELECTED_COL_RANGE.endCol,
//         startCol,
//         endCol,
//         draw
//       );
//     } else {
//       const selectedCol = this.grid.SELECTED_COL_HEADER - 1;
//       if (selectedCol >= startCol && selectedCol <= endCol) {
//         draw(selectedCol);
//       }
//     }
//   }
//   drawHighlighedRowHeader(startRow: number, endRow: number, scrollTop: number) {
//     if (this.grid.SELECTED_ROW_HEADER === -1) return;

//     const draw = (row: number) => this.drawSingleRowHeader(row, scrollTop);

//     if (
//       this.grid.IS_SELECTING_HEADER &&
//       this.grid.HEADER_SELECTION_TYPE === "row"
//     ) {
//       this.drawHeaderRange(
//         this.grid.HEADER_SELECTION_START_ROW,
//         this.grid.HEADER_SELECTION_END_ROW,
//         startRow,
//         endRow,
//         draw
//       );
//     } else if (this.grid.SELECTED_ROW_RANGE) {
//       this.drawHeaderRange(
//         this.grid.SELECTED_ROW_RANGE.startRow,
//         this.grid.SELECTED_ROW_RANGE.endRow,
//         startRow,
//         endRow,
//         draw
//       );
//     } else {
//       const selectedRow = this.grid.SELECTED_ROW_HEADER - 1;
//       if (selectedRow >= startRow && selectedRow <= endRow) {
//         draw(selectedRow);
//       }
//     }
//   }
//   drawSingleColumnHeader(col: number, scrollLeft: number) {
//     const ctx = this.grid.context;
//     const colWidth =
//       this.grid.COL_WIDTHS.get(col) || this.grid.DEFAULT_COL_WIDTH;
//     const x = this.grid.getXPosition(col) - scrollLeft;

//     ctx.fillStyle = "#187c44";
//     ctx.fillRect(x, 0, colWidth, this.grid.COL_HEADER_HEIGHT);

//     ctx.fillStyle = "white";
//     ctx.font = "bold 18px Arial";
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";

//     const label = Utils.numberToColheader(col);
//     ctx.fillText(label, x + colWidth / 2, this.grid.COL_HEADER_HEIGHT / 2 + 2);

//     ctx.strokeStyle = "#187c44";
//     ctx.lineWidth = 2;
//     ctx.strokeRect(x, 0, colWidth, this.grid.COL_HEADER_HEIGHT);
//   }
//   drawSingleRowHeader(row: number, scrollTop: number) {
//     const ctx = this.grid.context;
//     const rowHeight =
//       this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;
//     const y = this.grid.getYPosition(row) - scrollTop;

//     ctx.fillStyle = "#187c44";
//     ctx.fillRect(0, y, this.grid.ROW_HEADER_WIDTH, rowHeight);

//     ctx.fillStyle = "white";
//     ctx.font = "bold 18px Arial";
//     ctx.textAlign = "center"; // cleaner than calculating textX manually
//     ctx.textBaseline = "middle";

//     const label = (row + 1).toString();
//     ctx.fillText(label, this.grid.ROW_HEADER_WIDTH / 2, y + rowHeight / 2);

//     ctx.strokeStyle = "#187c44";
//     ctx.lineWidth = 2;
//     ctx.strokeRect(0, y, this.grid.ROW_HEADER_WIDTH, rowHeight);
//   }
// }
