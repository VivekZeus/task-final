export class CellDataManager {
    constructor(gridObj) {
        this.cellData = new Map();
        this.grid = gridObj;
    }
    showCellInputAtPosition(initialChar, input) {
        var _a, _b;
        if (!input || !this.grid.SELECTED_CELL_RANGE)
            return;
        const row = this.grid.SELECTED_CELL_RANGE.startRow;
        const col = this.grid.SELECTED_CELL_RANGE.startCol;
        const scrollLeft = this.grid.canvasContainer.scrollLeft;
        const scrollTop = this.grid.canvasContainer.scrollTop;
        const cellX = this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
        const cellY = this.grid.prefixArrayManager.getRowYPosition(row) - scrollTop + (((_a = this.grid.ROW_HEIGHTS.get(row)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_ROW_HEIGHT) - this.grid.DEFAULT_ROW_HEIGHT);
        const cellWidth = (_b = this.grid.COL_WIDTHS.get(col)) !== null && _b !== void 0 ? _b : this.grid.DEFAULT_COL_WIDTH;
        const cellHeight = this.grid.DEFAULT_ROW_HEIGHT;
        input.style.left = cellX + "px";
        input.style.top = cellY + "px";
        input.style.width = cellWidth + "px";
        input.style.height = cellHeight + "px";
        input.style.display = "block";
        // Set initial value and focus
        input.value = initialChar;
        this.grid.CURRENT_INPUT = initialChar;
        input.focus();
        if (initialChar.length === 1) {
            input.setSelectionRange(1, 1);
        }
        else {
            const len = input.value.length;
            input.setSelectionRange(len, len); // place cursor at end
        }
    }
    saveInputToCell() {
        const row = this.grid.SELECTED_CELL_RANGE.startRow;
        const col = this.grid.SELECTED_CELL_RANGE.startCol;
        if (!this.cellData.has(row)) {
            this.cellData.set(row, new Map());
        }
        const colMap = this.cellData.get(row);
        if (!colMap.has(col)) {
            colMap.set(col, {});
        }
        colMap.get(col).value = this.grid.CURRENT_INPUT;
        this.grid.CURRENT_INPUT = null;
        this.grid.INPUT_FINALIZED = true;
        // let textLength=context.measureText(Config.CURRENT_INPUT).width+5;
        // if(!(Config.COL_WIDTHS[col] && Config.COL_WIDTHS[col]>textLength))Config.COL_WIDTHS[col]=textLength;
        // console.log(CellDataManager.CellData);
    }
}
