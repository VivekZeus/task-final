import { Grid } from './Grid';
import { Command } from './command';

// export class ResizeColumnCommand implements Command {
//     private oldWidth: number;
//     private newWidth: number;

//     constructor(
//         private grid: Grid,
//         private columnIndex: number,
//         private width: number
//     ) {
//         this.oldWidth = grid.COL_WIDTHS.get(columnIndex) ?? grid.DEFAULT_COL_WIDTH;
//         this.newWidth = width;
//     }

//     execute(): void {
//         this.grid.COL_WIDTHS.set(this.columnIndex, this.newWidth);
//         this.grid.prefixArrayManager.updateColumnWidth(this.columnIndex);
//         this.grid.render();
//     }

//     undo(): void {
//         this.grid.COL_WIDTHS.set(this.columnIndex, this.oldWidth);
//         this.grid.prefixArrayManager.updateColumnWidth(this.columnIndex);
//         this.grid.render();
//     }
// }

// export class ResizeRowCommand implements Command {
//     private oldHeight: number;
//     private newHeight: number;

//     constructor(
//         private grid: Grid,
//         private rowIndex: number,
//         private height: number
//     ) {
//         this.oldHeight = grid.ROW_HEIGHTS.get(rowIndex) ?? grid.DEFAULT_ROW_HEIGHT;
//         this.newHeight = height;
//     }

//     execute(): void {
//         this.grid.ROW_HEIGHTS.set(this.rowIndex, this.newHeight);
//         this.grid.prefixArrayManager.updateRowHeight(this.rowIndex);
//         this.grid.render();
//     }

//     undo(): void {
//         this.grid.ROW_HEIGHTS.set(this.rowIndex, this.oldHeight);
//         this.grid.prefixArrayManager.updateRowHeight(this.rowIndex);
//         this.grid.render();
//     }
// }

// import { Grid } from './Grid.js';

export class ResizeColumnCommand implements Command {
    private oldWidth: number;
    private newWidth: number;

    constructor(
        private grid: Grid,
        private columnIndex: number,
        private width: number
    ) {
        this.oldWidth = grid.COL_WIDTHS.get(columnIndex) ?? grid.DEFAULT_COL_WIDTH;
        this.newWidth = width;
    }

    execute(): void {
        // Update the column width
        this.grid.COL_WIDTHS.set(this.columnIndex, this.newWidth);
        
        // Recalculate prefix array for all columns from the changed column onwards
        for (let col = this.columnIndex; col < this.grid.TOTAL_COLUMNS; col++) {
            const prevSum = col > 0 ? 
                this.grid.prefixArrayManager.colPrefixArray[col - 1] : 0;
            const currentWidth = this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
            this.grid.prefixArrayManager.colPrefixArray[col] = prevSum + currentWidth;
        }

        this.grid.render();
    }

    undo(): void {
        // Restore the column width
        this.grid.COL_WIDTHS.set(this.columnIndex, this.oldWidth);
        
        // Recalculate prefix array after restoring old width
        for (let col = this.columnIndex; col < this.grid.TOTAL_COLUMNS; col++) {
            const prevSum = col > 0 ? 
                this.grid.prefixArrayManager.colPrefixArray[col - 1] : 0;
            const currentWidth = this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
            this.grid.prefixArrayManager.colPrefixArray[col] = prevSum + currentWidth;
        }
        
        this.grid.render();
    }
}

export class ResizeRowCommand implements Command {
    private oldHeight: number;
    private newHeight: number;

    constructor(
        private grid: Grid,
        private rowIndex: number,
        private height: number
    ) {
        this.oldHeight = grid.ROW_HEIGHTS.get(rowIndex) ?? grid.DEFAULT_ROW_HEIGHT;
        this.newHeight = height;
    }

    execute(): void {
        // Update the row height
        this.grid.ROW_HEIGHTS.set(this.rowIndex, this.newHeight);
        
        // Recalculate prefix array for all rows from the changed row onwards
        for (let row = this.rowIndex; row < this.grid.TOTAL_ROWS; row++) {
            const prevSum = row > 0 ? 
                this.grid.prefixArrayManager.rowPrefixArray[row - 1] : 0;
            const currentHeight = this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;
            this.grid.prefixArrayManager.rowPrefixArray[row] = prevSum + currentHeight;
        }

        this.grid.render();
    }

    undo(): void {
        // Restore the row height
        this.grid.ROW_HEIGHTS.set(this.rowIndex, this.oldHeight);
        
        // Recalculate prefix array after restoring old height
        for (let row = this.rowIndex; row < this.grid.TOTAL_ROWS; row++) {
            const prevSum = row > 0 ? 
                this.grid.prefixArrayManager.rowPrefixArray[row - 1] : 0;
            const currentHeight = this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;
            this.grid.prefixArrayManager.rowPrefixArray[row] = prevSum + currentHeight;
        }
        
        this.grid.render();
    }
}