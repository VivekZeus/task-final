
import { Grid } from "../Grid.js";

export class PrefixArrayManager {

    public rowPrefixArray:Array<number>=[];
    public colPrefixArray :Array<number>=[];
    public latestEndRow = -1;
    public latestEndCol = -1;
    public grid:Grid;

  constructor(grid:Grid) {
    this.grid=grid;
  }

  createRowPrefixArray(endRow:number) :void{
    if (this.latestEndRow >= endRow) return;
    if (this.rowPrefixArray.length === 0) {
      this.rowPrefixArray[0] = this.grid.COL_HEADER_HEIGHT;
      this.latestEndRow = 0;
    }

    for (let i = this.latestEndRow + 1; i <= endRow; i++) {
      this.rowPrefixArray.push(
        this.rowPrefixArray[i - 1] +
          (this.grid.ROW_HEIGHTS.get(i) ?? this.grid.DEFAULT_ROW_HEIGHT)
      );
    }
    this.latestEndRow = endRow;
  }

  createColPrefixArray(endCol:number) {
    if (this.latestEndCol >= endCol) return;
    if (this.colPrefixArray.length === 0) {
      this.colPrefixArray[0] = this.grid.ROW_HEADER_WIDTH;
      this.latestEndCol = 0;
    }

    for (let i = this.latestEndCol + 1; i <= endCol; i++) {
      this.colPrefixArray.push(
        this.colPrefixArray[i - 1] + (this.grid.COL_WIDTHS.get(i) ?? this.grid.DEFAULT_COL_WIDTH)
      );
    }

    this.latestEndCol = endCol;
  }

  getColXPosition(columnIndex:number) {
    return this.colPrefixArray[columnIndex];
  }

  getRowYPosition(rowIndex:number) {
    return this.rowPrefixArray[rowIndex];
  }

  updateColumnWidth(colIndex:number) {
    const oldWidth = this.grid.RESIZING_COL_OLD_WIDTH?? this.grid.DEFAULT_COL_WIDTH;
    const widthDiff =
      (this.grid.COL_WIDTHS.get(colIndex) ?? this.grid.DEFAULT_COL_WIDTH) - oldWidth;

    for (let i = colIndex + 1; i < this.colPrefixArray.length; i++) {
      this.colPrefixArray[i] += widthDiff;
    }
  }

  updateRowHeight(rowIndex:number) {
    const oldHeight = this.grid.RESIZING_ROW_OLD_HEIGHT ?? this.grid.DEFAULT_ROW_HEIGHT;
    const heightDiff =
      (this.grid.ROW_HEIGHTS.get(rowIndex) ??this.grid.DEFAULT_ROW_HEIGHT) - oldHeight;

    for (let i = rowIndex + 1; i < this.rowPrefixArray.length; i++) {
      this.rowPrefixArray[i] += heightDiff;
    }
  }

  getCellPosition(row:number, col:number){
    return {
      x: this.colPrefixArray[col],
      y: this.rowPrefixArray[row],
    };
  }
}


// export class PrefixArrayManager {
//     public colPrefixArray: Map<number, number> = new Map();
//     public rowPrefixArray: Map<number, number> = new Map();
//     grid:Grid;

//     constructor(grid: Grid) {
//       this.grid=grid;
//         this.initializePrefixArrays();
//     }

//     private initializePrefixArrays(): void {
//         // Initialize column prefix array
//         let colSum = 0;
//         for (let col = 0; col < this.grid.TOTAL_COLUMNS; col++) {
//             colSum += this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
//             this.colPrefixArray.set(col, colSum);
//         }

//         // Initialize row prefix array
//         let rowSum = 0;
//         for (let row = 0; row < this.grid.TOTAL_ROWS; row++) {
//             rowSum += this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;
//             this.rowPrefixArray.set(row, rowSum);
//         }
//     }

//     public updateColumnPrefix(fromIndex: number): void {
//         let sum = fromIndex > 0 ? this.colPrefixArray.get(fromIndex - 1) ?? 0 : 0;
//         for (let col = fromIndex; col < this.grid.TOTAL_COLUMNS; col++) {
//             sum += this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;
//             this.colPrefixArray.set(col, sum);
//         }
//     }

//     public updateRowPrefix(fromIndex: number): void {
//         let sum = fromIndex > 0 ? this.rowPrefixArray.get(fromIndex - 1) ?? 0 : 0;
//         for (let row = fromIndex; row < this.grid.TOTAL_ROWS; row++) {
//             sum += this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;
//             this.rowPrefixArray.set(row, sum);
//         }
//     }

//     public getColXPosition(colIndex: number): number {
//         return this.colPrefixArray.get(colIndex) ?? 0;
//     }

//     public getRowYPosition(rowIndex: number): number {
//         return this.rowPrefixArray.get(rowIndex) ?? 0;
//     }

//     // Helper method to create a deep copy of prefix arrays for undo/redo
//     public clonePrefixArrays(): {
//         colPrefixArray: Map<number, number>,
//         rowPrefixArray: Map<number, number>
//     } {
//         return {
//             colPrefixArray: new Map(this.colPrefixArray),
//             rowPrefixArray: new Map(this.rowPrefixArray)
//         };
//     }

//     getCellPosition(row:number,col:number){
//       const x=this.colPrefixArray.get(col) ?? 0;
//       const y=this.rowPrefixArray.get(row) ?? 0;
//       return {x,y};
//     }
// }