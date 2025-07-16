export class ClipboardManager {
    constructor(grid) {
        this.copiedData = null;
        this.grid = grid;
    }
    copy(range) {
        const data = [];
        for (let row = range.startRow; row <= range.endRow; row++) {
            const rowData = [];
            for (let col = range.startCol; col <= range.endCol; col++) {
                const cellValue = this.grid.cellDataManager.getCellValue(row, col);
                rowData.push(cellValue || "");
            }
            data.push(rowData);
        }
        this.copiedData = {
            data,
            sourceRange: Object.assign({}, range),
            isCut: false
        };
        console.log("Copied data:", data);
    }
    cut(range) {
        this.copy(range);
        if (this.copiedData) {
            this.copiedData.isCut = true;
        }
    }
    getCopiedData() {
        return this.copiedData;
    }
    clearClipboard() {
        this.copiedData = null;
    }
    hasCopiedData() {
        return this.copiedData !== null;
    }
}
