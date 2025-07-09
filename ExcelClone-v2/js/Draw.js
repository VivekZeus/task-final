import { Utils } from "./Utils.js";
export class Draw {
    constructor(gridObj) {
        this.grid = gridObj;
    }
    drawSelectedCellCorrepondingRowCol(startRow, endRow, startCol, endCol, scrollLeft, scrollTop) {
        var _a, _b;
        if (this.grid.SELECTED_CELL_RANGE == null)
            return;
        const selStartRow = this.grid.SELECTED_CELL_RANGE.startRow;
        const selStartCol = this.grid.SELECTED_CELL_RANGE.startCol;
        const selEndRow = this.grid.SELECTED_CELL_RANGE.endRow;
        const selEndCol = this.grid.SELECTED_CELL_RANGE.endCol;
        // Also check for single cell selection for backwards compatibility
        const singleSelRow = this.grid.SELECTED_CELL.row;
        const singleSelCol = this.grid.SELECTED_CELL.col;
        // Determine if we have a range selection or single cell selection
        const hasRangeSelection = selStartRow !== -1 &&
            selStartCol !== -1 &&
            selEndRow !== -1 &&
            selEndCol !== -1;
        const hasSingleSelection = singleSelRow !== -1 && singleSelCol !== -1;
        if (!hasRangeSelection && !hasSingleSelection)
            return;
        if (this.grid.RESIZING_COL !== -1)
            return;
        const highlightColor = "rgba(173, 235, 193, 0.6)";
        const borderColor = "#187c44";
        this.grid.context.save();
        if (hasRangeSelection) {
            // Handle range selection
            const minRow = Math.min(selStartRow, selEndRow);
            const maxRow = Math.max(selStartRow, selEndRow);
            const minCol = Math.min(selStartCol, selEndCol);
            const maxCol = Math.max(selStartCol, selEndCol);
            // === Column Headers Highlight === (for all columns in range)
            for (let col = minCol; col <= maxCol; col++) {
                if (col >= startCol && col <= endCol) {
                    const colPos = this.grid.prefixArrayManager.getCellPosition(0, col);
                    const colX = colPos.x - scrollLeft;
                    const colWidth = (_a = this.grid.COL_WIDTHS.get(col)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_COL_WIDTH;
                    const colHeight = this.grid.COL_HEADER_HEIGHT;
                    // Fill
                    this.grid.context.fillStyle = highlightColor;
                    this.grid.context.fillRect(colX, 0, colWidth, colHeight);
                    // Border bottom
                    this.grid.context.strokeStyle = borderColor;
                    this.grid.context.lineWidth = 2;
                    this.grid.context.beginPath();
                    this.grid.context.moveTo(colX, colHeight - 1);
                    this.grid.context.lineTo(colX + colWidth, colHeight - 1);
                    this.grid.context.stroke();
                }
            }
            // === Row Headers Highlight === (for all rows in range)
            for (let row = minRow; row <= maxRow; row++) {
                if (row >= startRow && row <= endRow) {
                    const rowPos = this.grid.prefixArrayManager.getCellPosition(row, 0);
                    const rowY = rowPos.y - scrollTop;
                    const rowWidth = this.grid.ROW_HEADER_WIDTH;
                    const rowHeight = this.grid.ROW_HEIGHTS.get(row) || this.grid.DEFAULT_ROW_HEIGHT;
                    // Fill
                    this.grid.context.fillStyle = highlightColor;
                    this.grid.context.fillRect(0, rowY, rowWidth, rowHeight);
                    // Border right
                    this.grid.context.strokeStyle = borderColor;
                    this.grid.context.lineWidth = 2;
                    this.grid.context.beginPath();
                    this.grid.context.moveTo(rowWidth - 1, rowY);
                    this.grid.context.lineTo(rowWidth - 1, rowY + rowHeight);
                    this.grid.context.stroke();
                }
            }
        }
        else {
            // Handle single cell selection (original behavior)
            const selRow = singleSelRow;
            const selCol = singleSelCol;
            // === Column Header Highlight === (Even if row is out of view)
            if (selCol >= startCol && selCol <= endCol) {
                const colPos = this.grid.prefixArrayManager.getCellPosition(0, selCol);
                const colX = colPos.x - scrollLeft;
                const colWidth = (_b = this.grid.COL_WIDTHS.get(selCol)) !== null && _b !== void 0 ? _b : this.grid.DEFAULT_COL_WIDTH;
                const colHeight = this.grid.COL_HEADER_HEIGHT;
                // Fill
                this.grid.context.fillStyle = highlightColor;
                this.grid.context.fillRect(colX, 0, colWidth, colHeight);
                // Border bottom
                this.grid.context.strokeStyle = borderColor;
                this.grid.context.lineWidth = 2;
                this.grid.context.beginPath();
                this.grid.context.moveTo(colX, colHeight - 1);
                this.grid.context.lineTo(colX + colWidth, colHeight - 1);
                this.grid.context.stroke();
            }
            // === Row Header Highlight === (Even if col is out of view)
            if (selRow >= startRow && selRow <= endRow) {
                const rowPos = this.grid.prefixArrayManager.getCellPosition(selRow, 0);
                const rowY = rowPos.y - scrollTop;
                const rowWidth = this.grid.ROW_HEADER_WIDTH;
                const rowHeight = this.grid.ROW_HEIGHTS.get(selRow) || this.grid.DEFAULT_ROW_HEIGHT;
                // Fill
                this.grid.context.fillStyle = highlightColor;
                this.grid.context.fillRect(0, rowY, rowWidth, rowHeight);
                // Border right
                this.grid.context.strokeStyle = borderColor;
                this.grid.context.lineWidth = 2;
                this.grid.context.beginPath();
                this.grid.context.moveTo(rowWidth - 1, rowY);
                this.grid.context.lineTo(rowWidth - 1, rowY + rowHeight);
                this.grid.context.stroke();
            }
        }
        this.grid.context.restore();
    }
    drawSelectedCellBorder(startRow, endRow, startCol, endCol, scrollLeft, scrollTop) {
        var _a, _b, _c, _d, _e, _f;
        if (this.grid.SELECTED_CELL_RANGE == null)
            return;
        const selStartRow = this.grid.SELECTED_CELL_RANGE.startRow;
        const selStartCol = this.grid.SELECTED_CELL_RANGE.startCol;
        const selEndCol = this.grid.SELECTED_CELL_RANGE.endCol;
        const selEndRow = this.grid.SELECTED_CELL_RANGE.endRow;
        const minRow = Math.min(selStartRow, selEndRow);
        const maxRow = Math.max(selStartRow, selEndRow);
        const minCol = Math.min(selStartCol, selEndCol);
        const maxCol = Math.max(selStartCol, selEndCol);
        this.grid.SELECTED_CELL_RANGE_STAT = {
            startRow: minRow,
            endRow: maxRow,
            startCol: minCol,
            endCol: maxCol
        };
        // Reject if there's no selection or it's fully outside the visible area
        if (minRow === -1 ||
            minCol === -1 ||
            // maxRow < startRow ||
            // minRow > endRow ||
            // maxCol < startCol ||
            // minCol > endCol ||
            this.grid.RESIZING_COL !== -1 ||
            this.grid.RESIZING_ROW !== -1) {
            return;
        }
        // Single cell selection
        if (selStartRow === selEndRow &&
            selStartCol === selEndCol &&
            selStartRow !== -1 &&
            selStartCol !== -1) {
            const pos = this.grid.getPosition(selStartRow, selStartCol);
            // const pos = PrefixArrayManager.getCellPosition(selStartRow, selStartCol);
            const x = pos.x - scrollLeft;
            const y = pos.y - scrollTop;
            const width = (_a = this.grid.COL_WIDTHS.get(selStartCol)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_COL_WIDTH;
            const height = (_b = this.grid.ROW_HEIGHTS.get(selStartRow)) !== null && _b !== void 0 ? _b : this.grid.DEFAULT_ROW_HEIGHT;
            this.grid.context.strokeStyle = "#187c44";
            this.grid.context.lineWidth = 2;
            this.grid.context.strokeRect(x, y, width, height);
            const handleSize = 6;
            const handleOffset = 2;
            this.grid.context.fillStyle = "#187c44";
            this.grid.context.fillRect(x + width - handleSize - handleOffset + 5, y + height - handleSize - handleOffset + 5, handleSize, handleSize);
        }
        else {
            // Multi-cell range selection
            const visibleMinRow = minRow;
            const visibleMaxRow = maxRow;
            const visibleMinCol = minCol;
            const visibleMaxCol = maxCol;
            // const visibleMinRow = Math.max(minRow, startRow);
            // const visibleMaxRow = Math.min(maxRow, endRow);
            // const visibleMinCol = Math.max(minCol, startCol);
            // const visibleMaxCol = Math.min(maxCol, endCol);
            // Fill the range with light green
            this.grid.context.fillStyle = "rgba(24, 124, 68, 0.1)"; // Very light green
            for (let row = visibleMinRow; row <= visibleMaxRow; row++) {
                for (let col = visibleMinCol; col <= visibleMaxCol; col++) {
                    const pos = this.grid.prefixArrayManager.getCellPosition(row, col);
                    const x = pos.x - scrollLeft;
                    const y = pos.y - scrollTop;
                    const width = (_c = this.grid.COL_WIDTHS.get(col)) !== null && _c !== void 0 ? _c : this.grid.DEFAULT_COL_WIDTH;
                    const height = (_d = this.grid.ROW_HEIGHTS.get(row)) !== null && _d !== void 0 ? _d : this.grid.DEFAULT_ROW_HEIGHT;
                    // Skip the starting cell (will be filled white later)
                    if (row === selStartRow && col === selStartCol) {
                        continue;
                    }
                    this.grid.context.fillRect(x, y, width, height);
                }
            }
            // Fill the starting cell with white
            // if (
            //   selStartRow >= startRow &&
            //   selStartRow <= endRow &&
            //   selStartCol >= startCol &&
            //   selStartCol <= endCol
            // ) {
            const startPos = this.grid.prefixArrayManager.getCellPosition(selStartRow, selStartCol);
            const startX = startPos.x - scrollLeft;
            const startY = startPos.y - scrollTop;
            const startWidth = (_e = this.grid.COL_WIDTHS.get(selStartCol)) !== null && _e !== void 0 ? _e : this.grid.DEFAULT_COL_WIDTH;
            const startHeight = (_f = this.grid.ROW_HEIGHTS.get(selStartRow)) !== null && _f !== void 0 ? _f : this.grid.DEFAULT_ROW_HEIGHT;
            this.grid.context.fillStyle = "white";
            this.grid.context.fillRect(startX, startY, startWidth, startHeight);
            // }
            // Draw the border around the entire range
            const rangeStartPos = this.grid.prefixArrayManager.getCellPosition(minRow, minCol);
            const rangeEndPos = this.grid.prefixArrayManager.getCellPosition(maxRow, maxCol);
            const rangeX = rangeStartPos.x - scrollLeft;
            const rangeY = rangeStartPos.y - scrollTop;
            const rangeWidth = rangeEndPos.x -
                rangeStartPos.x +
                (this.grid.COL_WIDTHS.get(maxCol) || this.grid.DEFAULT_COL_WIDTH);
            const rangeHeight = rangeEndPos.y -
                rangeStartPos.y +
                (this.grid.ROW_HEIGHTS.get(maxRow) || this.grid.DEFAULT_ROW_HEIGHT);
            this.grid.context.strokeStyle = "#187c44"; // Dark green border
            this.grid.context.lineWidth = 2;
            this.grid.context.strokeRect(rangeX, rangeY, rangeWidth, rangeHeight);
            // Draw the green square at bottom left of the range
            const handleSize = 6;
            this.grid.context.fillStyle = "#187c44";
            this.grid.context.fillRect(rangeX + rangeWidth - handleSize + 2, rangeY + rangeHeight - handleSize + 2, handleSize + 1, handleSize + 1);
        }
    }
    // drawSelectedCellCorrepondingRowCol(
    //   startRow: number,
    //   endRow: number,
    //   startCol: number,
    //   endCol: number,
    //   scrollLeft: number,
    //   scrollTop: number
    // ) {
    //   if (this.grid.SELECTED_CELL_RANGE == null) return;
    //   const selStartRow = this.grid.SELECTED_CELL_RANGE.startRow;
    //   const selStartCol = this.grid.SELECTED_CELL_RANGE.startCol;
    //   const selEndRow = this.grid.SELECTED_CELL_RANGE.endRow;
    //   const selEndCol = this.grid.SELECTED_CELL_RANGE.endCol;
    //   // Also check for single cell selection for backwards compatibility
    //   const singleSelRow = this.grid.SELECTED_CELL.row;
    //   const singleSelCol = this.grid.SELECTED_CELL.col;
    //   // Determine if we have a range selection or single cell selection
    //   const hasRangeSelection =
    //     selStartRow !== -1 &&
    //     selStartCol !== -1 &&
    //     selEndRow !== -1 &&
    //     selEndCol !== -1;
    //   const hasSingleSelection = singleSelRow !== -1 && singleSelCol !== -1;
    //   if (!hasRangeSelection && !hasSingleSelection) return;
    //   if (this.grid.RESIZING_COL !== -1) return;
    //   const highlightColor = "rgba(173, 235, 193, 0.6)";
    //   const borderColor = "#187c44";
    //   this.grid.context.save();
    //   if (hasRangeSelection) {
    //     // Handle range selection
    //     const minRow = Math.min(selStartRow, selEndRow);
    //     const maxRow = Math.max(selStartRow, selEndRow);
    //     const minCol = Math.min(selStartCol, selEndCol);
    //     const maxCol = Math.max(selStartCol, selEndCol);
    //     // === Column Headers Highlight === (for all columns in range)
    //     for (let col = minCol; col <= maxCol; col++) {
    //       // Remove the visibility constraint - draw all selected columns
    //       const colPos = this.grid.prefixArrayManager.getCellPosition(0, col);
    //       const colX = colPos.x - scrollLeft;
    //       const colWidth =
    //         this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
    //       const colHeight = this.grid.COL_HEADER_HEIGHT;
    //       // Only draw if the column is actually visible on screen
    //       if (colX + colWidth > 0 && colX < this.grid.canvas.width) {
    //         // Fill
    //         this.grid.context.fillStyle = highlightColor;
    //         this.grid.context.fillRect(colX, 0, colWidth, colHeight);
    //         // Border bottom
    //         this.grid.context.strokeStyle = borderColor;
    //         this.grid.context.lineWidth = 2;
    //         this.grid.context.beginPath();
    //         this.grid.context.moveTo(colX, colHeight - 1);
    //         this.grid.context.lineTo(colX + colWidth, colHeight - 1);
    //         this.grid.context.stroke();
    //       }
    //     }
    //     // === Row Headers Highlight === (for all rows in range)
    //     for (let row = minRow; row <= maxRow; row++) {
    //       // Remove the visibility constraint - draw all selected rows
    //       const rowPos = this.grid.prefixArrayManager.getCellPosition(row, 0);
    //       const rowY = rowPos.y - scrollTop;
    //       const rowWidth = this.grid.ROW_HEADER_WIDTH;
    //       const rowHeight =
    //         this.grid.ROW_HEIGHTS.get(row) || this.grid.DEFAULT_ROW_HEIGHT;
    //       // Only draw if the row is actually visible on screen
    //       if (rowY + rowHeight > 0 && rowY < this.grid.canvas.height) {
    //         // Fill
    //         this.grid.context.fillStyle = highlightColor;
    //         this.grid.context.fillRect(0, rowY, rowWidth, rowHeight);
    //         // Border right
    //         this.grid.context.strokeStyle = borderColor;
    //         this.grid.context.lineWidth = 2;
    //         this.grid.context.beginPath();
    //         this.grid.context.moveTo(rowWidth - 1, rowY);
    //         this.grid.context.lineTo(rowWidth - 1, rowY + rowHeight);
    //         this.grid.context.stroke();
    //       }
    //     }
    //   } else {
    //     // Handle single cell selection (original behavior)
    //     const selRow = singleSelRow;
    //     const selCol = singleSelCol;
    //     // === Column Header Highlight === (Even if row is out of view)
    //     const colPos = this.grid.prefixArrayManager.getCellPosition(0, selCol);
    //     const colX = colPos.x - scrollLeft;
    //     const colWidth =
    //       this.grid.COL_WIDTHS.get(selCol) ?? this.grid.DEFAULT_COL_WIDTH;
    //     const colHeight = this.grid.COL_HEADER_HEIGHT;
    //     // Only draw if the column is actually visible on screen
    //     if (colX + colWidth > 0 && colX < this.grid.canvas.width) {
    //       // Fill
    //       this.grid.context.fillStyle = highlightColor;
    //       this.grid.context.fillRect(colX, 0, colWidth, colHeight);
    //       // Border bottom
    //       this.grid.context.strokeStyle = borderColor;
    //       this.grid.context.lineWidth = 2;
    //       this.grid.context.beginPath();
    //       this.grid.context.moveTo(colX, colHeight - 1);
    //       this.grid.context.lineTo(colX + colWidth, colHeight - 1);
    //       this.grid.context.stroke();
    //     }
    //     // === Row Header Highlight === (Even if col is out of view)
    //     const rowPos = this.grid.prefixArrayManager.getCellPosition(selRow, 0);
    //     const rowY = rowPos.y - scrollTop;
    //     const rowWidth = this.grid.ROW_HEADER_WIDTH;
    //     const rowHeight =
    //       this.grid.ROW_HEIGHTS.get(selRow) || this.grid.DEFAULT_ROW_HEIGHT;
    //     // Only draw if the row is actually visible on screen
    //     if (rowY + rowHeight > 0 && rowY < this.grid.canvas.height) {
    //       // Fill
    //       this.grid.context.fillStyle = highlightColor;
    //       this.grid.context.fillRect(0, rowY, rowWidth, rowHeight);
    //       // Border right
    //       this.grid.context.strokeStyle = borderColor;
    //       this.grid.context.lineWidth = 2;
    //       this.grid.context.beginPath();
    //       this.grid.context.moveTo(rowWidth - 1, rowY);
    //       this.grid.context.lineTo(rowWidth - 1, rowY + rowHeight);
    //       this.grid.context.stroke();
    //     }
    //   }
    //   this.grid.context.restore();
    // }
    // drawSelectedCellBorder(
    //   startRow: number,
    //   endRow: number,
    //   startCol: number,
    //   endCol: number,
    //   scrollLeft: number,
    //   scrollTop: number
    // ) {
    //   if (this.grid.SELECTED_CELL_RANGE == null) return;
    //   const selStartRow = this.grid.SELECTED_CELL_RANGE.startRow;
    //   const selStartCol = this.grid.SELECTED_CELL_RANGE.startCol;
    //   const selEndCol = this.grid.SELECTED_CELL_RANGE.endCol;
    //   const selEndRow = this.grid.SELECTED_CELL_RANGE.endRow;
    //   const minRow = Math.min(selStartRow, selEndRow);
    //   const maxRow = Math.max(selStartRow, selEndRow);
    //   const minCol = Math.min(selStartCol, selEndCol);
    //   const maxCol = Math.max(selStartCol, selEndCol);
    //   this.grid.SELECTED_CELL_RANGE_STAT = {
    //     startRow: minRow,
    //     endRow: maxRow,
    //     startCol: minCol,
    //     endCol: maxCol,
    //   };
    //   // Only reject if there's no selection or during resize operations
    //   if (
    //     minRow === -1 ||
    //     minCol === -1 ||
    //     this.grid.RESIZING_COL !== -1 ||
    //     this.grid.RESIZING_ROW !== -1
    //   ) {
    //     return;
    //   }
    //   // Single cell selection
    //   if (
    //     selStartRow === selEndRow &&
    //     selStartCol === selEndCol &&
    //     selStartRow !== -1 &&
    //     selStartCol !== -1
    //   ) {
    //     const pos = this.grid.getPosition(selStartRow, selStartCol);
    //     const x = pos.x - scrollLeft;
    //     const y = pos.y - scrollTop;
    //     const width =
    //       this.grid.COL_WIDTHS.get(selStartCol) ?? this.grid.DEFAULT_COL_WIDTH;
    //     const height =
    //       this.grid.ROW_HEIGHTS.get(selStartRow) ?? this.grid.DEFAULT_ROW_HEIGHT;
    //     this.grid.context.strokeStyle = "#187c44";
    //     this.grid.context.lineWidth = 2;
    //     this.grid.context.strokeRect(x, y, width, height);
    //     const handleSize = 6;
    //     const handleOffset = 2;
    //     this.grid.context.fillStyle = "#187c44";
    //     this.grid.context.fillRect(
    //       x + width - handleSize - handleOffset + 5,
    //       y + height - handleSize - handleOffset + 5,
    //       handleSize,
    //       handleSize
    //     );
    //   } else {
    //     // Multi-cell range selection - draw the entire range regardless of viewport
    //     const visibleMinRow = minRow;
    //     const visibleMaxRow = maxRow;
    //     const visibleMinCol = minCol;
    //     const visibleMaxCol = maxCol;
    //     // Fill the range with light green
    //     this.grid.context.fillStyle = "rgba(24, 124, 68, 0.1)"; // Very light green
    //     for (let row = visibleMinRow; row <= visibleMaxRow; row++) {
    //       for (let col = visibleMinCol; col <= visibleMaxCol; col++) {
    //         const pos = this.grid.prefixArrayManager.getCellPosition(row, col);
    //         const x = pos.x - scrollLeft;
    //         const y = pos.y - scrollTop;
    //         const width =
    //           this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
    //         const height =
    //           this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;
    //         // Skip the starting cell (will be filled white later)
    //         if (row === selStartRow && col === selStartCol) {
    //           continue;
    //         }
    //         // Only draw cells that are at least partially visible
    //         if (
    //           x + width > 0 &&
    //           x < this.grid.canvas.width &&
    //           y + height > 0 &&
    //           y < this.grid.canvas.height
    //         ) {
    //           this.grid.context.fillRect(x, y, width, height);
    //         }
    //       }
    //     }
    //     // Fill the starting cell with white (if visible)
    //     const startPos = this.grid.prefixArrayManager.getCellPosition(
    //       selStartRow,
    //       selStartCol
    //     );
    //     const startX = startPos.x - scrollLeft;
    //     const startY = startPos.y - scrollTop;
    //     const startWidth =
    //       this.grid.COL_WIDTHS.get(selStartCol) ?? this.grid.DEFAULT_COL_WIDTH;
    //     const startHeight =
    //       this.grid.ROW_HEIGHTS.get(selStartRow) ?? this.grid.DEFAULT_ROW_HEIGHT;
    //     if (
    //       startX + startWidth > 0 &&
    //       startX < this.grid.canvas.width &&
    //       startY + startHeight > 0 &&
    //       startY < this.grid.canvas.height
    //     ) {
    //       this.grid.context.fillStyle = "white";
    //       this.grid.context.fillRect(startX, startY, startWidth, startHeight);
    //     }
    //     // Draw the border around the entire range
    //     const rangeStartPos = this.grid.prefixArrayManager.getCellPosition(
    //       minRow,
    //       minCol
    //     );
    //     const rangeEndPos = this.grid.prefixArrayManager.getCellPosition(
    //       maxRow,
    //       maxCol
    //     );
    //     const rangeX = rangeStartPos.x - scrollLeft;
    //     const rangeY = rangeStartPos.y - scrollTop;
    //     const rangeWidth =
    //       rangeEndPos.x -
    //       rangeStartPos.x +
    //       (this.grid.COL_WIDTHS.get(maxCol) || this.grid.DEFAULT_COL_WIDTH);
    //     const rangeHeight =
    //       rangeEndPos.y -
    //       rangeStartPos.y +
    //       (this.grid.ROW_HEIGHTS.get(maxRow) || this.grid.DEFAULT_ROW_HEIGHT);
    //     this.grid.context.strokeStyle = "#187c44"; // Dark green border
    //     this.grid.context.lineWidth = 2;
    //     this.grid.context.strokeRect(rangeX, rangeY, rangeWidth, rangeHeight);
    //     // Draw the green square at bottom right of the range
    //     const handleSize = 6;
    //     this.grid.context.fillStyle = "#187c44";
    //     this.grid.context.fillRect(
    //       rangeX + rangeWidth - handleSize + 2,
    //       rangeY + rangeHeight - handleSize + 2,
    //       handleSize + 1,
    //       handleSize + 1
    //     );
    //   }
    // }
    insertRowHeaderText(startRow, endRow, scrollTop) {
        var _a;
        const paddingX = 5;
        for (let row = startRow; row <= endRow; row++) {
            const text = (row + 1).toString();
            const pos = this.grid.getPosition(row, 0);
            const height = (_a = this.grid.ROW_HEIGHTS.get(row)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_ROW_HEIGHT;
            const textY = pos.y - scrollTop + height / 2 + this.grid.TEXT_PADDING_Y;
            const measuredWidth = this.grid.context.measureText(text).width;
            const textX = pos.x - measuredWidth - paddingX;
            this.grid.context.font = "18px sans-serif";
            this.grid.context.fillStyle = "rgba(0, 0, 0, 0.7)";
            this.grid.context.textAlign = "left";
            this.grid.context.textBaseline = "middle";
            this.grid.context.fillText(text, textX, textY);
        }
    }
    insertColHeaderText(startCol, endCol, scrollLeft) {
        var _a;
        for (let col = startCol; col <= endCol; col++) {
            const text = Utils.numberToColheader(col);
            const pos = this.grid.getPosition(0, col);
            const width = (_a = this.grid.COL_WIDTHS.get(col)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_COL_WIDTH;
            const textX = pos.x - scrollLeft + width / 2;
            const textY = this.grid.COL_HEADER_HEIGHT / 2 + this.grid.TEXT_PADDING_Y;
            this.grid.context.font = "18px sans-serif";
            this.grid.context.fillStyle = "rgba(0, 0, 0, 0.8)";
            this.grid.context.textAlign = "center";
            this.grid.context.textBaseline = "middle";
            this.grid.context.fillText(text, textX, textY);
        }
    }
    drawRowsCols(startRow, startCol, endRow, endCol) {
        let additional = 0.5;
        // Draw horizontal grid lines (row separators)
        for (let i = startRow; i < endRow; i++) {
            const y = this.grid.prefixArrayManager.getRowYPosition(i + 1);
            this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, y + additional); // Usually ROW_HEADER_WIDTH
            this.grid.context.lineTo(this.grid.prefixArrayManager.getColXPosition(endCol), y + additional);
        }
        // Draw vertical grid lines (column separators)
        for (let j = startCol; j < endCol; j++) {
            const x = this.grid.prefixArrayManager.getColXPosition(j + 1);
            this.grid.context.moveTo(x + additional, this.grid.COL_HEADER_HEIGHT);
            this.grid.context.lineTo(x + additional, this.grid.prefixArrayManager.getRowYPosition(endRow));
        }
        this.grid.context.strokeStyle = "rgb(0,0,0)";
        this.grid.context.lineWidth = 0.1;
        this.grid.context.stroke();
        this.grid.context.restore();
    }
    drawColumnHeader(endCol) {
        this.grid.context.fillStyle = "#f0f0f0";
        this.grid.context.fillRect(0, 0, this.grid.prefixArrayManager.getColXPosition(endCol), this.grid.COL_HEADER_HEIGHT + 0.5);
    }
    drawRowHeader(endRow) {
        this.grid.context.fillStyle = "#f0f0f0";
        this.grid.context.fillRect(0, 0, this.grid.ROW_HEADER_WIDTH + 0.5, this.grid.prefixArrayManager.getRowYPosition(endRow));
    }
    drawCornerBox() {
        this.grid.context.fillStyle = "white";
        this.grid.context.fillRect(0, 0, this.grid.ROW_HEADER_WIDTH + 0.5, this.grid.COL_HEADER_HEIGHT + 0.5);
    }
    drawVerticalLinesColResizing(col, height) {
        if (this.grid.RESIZING_COL == -1)
            return;
        let currentResizingColPos = this.grid.prefixArrayManager.getColXPosition(col);
        this.grid.context.save();
        this.grid.context.strokeStyle = "#187c44";
        this.grid.context.lineWidth = 2;
        // Draw line at previous column position
        this.grid.context.beginPath();
        this.grid.context.moveTo(currentResizingColPos, this.grid.COL_HEADER_HEIGHT);
        this.grid.context.lineTo(currentResizingColPos, height);
        // context.stroke();
        // Draw line at current resizing column position
        // context.beginPath();
        if (col != 1) {
            let prevCol = this.grid.prefixArrayManager.getColXPosition(col - 1);
            this.grid.context.moveTo(prevCol, this.grid.COL_HEADER_HEIGHT);
            this.grid.context.lineTo(prevCol, height);
        }
        this.grid.context.stroke();
        this.grid.context.restore();
    }
    drawVerticalDashedLine(x, height) {
        if (this.grid.RESIZING_COL == -1)
            return;
        this.grid.context.save();
        this.grid.context.strokeStyle = "#187c44"; // Green color
        this.grid.context.lineWidth = 2;
        this.grid.context.setLineDash([5, 3]); // Dash pattern: 5px line, 3px gap
        this.grid.context.beginPath();
        this.grid.context.moveTo(x, this.grid.COL_HEADER_HEIGHT);
        this.grid.context.lineTo(x, height);
        this.grid.context.stroke();
        this.grid.context.restore();
    }
    drawHorizontalDashedLine(y, width) {
        if (this.grid.RESIZING_ROW == -1)
            return;
        this.grid.context.save();
        this.grid.context.strokeStyle = "#187c44"; // Green color
        this.grid.context.lineWidth = 2;
        this.grid.context.setLineDash([5, 3]); // Dash pattern: 5px line, 3px gap
        this.grid.context.beginPath();
        this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, y - 100);
        this.grid.context.lineTo(width, y - 100);
        this.grid.context.stroke();
        this.grid.context.restore();
    }
    drawHorizontalLinesRowResizing(row, width) {
        if (this.grid.RESIZING_ROW == -1)
            return;
        let currentResizingRowPos = this.grid.prefixArrayManager.getRowYPosition(row);
        this.grid.context.save();
        this.grid.context.strokeStyle = "#187c44";
        this.grid.context.lineWidth = 2;
        // Draw line at previous column position
        this.grid.context.beginPath();
        this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, currentResizingRowPos);
        this.grid.context.lineTo(width, currentResizingRowPos);
        if (row != 1) {
            let prevRowPos = this.grid.prefixArrayManager.getRowYPosition(row - 1);
            this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, prevRowPos);
            this.grid.context.lineTo(width, prevRowPos);
        }
        this.grid.context.stroke();
        this.grid.context.restore();
    }
    drawResizeIndicator(colIndex, scrollLeft) {
        var _a;
        if (colIndex === -1)
            return;
        // Get the x position of the column edge (right edge of the column)
        let x = this.grid.prefixArrayManager.getColXPosition(colIndex) +
            ((_a = this.grid.COL_WIDTHS.get(colIndex)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_COL_WIDTH);
        x -= scrollLeft;
        // Make sure the indicator is visible
        if (x < this.grid.ROW_HEADER_WIDTH || x > this.grid.context.canvas.width)
            return;
        const pillWidth = 6;
        const pillHeight = (this.grid.COL_HEADER_HEIGHT - 6) * 0.6; // Reduced height to 60% of original
        const radius = pillWidth / 2;
        const pillX = x - pillWidth / 2;
        const pillY = 3 + (this.grid.COL_HEADER_HEIGHT - 6 - pillHeight) / 2; // Center vertically
        this.grid.context.save();
        this.grid.context.fillStyle = "white"; // White fill
        this.grid.context.strokeStyle = "green"; // Green border
        this.grid.context.lineWidth = 1;
        // Draw pill
        this.grid.context.beginPath();
        this.grid.context.moveTo(pillX + radius, pillY);
        this.grid.context.lineTo(pillX + pillWidth - radius, pillY);
        this.grid.context.quadraticCurveTo(pillX + pillWidth, pillY, pillX + pillWidth, pillY + radius);
        this.grid.context.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
        this.grid.context.quadraticCurveTo(pillX + pillWidth, pillY + pillHeight, pillX + pillWidth - radius, pillY + pillHeight);
        this.grid.context.lineTo(pillX + radius, pillY + pillHeight);
        this.grid.context.quadraticCurveTo(pillX, pillY + pillHeight, pillX, pillY + pillHeight - radius);
        this.grid.context.lineTo(pillX, pillY + radius);
        this.grid.context.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
        this.grid.context.closePath();
        this.grid.context.fill(); // Fill with white
        this.grid.context.stroke(); // Stroke with green border
        this.grid.context.restore();
    }
    drawRowResizeIndicator(rowIndex, scrollTop) {
        var _a;
        if (rowIndex === -1)
            return;
        // Get the y position of the row edge (bottom edge of the row)
        let y = this.grid.prefixArrayManager.getRowYPosition(rowIndex) +
            ((_a = this.grid.ROW_HEIGHTS.get(rowIndex)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_ROW_HEIGHT);
        y -= scrollTop;
        // Make sure the indicator is visible
        if (y < this.grid.COL_HEADER_HEIGHT || y > this.grid.context.canvas.height)
            return;
        const pillWidth = this.grid.ROW_HEADER_WIDTH * 0.35; // Reduced from 0.6 to 0.35 (about 35% of row header width)
        const pillHeight = 4; // Small height
        const radius = pillHeight / 2;
        const pillX = (this.grid.ROW_HEADER_WIDTH - pillWidth) / 2; // Center horizontally in row header
        const pillY = y - pillHeight / 2; // Center on the row edge
        this.grid.context.save();
        this.grid.context.fillStyle = "white"; // White fill
        this.grid.context.strokeStyle = "green"; // Green border
        this.grid.context.lineWidth = 1;
        // Draw horizontal pill
        this.grid.context.beginPath();
        this.grid.context.moveTo(pillX + radius, pillY);
        this.grid.context.lineTo(pillX + pillWidth - radius, pillY);
        this.grid.context.quadraticCurveTo(pillX + pillWidth, pillY, pillX + pillWidth, pillY + radius);
        this.grid.context.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
        this.grid.context.quadraticCurveTo(pillX + pillWidth, pillY + pillHeight, pillX + pillWidth - radius, pillY + pillHeight);
        this.grid.context.lineTo(pillX + radius, pillY + pillHeight);
        this.grid.context.quadraticCurveTo(pillX, pillY + pillHeight, pillX, pillY + pillHeight - radius);
        this.grid.context.lineTo(pillX, pillY + radius);
        this.grid.context.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
        this.grid.context.closePath();
        this.grid.context.fill(); // Fill with white
        this.grid.context.stroke(); // Stroke with green border
        this.grid.context.restore();
    }
    drawHighlighedColumnHeader(startCol, endCol, scrollLeft) {
        if (this.grid.SELECTED_COL_HEADER === -1)
            return;
        // If we're in header selection mode, draw the range
        if (this.grid.IS_SELECTING_HEADER &&
            this.grid.HEADER_SELECTION_TYPE === "column") {
            const minCol = Math.min(this.grid.HEADER_SELECTION_START_COL, this.grid.HEADER_SELECTION_END_COL);
            const maxCol = Math.max(this.grid.HEADER_SELECTION_START_COL, this.grid.HEADER_SELECTION_END_COL);
            // Draw all columns in the selection range
            for (let col = Math.max(minCol, startCol); col <= Math.min(maxCol, endCol); col++) {
                this.drawSingleColumnHeader(col, scrollLeft);
            }
        }
        else if (this.grid.SELECTED_COL_RANGE) {
            // Draw persistent selection range after mouse up
            const minCol = this.grid.SELECTED_COL_RANGE.startCol;
            const maxCol = this.grid.SELECTED_COL_RANGE.endCol;
            for (let col = Math.max(minCol, startCol); col <= Math.min(maxCol, endCol); col++) {
                this.drawSingleColumnHeader(col, scrollLeft);
            }
        }
        else {
            // Draw single column selection (original behavior)
            const selectedCol = this.grid.SELECTED_COL_HEADER - 1;
            if (selectedCol >= startCol && selectedCol <= endCol) {
                this.drawSingleColumnHeader(selectedCol, scrollLeft);
            }
        }
    }
    drawSingleColumnHeader(col, scrollLeft) {
        let colWidth = this.grid.COL_WIDTHS.get(col) || this.grid.DEFAULT_COL_WIDTH;
        // Recalculate adjusted X position based on current scroll
        let x1Pos = this.grid.getXPosition(col);
        let adjustedX1 = x1Pos - scrollLeft;
        this.grid.context.fillStyle = "#187c44"; // Dark green background
        this.grid.context.fillRect(adjustedX1, 0, colWidth, this.grid.COL_HEADER_HEIGHT);
        // Draw column label with white text
        this.grid.context.fillStyle = "white";
        this.grid.context.font = "bold 18px Arial";
        this.grid.context.textAlign = "center";
        this.grid.context.textBaseline = "middle";
        const columnLabel = Utils.numberToColheader(col);
        this.grid.context.fillText(columnLabel, adjustedX1 + colWidth / 2, this.grid.COL_HEADER_HEIGHT / 2 + 2);
        // Draw border around the header
        this.grid.context.strokeStyle = "#187c44";
        this.grid.context.lineWidth = 2;
        this.grid.context.strokeRect(adjustedX1, 0, colWidth, this.grid.COL_HEADER_HEIGHT);
    }
    drawHighlighedRowHeader(startRow, endRow, scrollTop) {
        if (this.grid.SELECTED_ROW_HEADER === -1)
            return;
        if (this.grid.IS_SELECTING_HEADER &&
            this.grid.HEADER_SELECTION_TYPE === "row") {
            const minRow = Math.min(this.grid.HEADER_SELECTION_START_ROW, this.grid.HEADER_SELECTION_END_ROW);
            const maxRow = Math.max(this.grid.HEADER_SELECTION_START_ROW, this.grid.HEADER_SELECTION_END_ROW);
            for (let row = Math.max(minRow, startRow); row <= Math.min(maxRow, endRow); row++) {
                this.drawSingleRowHeader(row, scrollTop);
            }
        }
        else if (this.grid.SELECTED_ROW_RANGE) {
            const minRow = this.grid.SELECTED_ROW_RANGE.startRow;
            const maxRow = this.grid.SELECTED_ROW_RANGE.endRow;
            for (let row = Math.max(minRow, startRow); row <= Math.min(maxRow, endRow); row++) {
                this.drawSingleRowHeader(row, scrollTop);
            }
        }
        else {
            const selectedRow = this.grid.SELECTED_ROW_HEADER - 1;
            if (selectedRow >= startRow && selectedRow <= endRow) {
                this.drawSingleRowHeader(selectedRow, scrollTop);
            }
        }
    }
    drawSingleRowHeader(row, scrollTop) {
        var _a;
        let rowHeight = (_a = this.grid.ROW_HEIGHTS.get(row)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_ROW_HEIGHT;
        let y1Pos = this.grid.getYPosition(row);
        let adjustedY1 = y1Pos - scrollTop;
        this.grid.context.fillStyle = "#187c44";
        this.grid.context.fillRect(0, adjustedY1, this.grid.ROW_HEADER_WIDTH, rowHeight);
        this.grid.context.fillStyle = "white";
        this.grid.context.font = "bold 18px Arial";
        this.grid.context.textAlign = "left";
        this.grid.context.textBaseline = "middle";
        const rowLabel = (row + 1).toString();
        const measuredWidth = this.grid.context.measureText(rowLabel).width;
        const paddingX = 8;
        const textX = this.grid.ROW_HEADER_WIDTH - measuredWidth - paddingX;
        this.grid.context.fillText(rowLabel, textX, adjustedY1 + rowHeight / 2);
        this.grid.context.strokeStyle = "#187c44";
        this.grid.context.lineWidth = 2;
        this.grid.context.strokeRect(0, adjustedY1, this.grid.ROW_HEADER_WIDTH, rowHeight);
    }
    updateInputPosition(scrollLeft, scrollTop) {
        var _a, _b;
        const input = document.querySelector(".cellInput");
        if (!input || input.style.display === "none")
            return;
        const row = this.grid.SELECTED_CELL_RANGE.startRow;
        const col = this.grid.SELECTED_CELL_RANGE.startCol;
        if (row === -1 || col === -1)
            return;
        const canvasRect = this.grid.canvas.getBoundingClientRect();
        const cellX = this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
        const cellY = this.grid.prefixArrayManager.getRowYPosition(row) -
            scrollTop +
            ((_a = this.grid.ROW_HEIGHTS.get(row)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_ROW_HEIGHT - this.grid.DEFAULT_ROW_HEIGHT);
        const cellWidth = (_b = this.grid.COL_WIDTHS.get(col)) !== null && _b !== void 0 ? _b : this.grid.DEFAULT_COL_WIDTH;
        const cellHeight = this.grid.DEFAULT_ROW_HEIGHT;
        input.style.left = cellX + "px";
        input.style.top = cellY + "px";
        input.style.width = cellWidth + "px";
        input.style.height = cellHeight + "px";
    }
    renderCell(row, col, value, scrollLeft, scrollTop) {
        var _a, _b;
        const x = this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
        const y = this.grid.prefixArrayManager.getRowYPosition(row) - scrollTop;
        const colWidth = this.grid.RESIZING_COL == col
            ? this.grid.RESIZING_COL_OLD_WIDTH
            : (_a = this.grid.COL_WIDTHS.get(col)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_COL_WIDTH;
        const colHeight = this.grid.RESIZING_ROW == row
            ? this.grid.RESIZING_ROW_OLD_HEIGHT
            : (_b = this.grid.ROW_HEIGHTS.get(row)) !== null && _b !== void 0 ? _b : this.grid.DEFAULT_ROW_HEIGHT;
        this.grid.context.fillStyle = "#000";
        this.grid.context.textBaseline = "middle";
        const strValue = String(value);
        const isNumber = typeof value === "number" || (!isNaN(value) && !isNaN(parseFloat(value)));
        let visibleText = "";
        let currentText = "";
        for (let i = 0; i < strValue.length; i++) {
            currentText += strValue[i];
            const width = this.grid.context.measureText(currentText).width;
            if (width <= colWidth - 10) {
                visibleText = currentText;
            }
            else {
                break;
            }
        }
        if (isNumber) {
            this.grid.context.textAlign = "right";
            this.grid.context.fillText(visibleText, x + colWidth - 5, y + colHeight - 10);
        }
        else {
            this.grid.context.textAlign = "left";
            this.grid.context.fillText(visibleText, x + 5, y + colHeight - 10);
        }
    }
    drawVisibleText(startRow, endRow, startCol, endCol, scrollLeft, scrollTop) {
        let firstRow = startRow;
        let lastRow = endRow;
        let delay = 50;
        this.grid.context.font = `${this.grid.DEFAULT_FONT_SIZE}px Arial`;
        this.grid.context.textAlign = "center";
        this.grid.context.textBaseline = "middle";
        while (firstRow <= lastRow) {
            const firstRowData = this.grid.cellDataManager.cellData.get(firstRow);
            const lastRowData = this.grid.cellDataManager.cellData.get(lastRow);
            for (let i = startCol; i <= endCol; i++) {
                // Process firstRowData
                if (firstRowData && firstRowData.has(i)) {
                    const cell1 = firstRowData.get(i);
                    const value1 = cell1 === null || cell1 === void 0 ? void 0 : cell1.value;
                    if (value1 !== undefined) {
                        this.renderCell(firstRow, i, value1, scrollLeft, scrollTop);
                    }
                }
                // Process lastRowData, only if it's a different row
                if (firstRow !== lastRow && lastRowData && lastRowData.has(i)) {
                    const cell2 = lastRowData.get(i);
                    const value2 = cell2 === null || cell2 === void 0 ? void 0 : cell2.value;
                    if (value2 !== undefined) {
                        this.renderCell(lastRow, i, value2, scrollLeft, scrollTop);
                    }
                }
            }
            firstRow++;
            lastRow--;
        }
    }
}
