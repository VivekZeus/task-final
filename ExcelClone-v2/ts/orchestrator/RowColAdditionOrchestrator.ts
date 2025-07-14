import { Grid } from "../Grid.js";
import { RowColInsertionCommand } from "../command/RowColInsertionCommand.js";

export class RowColAdditionOrchestrator {
  grid: Grid;

  constructor(grid: Grid) {
    this.grid = grid;
    this.setupEvents();
  }

  private setupEvents() {
  document.getElementById("addRowAbove")?.addEventListener("click", () => this.handleRowAddAbove());
  document.getElementById("addRowBelow")?.addEventListener("click", () => this.handleRowAddBelow());
  document.getElementById("addColLeft")?.addEventListener("click", () => this.handleColAddLeft());
  document.getElementById("addColRight")?.addEventListener("click", () => this.handleColAddRight());


}

  private handleRowAddAbove() {
    const range = this.grid.SELECTED_CELL_RANGE;
    if (!range) return;
    const startRow = Math.min(range.startRow, range.endRow);
    const count = Math.abs(range.endRow - range.startRow) + 1;
    this.grid.commandManager.execute(
      new RowColInsertionCommand(this.grid, true, startRow, count)
    );
  }
  private handleRowAddBelow() {
    const range = this.grid.SELECTED_CELL_RANGE;
    if (!range) return;
    const endRow = Math.max(range.startRow, range.endRow);
    const count = Math.abs(range.endRow - range.startRow) + 1;
    this.grid.commandManager.execute(
      new RowColInsertionCommand(this.grid, true, endRow + 1, count)
    );
  }

  private handleColAddRight() {
    const range = this.grid.SELECTED_CELL_RANGE;
    if (!range) return;
    const endCol = Math.max(range.startCol, range.endCol);
    const count = Math.abs(range.endCol - range.startCol) + 1;
    this.grid.commandManager.execute(
      new RowColInsertionCommand(this.grid, false, endCol + 1, count)
    );
  }
  private handleColAddLeft() {
    const range = this.grid.SELECTED_CELL_RANGE;
    if (!range) return;
    const startCol = Math.min(range.startCol, range.endCol);
    const count = Math.abs(range.endCol - range.startCol) + 1;
    this.grid.commandManager.execute(
      new RowColInsertionCommand(this.grid, false, startCol, count)
    );
  }
}
