export class DataDrawingTool {
    constructor(gridObj) {
        this.grid = gridObj;
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
