import { Grid } from "./Grid.js";

// ClipboardManager.ts
export interface CopiedData {
  data: Array<Array<string>>;
  sourceRange: {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  };
  isCut: boolean;
}

export class ClipboardManager {
  private copiedData: CopiedData | null = null;
  private grid: Grid;

  constructor(grid: Grid) {
    this.grid = grid;
  }

  copy(range: { startRow: number; endRow: number; startCol: number; endCol: number }): void {
    const data: Array<Array<string>> = [];
    
    for (let row = range.startRow; row <= range.endRow; row++) {
      const rowData: Array<string> = [];
      for (let col = range.startCol; col <= range.endCol; col++) {
        const cellValue = this.grid.cellDataManager.getCellValue(row, col);
        rowData.push(cellValue || "");
      }
      data.push(rowData);
    }

    this.copiedData = {
      data,
      sourceRange: { ...range },
      isCut: false
    };

    console.log("Copied data:", data);
  }

  cut(range: { startRow: number; endRow: number; startCol: number; endCol: number }): void {
    this.copy(range);
    if (this.copiedData) {
      this.copiedData.isCut = true;
    }
  }

  getCopiedData(): CopiedData | null {
    return this.copiedData;
  }

  clearClipboard(): void {
    this.copiedData = null;
  }

  hasCopiedData(): boolean {
    return this.copiedData !== null;
  }
}