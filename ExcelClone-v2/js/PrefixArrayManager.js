export class PrefixArrayManager {
    constructor(grid) {
        this.rowPrefixArray = [];
        this.colPrefixArray = [];
        this.latestEndRow = -1;
        this.latestEndCol = -1;
        this.grid = grid;
    }
    createRowPrefixArray(endRow) {
        var _a;
        if (this.latestEndRow >= endRow)
            return;
        if (this.rowPrefixArray.length === 0) {
            this.rowPrefixArray[0] = this.grid.COL_HEADER_HEIGHT;
            this.latestEndRow = 0;
        }
        for (let i = this.latestEndRow + 1; i <= endRow; i++) {
            this.rowPrefixArray.push(this.rowPrefixArray[i - 1] +
                ((_a = this.grid.ROW_HEIGHTS.get(i)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_ROW_HEIGHT));
        }
        this.latestEndRow = endRow;
    }
    createColPrefixArray(endCol) {
        var _a;
        if (this.latestEndCol >= endCol)
            return;
        if (this.colPrefixArray.length === 0) {
            this.colPrefixArray[0] = this.grid.ROW_HEADER_WIDTH;
            this.latestEndCol = 0;
        }
        for (let i = this.latestEndCol + 1; i <= endCol; i++) {
            this.colPrefixArray.push(this.colPrefixArray[i - 1] + ((_a = this.grid.COL_WIDTHS.get(i)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_COL_WIDTH));
        }
        this.latestEndCol = endCol;
    }
    getColXPosition(columnIndex) {
        return this.colPrefixArray[columnIndex];
    }
    getRowYPosition(rowIndex) {
        return this.rowPrefixArray[rowIndex];
    }
    updateColumnWidth(colIndex) {
        var _a, _b;
        const oldWidth = (_a = this.grid.RESIZING_COL_OLD_WIDTH) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_COL_WIDTH;
        const widthDiff = ((_b = this.grid.COL_WIDTHS.get(colIndex)) !== null && _b !== void 0 ? _b : this.grid.DEFAULT_COL_WIDTH) - oldWidth;
        for (let i = colIndex + 1; i < this.colPrefixArray.length; i++) {
            this.colPrefixArray[i] += widthDiff;
        }
    }
    updateRowHeight(rowIndex) {
        var _a, _b;
        const oldHeight = (_a = this.grid.RESIZING_ROW_OLD_HEIGHT) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_ROW_HEIGHT;
        const heightDiff = ((_b = this.grid.ROW_HEIGHTS.get(rowIndex)) !== null && _b !== void 0 ? _b : this.grid.DEFAULT_ROW_HEIGHT) - oldHeight;
        for (let i = rowIndex + 1; i < this.rowPrefixArray.length; i++) {
            this.rowPrefixArray[i] += heightDiff;
        }
    }
    getCellPosition(row, col) {
        return {
            x: this.colPrefixArray[col],
            y: this.rowPrefixArray[row],
        };
    }
}
