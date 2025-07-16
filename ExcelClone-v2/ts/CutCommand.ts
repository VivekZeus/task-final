// Commands/CutCommand.ts
import { Command } from "./command/command.js";
import { Grid } from "./Grid.js";

export class CutCommand implements Command {
  private grid: Grid;
  private range: { startRow: number; endRow: number; startCol: number; endCol: number };
  private previousData: Array<Array<string>> = [];

  constructor(grid: Grid, range: { startRow: number; endRow: number; startCol: number; endCol: number }) {
    this.grid = grid;
    this.range = range;
  }

  execute(): void {
    // Store previous data for undo
    this.previousData = [];
    for (let row = this.range.startRow; row <= this.range.endRow; row++) {
      const rowData: Array<string> = [];
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

  undo(): void {
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