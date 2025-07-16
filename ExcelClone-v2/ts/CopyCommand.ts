import { Command } from "./command/command.js";
import { Grid } from "./Grid.js";

export class CopyCommand implements Command {
  private grid: Grid;
  private range: { startRow: number; endRow: number; startCol: number; endCol: number };

  constructor(grid: Grid, range: { startRow: number; endRow: number; startCol: number; endCol: number }) {
    this.grid = grid;
    this.range = range;
  }

  execute(): void {
    this.grid.clipboardManager.copy(this.range);
  }

  undo(): void {
    // Copy operations don't need to be undone
    this.grid.clipboardManager.clearClipboard();
  }
}