import { InputCommand } from "../command/InputCommand.js";
export class CellDataManager {
    constructor(gridObj) {
        this.cellData = new Map();
        this.grid = gridObj;
    }
    updateInputPosition(input) {
        var _a, _b;
        if (!input)
            return;
        console.log("came in event listnerr");
        const row = this.grid.SELECTED_CELL_RANGE.startRow;
        const col = this.grid.SELECTED_CELL_RANGE.startCol;
        const isVisible = this.grid.isVisible();
        if (!isVisible) {
            input.style.display = "none";
            return;
        }
        const scrollLeft = this.grid.canvasContainer.scrollLeft;
        const scrollTop = this.grid.canvasContainer.scrollTop;
        const cellX = this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
        const cellY = this.grid.prefixArrayManager.getRowYPosition(row) -
            scrollTop +
            (((_a = this.grid.ROW_HEIGHTS.get(row)) !== null && _a !== void 0 ? _a : this.grid.DEFAULT_ROW_HEIGHT) -
                this.grid.DEFAULT_ROW_HEIGHT);
        const cellWidth = (_b = this.grid.COL_WIDTHS.get(col)) !== null && _b !== void 0 ? _b : this.grid.DEFAULT_COL_WIDTH;
        const cellHeight = this.grid.DEFAULT_ROW_HEIGHT;
        const canvasOffsetTop = this.grid.canvasContainer.getBoundingClientRect().top;
        input.style.left = cellX + "px";
        input.style.top = cellY + canvasOffsetTop + "px";
        input.style.width = cellWidth + "px";
        input.style.height = cellHeight + "px";
        input.style.display = "block";
    }
    clearInputState() {
        this.grid.CURRENT_INPUT = null;
        this.grid.INPUT_FINALIZED = false;
    }
    getCellValue(row, col) {
        const rowMap = this.cellData.get(row);
        if (!rowMap)
            return undefined;
        const cellData = rowMap.get(col);
        return cellData === null || cellData === void 0 ? void 0 : cellData.value;
    }
    // Basic setCellValue function
    setCellValue(row, col, value) {
        // Get or create the row map
        let rowMap = this.cellData.get(row);
        if (!rowMap) {
            rowMap = new Map();
            this.cellData.set(row, rowMap);
        }
        // Get existing cell data or create new one
        let cellData = rowMap.get(col);
        if (!cellData) {
            cellData = { value: "" }; // Initialize with empty value or your default cell structure
            rowMap.set(col, cellData);
        }
        // Set the new value
        cellData.value = value;
    }
    // showCellInputAtPosition(initialChar: string, input: HTMLInputElement) {
    //   if (!input) return;
    //   this.updateInputPosition(input);
    //   input.style.display = "block";
    //   input.value = initialChar;
    //   this.grid.CURRENT_INPUT = initialChar;
    //   input.focus();
    //   if (initialChar.length === 1) {
    //     input.setSelectionRange(1, 1);
    //   } else {
    //     const len = input.value.length;
    //     input.setSelectionRange(len, len);
    //   }
    //   this.grid.canvasContainer.onscroll = () => this.updateInputPosition(input);
    // }
    // showCellInputAtPosition(initialChar: string, input: HTMLInputElement) {
    //   if (!input) return;
    //   if (!this.grid.INPUT_FINALIZED && this.grid.CURRENT_INPUT != null) {
    //     this.saveInputToCell();
    //   }
    //   input.value = ""; // Clear any leftover value first
    //   input.style.display = "block";
    //   this.updateInputPosition(input);
    //   input.value = initialChar;
    //   this.grid.CURRENT_INPUT = initialChar;
    //   this.grid.INPUT_FINALIZED = false;
    //   input.focus();
    //   input.setSelectionRange(initialChar.length, initialChar.length);
    //   this.grid.canvasContainer.onscroll = () => this.updateInputPosition(input);
    // }
    showCellInputAtPosition(initialChar, input) {
        if (!input)
            return;
        if (!this.grid.INPUT_FINALIZED && this.grid.CURRENT_INPUT != null) {
            let row = this.grid.SELECTED_CELL_RANGE.startRow;
            let col = this.grid.SELECTED_CELL_RANGE.startCol;
            let prev = this.grid.cellDataManager.getCellValue(row, col);
            let recent = this.grid.CURRENT_INPUT;
            let command = new InputCommand(this.grid, row, col, prev, recent);
            this.grid.commandManager.execute(command);
        }
        input.value = ""; // Clear any leftover value first
        input.style.display = "block";
        this.updateInputPosition(input);
        input.value = initialChar;
        this.grid.CURRENT_INPUT = initialChar;
        this.grid.INPUT_FINALIZED = false;
        input.focus();
        // Set cursor position based on initialChar length
        if (initialChar.length === 1) {
            input.setSelectionRange(1, 1);
        }
        else {
            const len = input.value.length;
            input.setSelectionRange(len, len);
        }
        this.grid.canvasContainer.onscroll = () => this.updateInputPosition(input);
    }
    saveInputToCell() {
        if (this.grid.CURRENT_INPUT == null)
            return;
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
