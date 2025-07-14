export class RowColInsertionCommand {
    constructor(grid, isRow, atIndex, count) {
        this.grid = grid;
        this.isRow = isRow;
        this.atIndex = atIndex;
        this.count = count;
        // Deep clone original data
        this.backup = new Map();
        for (const [row, rowMap] of this.grid.cellDataManager.cellData.entries()) {
            this.backup.set(row, new Map(rowMap));
        }
    }
    execute() {
        if (this.isRow) {
            this.insertRows();
        }
        else {
            this.insertCols();
        }
    }
    undo() {
        this.grid.cellDataManager.cellData = this.backup;
        this.grid.render();
    }
    insertRows() {
        const oldData = this.grid.cellDataManager.cellData;
        const newData = new Map();
        for (const [row, rowMap] of oldData.entries()) {
            if (row >= this.atIndex) {
                newData.set(row + this.count, rowMap);
            }
            else {
                newData.set(row, rowMap);
            }
        }
        for (let i = 0; i < this.count; i++) {
            newData.set(this.atIndex + i, new Map());
        }
        this.grid.cellDataManager.cellData = newData;
        this.grid.render();
    }
    insertCols() {
        const oldData = this.grid.cellDataManager.cellData;
        const newData = new Map();
        for (const [row, rowMap] of oldData.entries()) {
            const newRowMap = new Map();
            for (const [col, cell] of rowMap.entries()) {
                if (col >= this.atIndex) {
                    newRowMap.set(col + this.count, cell);
                }
                else {
                    newRowMap.set(col, cell);
                }
            }
            for (let i = 0; i < this.count; i++) {
                newRowMap.set(this.atIndex + i, { value: "" });
            }
            newData.set(row, newRowMap);
        }
        this.grid.cellDataManager.cellData = newData;
        this.grid.render();
    }
}
