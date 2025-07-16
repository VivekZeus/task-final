export class CutCommand {
    constructor(grid, range) {
        this.previousData = [];
        this.grid = grid;
        this.range = range;
    }
    execute() {
        // Store previous data for undo
        this.previousData = [];
        for (let row = this.range.startRow; row <= this.range.endRow; row++) {
            const rowData = [];
            for (let col = this.range.startCol; col <= this.range.endCol; col++) {
                const cellValue = this.grid.cellDataManager.getCellValue(row, col);
                rowData.push(cellValue || "");
            }
            this.previousData.push(rowData);
        }
        // Copy to clipboard
        this.grid.clipboardManager.cut(this.range);
        // Clear the source cells
        for (let row = this.range.startRow; row <= this.range.endRow; row++) {
            for (let col = this.range.startCol; col <= this.range.endCol; col++) {
                this.grid.cellDataManager.setCellValue(row, col, "");
            }
        }
    }
    undo() {
        // Restore previous data
        let dataRowIndex = 0;
        for (let row = this.range.startRow; row <= this.range.endRow; row++) {
            let dataColIndex = 0;
            for (let col = this.range.startCol; col <= this.range.endCol; col++) {
                const value = this.previousData[dataRowIndex][dataColIndex];
                this.grid.cellDataManager.setCellValue(row, col, value);
                dataColIndex++;
            }
            dataRowIndex++;
        }
    }
}
