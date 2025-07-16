export class PasteCommand {
    constructor(grid, targetRange) {
        this.previousData = [];
        this.pastedData = [];
        this.grid = grid;
        this.targetRange = targetRange;
    }
    execute() {
        var _a;
        const copiedData = this.grid.clipboardManager.getCopiedData();
        if (!copiedData) {
            console.log("No data to paste");
            return;
        }
        this.pastedData = copiedData.data;
        this.previousData = [];
        // Calculate paste range based on copied data size
        const rowCount = this.pastedData.length;
        const colCount = ((_a = this.pastedData[0]) === null || _a === void 0 ? void 0 : _a.length) || 0;
        const endRow = this.targetRange.startRow + rowCount - 1;
        const endCol = this.targetRange.startCol + colCount - 1;
        // Store previous data for undo
        for (let row = this.targetRange.startRow; row <= endRow; row++) {
            const rowData = [];
            for (let col = this.targetRange.startCol; col <= endCol; col++) {
                const cellValue = this.grid.cellDataManager.getCellValue(row, col);
                rowData.push(cellValue || "");
            }
            this.previousData.push(rowData);
        }
        // Paste the data
        let dataRowIndex = 0;
        for (let row = this.targetRange.startRow; row <= endRow; row++) {
            let dataColIndex = 0;
            for (let col = this.targetRange.startCol; col <= endCol; col++) {
                const value = this.pastedData[dataRowIndex][dataColIndex];
                this.grid.cellDataManager.setCellValue(row, col, value);
                dataColIndex++;
            }
            dataRowIndex++;
        }
        // If it was a cut operation, clear the source after pasting
        if (copiedData.isCut) {
            for (let row = copiedData.sourceRange.startRow; row <= copiedData.sourceRange.endRow; row++) {
                for (let col = copiedData.sourceRange.startCol; col <= copiedData.sourceRange.endCol; col++) {
                    this.grid.cellDataManager.setCellValue(row, col, "");
                }
            }
            this.grid.clipboardManager.clearClipboard();
        }
        // Update the target range for undo
        this.targetRange.endRow = endRow;
        this.targetRange.endCol = endCol;
    }
    undo() {
        // Restore previous data
        let dataRowIndex = 0;
        for (let row = this.targetRange.startRow; row <= this.targetRange.endRow; row++) {
            let dataColIndex = 0;
            for (let col = this.targetRange.startCol; col <= this.targetRange.endCol; col++) {
                const value = this.previousData[dataRowIndex][dataColIndex];
                this.grid.cellDataManager.setCellValue(row, col, value);
                dataColIndex++;
            }
            dataRowIndex++;
        }
    }
}
