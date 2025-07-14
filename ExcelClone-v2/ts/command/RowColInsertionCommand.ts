import { Grid } from "../Grid";
import { Command } from "./command";

export class RowColInsertionCommand implements Command {
  grid: Grid;
  isRow: boolean;
  atIndex: number;
  count: number;
  backup: Map<number, Map<number, { value: string }>>;

  constructor(grid: Grid, isRow: boolean, atIndex: number, count: number) {
    this.grid = grid;
    this.isRow = isRow;
    this.atIndex = atIndex;
    this.count = count;

    // Deep clone original data
    this.backup = new Map();
    for (const [row, rowMap] of this.grid.cellDataManager.cellData.entries()) {
      this.backup.set(row, new Map(rowMap));
    }
  }

  execute(): void {
    if (this.isRow) {
      this.insertRows();
    } else {
      this.insertCols();
    }
  }

  undo(): void {
    this.grid.cellDataManager.cellData = this.backup;
    this.grid.render();
  }

  insertRows(): void {
    const oldData = this.grid.cellDataManager.cellData;
    const newData = new Map<number, Map<number, { value: string }>>();

    for (const [row, rowMap] of oldData.entries()) {
      if (row >= this.atIndex) {
        newData.set(row + this.count, rowMap);
      } else {
        newData.set(row, rowMap);
      }
    }

    for (let i = 0; i < this.count; i++) {
      newData.set(this.atIndex + i, new Map());
    }

    this.grid.cellDataManager.cellData = newData;
    this.grid.render();
  }

  insertCols(): void {
    const oldData = this.grid.cellDataManager.cellData;
    const newData = new Map<number, Map<number, { value: string }>>();

    for (const [row, rowMap] of oldData.entries()) {
      const newRowMap = new Map<number, { value: string }>();

      for (const [col, cell] of rowMap.entries()) {
        if (col >= this.atIndex) {
          newRowMap.set(col + this.count, cell);
        } else {
          newRowMap.set(col, cell);
        }
      }

      for (let i = 0; i < this.count; i++) {
        newRowMap.set(this.atIndex + i, { value: "" });
      }

      newData.set(row, newRowMap);
    }

    this.grid.cellDataManager.cellData = newData;
    this.grid.render();
  }
}
