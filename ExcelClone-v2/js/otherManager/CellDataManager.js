// import { Grid } from "../Grid";
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
    getCellValue(row, col) {
        const rowMap = this.cellData.get(row);
        if (!rowMap)
            return undefined;
        const cellData = rowMap.get(col);
        return cellData === null || cellData === void 0 ? void 0 : cellData.value;
    }
    showCellInputAtPosition(initialChar, input) {
        if (!input)
            return;
        this.updateInputPosition(input);
        input.style.display = "block";
        input.value = initialChar;
        this.grid.CURRENT_INPUT = initialChar;
        input.focus();
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
// interface CellData {
//     value: string;
// }
// interface LastEditedCell {
//     row: number;
//     col: number;
//     value: string | null;
// }
// export class CellDataManager {
//      cellData: Map<number,any>;
//     private grid: Grid;
//     private pendingSave: boolean;
//     private lastEditedCell: LastEditedCell | null;
//     constructor(gridObj: Grid) {
//         this.cellData = new Map();
//         this.grid = gridObj;
//         this.pendingSave = false;
//         this.lastEditedCell = null;
//     }
//     updateInputPosition(input: HTMLInputElement): void {
//         if (!input || !this.grid.SELECTED_CELL_RANGE) return;
//         const row = this.grid.SELECTED_CELL_RANGE.startRow;
//         const col = this.grid.SELECTED_CELL_RANGE.startCol;
//         const { startRow, endRow, startCol, endCol } = this.grid.getVisibleRowCols();
//         const isVisible = row >= startRow && row <= endRow && col >= startCol && col <= endCol;
//         if (!isVisible) {
//             // Just hide the input without saving
//             input.style.display = "none";
//             this.pendingSave = true;
//             this.lastEditedCell = {
//                 row: row,
//                 col: col,
//                 value: this.grid.CURRENT_INPUT
//             };
//             return;
//         }
//         // Check if we need to save the previous cell
//         if (this.pendingSave && this.lastEditedCell && 
//             (this.lastEditedCell.row !== row || this.lastEditedCell.col !== col)) {
//             // Save the previous cell's value
//             this.saveInputToSpecificCell(
//                 this.lastEditedCell.row, 
//                 this.lastEditedCell.col, 
//                 this.lastEditedCell.value
//             );
//             this.pendingSave = false;
//             this.lastEditedCell = null;
//         }
//         // Update position
//         const scrollLeft = this.grid.canvasContainer.scrollLeft;
//         const scrollTop = this.grid.canvasContainer.scrollTop;
//         const cellX = this.grid.prefixArrayManager.getColXPosition(col) - scrollLeft;
//         const cellY = this.grid.prefixArrayManager.getRowYPosition(row) - scrollTop +
//             ((this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT) -
//                 this.grid.DEFAULT_ROW_HEIGHT);
//         const cellWidth = this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
//         const cellHeight = this.grid.DEFAULT_ROW_HEIGHT;
//         const canvasOffsetTop = this.grid.canvasContainer.getBoundingClientRect().top;
//         input.style.left = cellX + "px";
//         input.style.top = cellY + canvasOffsetTop + "px";
//         input.style.width = cellWidth + "px";
//         input.style.height = cellHeight + "px";
//         input.style.display = "block";
//     }
//     showCellInputAtPosition(initialChar: string, input: HTMLInputElement): void {
//         if (!input || !this.grid.SELECTED_CELL_RANGE) return;
//         // Check if we need to save any pending cell
//         if (this.pendingSave && this.lastEditedCell) {
//             this.saveInputToSpecificCell(
//                 this.lastEditedCell.row, 
//                 this.lastEditedCell.col, 
//                 this.lastEditedCell.value
//             );
//             this.pendingSave = false;
//             this.lastEditedCell = null;
//         }
//         this.updateInputPosition(input);
//         input.style.display = "block";
//         input.value = initialChar;
//         this.grid.CURRENT_INPUT = initialChar;
//         input.focus();
//         if (initialChar.length === 1) {
//             input.setSelectionRange(1, 1);
//         } else {
//             const len = input.value.length;
//             input.setSelectionRange(len, len);
//         }
//         this.grid.canvasContainer.onscroll = () => this.updateInputPosition(input);
//     }
//     private saveInputToSpecificCell(row: number, col: number, value: string | null): void {
//         if (!this.cellData.has(row)) {
//             this.cellData.set(row, new Map());
//         }
//         const colMap = this.cellData.get(row);
//         if (!colMap) return;
//         if (!colMap.has(col)) {
//             colMap.set(col, { value: '' });
//         }
//         const cell = colMap.get(col);
//         if (cell) {
//             cell.value = value ?? '';
//         }
//     }
//     saveInputToCell(): void {
//         if (!this.grid.SELECTED_CELL_RANGE) return;
//         const row = this.grid.SELECTED_CELL_RANGE.startRow;
//         const col = this.grid.SELECTED_CELL_RANGE.startCol;
//         this.saveInputToSpecificCell(row, col, this.grid.CURRENT_INPUT);
//         this.grid.CURRENT_INPUT = null;
//         this.grid.INPUT_FINALIZED = true;
//         this.pendingSave = false;
//         this.lastEditedCell = null;
//     }
//     isVisible(): boolean {
//         if (!this.grid.SELECTED_CELL_RANGE) return false;
//         const { startRow, endRow, startCol, endCol } = this.grid.getVisibleRowCols();
//         const row = this.grid.SELECTED_CELL_RANGE.startRow;
//         const col = this.grid.SELECTED_CELL_RANGE.startCol;
//         return row >= startRow && row <= endRow && col >= startCol && col <= endCol;
//     }
//     cleanup(): void {
//         // Save any pending changes
//         if (this.pendingSave && this.lastEditedCell) {
//             this.saveInputToSpecificCell(
//                 this.lastEditedCell.row, 
//                 this.lastEditedCell.col, 
//                 this.lastEditedCell.value
//             );
//         }
//         this.pendingSave = false;
//         this.lastEditedCell = null;
//     }
// }
