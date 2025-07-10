export class CellDataRemovalStrategy {
    constructor(gridObj) {
        this.grid = gridObj;
    }
    fullRemoval() {
        const row = this.grid.SELECTED_CELL_RANGE.startRow;
        const col = this.grid.SELECTED_CELL_RANGE.startCol;
        if (this.grid.cellDataManager.cellData.has(row)) {
            const rowData = this.grid.cellDataManager.cellData.get(row);
            if (rowData && rowData.has(col)) {
                const cell = rowData.get(col);
                if (cell.value !== "") {
                    cell.value = "";
                    rowData.delete(col);
                    if (rowData.size === 0) {
                        this.grid.cellDataManager.cellData.delete(row);
                    }
                }
            }
        }
    }
    nonRemoval() {
        const row = this.grid.SELECTED_CELL_RANGE.startRow;
        const col = this.grid.SELECTED_CELL_RANGE.startCol;
        let cellValue = "";
        if (this.grid.cellDataManager.cellData.has(row)) {
            const rowData = this.grid.cellDataManager.cellData.get(row);
            if (rowData && rowData.has(col)) {
                const cell = rowData.get(col);
                if (cell.value !== "") {
                    cellValue = cell.value;
                    rowData.delete(col);
                    if (rowData.size === 0) {
                        this.grid.cellDataManager.cellData.delete(row);
                    }
                }
            }
        }
        return cellValue;
    }
}
