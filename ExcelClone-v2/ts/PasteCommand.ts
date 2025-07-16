// Commands/PasteCommand.ts
import { Command } from "./command/command.js";
import { Grid } from "./Grid.js";

export class PasteCommand implements Command {
  private grid: Grid;
  private targetRange: { startRow: number; endRow: number; startCol: number; endCol: number };
  private previousData: Array<Array<string>> = [];
  private pastedData: Array<Array<string>> = [];

  constructor(grid: Grid, targetRange: { startRow: number; endRow: number; startCol: number; endCol: number }) {
    this.grid = grid;
    this.targetRange = targetRange;
  }

  execute(): void {
    const copiedData = this.grid.clipboardManager.getCopiedData();
    if (!copiedData) {
      console.log("No data to paste");
      return;
    }

    this.pastedData = copiedData.data;
    this.previousData = [];

    // Calculate paste range based on copied data size
    const rowCount = this.pastedData.length;
    const colCount = this.pastedData[0]?.length || 0;
    
    const endRow = this.targetRange.startRow + rowCount - 1;
    const endCol = this.targetRange.startCol + colCount - 1;

    // Store previous data for undo
    for (let row = this.targetRange.startRow; row <= endRow; row++) {
      const rowData: Array<string> = [];
      for (let col = this.targetRange.startCol; col <= endCol; col++) {
        const cellValue = this.grid.cellDataManager.getCellValue(row, col);
        rowData.push(cellValue || "");
      }
      this.previousData.push(rowData);
    }

    // Paste the data
    let dataRowIndex = 0;
    for (let row = this.targetRange.startRow; row <= endRow; row++) {
      let dataColIndex = 0;
      for (let col = this.targetRange.startCol; col <= endCol; col++) {
        const value = this.pastedData[dataRowIndex][dataColIndex];
        this.grid.cellDataManager.setCellValue(row, col, value);
        dataColIndex++;
      }
      dataRowIndex++;
    }

    // If it was a cut operation, clear the source after pasting
    if (copiedData.isCut) {
      for (let row = copiedData.sourceRange.startRow; row <= copiedData.sourceRange.endRow; row++) {
        for (let col = copiedData.sourceRange.startCol; col <= copiedData.sourceRange.endCol; col++) {
          this.grid.cellDataManager.setCellValue(row, col, "");
        }
      }
      this.grid.clipboardManager.clearClipboard();
    }

    // Update the target range for undo
    this.targetRange.endRow = endRow;
    this.targetRange.endCol = endCol;
  }

  undo(): void {
    // Restore previous data
    let dataRowIndex = 0;
    for (let row = this.targetRange.startRow; row <= this.targetRange.endRow; row++) {
      let dataColIndex = 0;
      for (let col = this.targetRange.startCol; col <= this.targetRange.endCol; col++) {
        const value = this.previousData[dataRowIndex][dataColIndex];
        this.grid.cellDataManager.setCellValue(row, col, value);
        dataColIndex++;
      }
      dataRowIndex++;
    }
  }
}
