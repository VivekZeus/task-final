import { Grid } from "./Grid.js";

const canvasContainer = document.getElementById(
  "canvasContainer"
) as HTMLDivElement;
const canvas = document.getElementById("excelCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const grid = new Grid(canvasContainer, canvas, context);
grid.render();

canvasContainer.addEventListener("scroll", (e) => {
  grid.render();
});

window.addEventListener("resize", () => {
  grid.resizeCanvas();
});

// import { RowColInsertionCommand } from "./RowColInsertionCommand.js";

// document.getElementById("addRowAbove")?.addEventListener("click", () => {
//   const range = grid.SELECTED_CELL_RANGE;
//   if (!range) return;
//   const startRow = Math.min(range.startRow, range.endRow);
//   const count = Math.abs(range.endRow - range.startRow) + 1;
//   grid.commandManager.execute(
//     new RowColInsertionCommand(grid, true, startRow, count)
//   );
// });

// document.getElementById("addRowBelow")?.addEventListener("click", () => {
//   const range = grid.SELECTED_CELL_RANGE;
//   if (!range) return;
//   const endRow = Math.max(range.startRow, range.endRow);
//   const count = Math.abs(range.endRow - range.startRow) + 1;
//   grid.commandManager.execute(
//     new RowColInsertionCommand(grid, true, endRow + 1, count)
//   );
// });

// document.getElementById("addColLeft")?.addEventListener("click", () => {
//   const range = grid.SELECTED_CELL_RANGE;
//   if (!range) return;
//   const startCol = Math.min(range.startCol, range.endCol);
//   const count = Math.abs(range.endCol - range.startCol) + 1;
//   grid.commandManager.execute(
//     new RowColInsertionCommand(grid, false, startCol, count)
//   );
// });

// document.getElementById("addColRight")?.addEventListener("click", () => {
//   const range = grid.SELECTED_CELL_RANGE;
//   if (!range) return;
//   const endCol = Math.max(range.startCol, range.endCol);
//   const count = Math.abs(range.endCol - range.startCol) + 1;
//   grid.commandManager.execute(
//     new RowColInsertionCommand(grid, false, endCol + 1, count)
//   );
// });

// function insertRows(atRow: number, count: number): void {
//   const oldData = grid.cellDataManager.cellData;
//   const newData = new Map<number, Map<number, { value: string }>>();

//   // Shift rows below down by `count`
//   for (const [row, rowMap] of oldData.entries()) {
//     if (row >= atRow) {
//       newData.set(row + count, rowMap);
//     } else {
//       newData.set(row, rowMap);
//     }
//   }

//   // Insert `count` empty rows
//   for (let i = 0; i < count; i++) {
//     newData.set(atRow + i, new Map());
//   }

//   grid.cellDataManager.cellData = newData;
//   grid.render();
// }

// document.getElementById("addRowAbove")?.addEventListener("click", () => {
//   const range = grid.SELECTED_CELL_RANGE;
//   if (!range) return;

//   const startRow = Math.min(range.startRow, range.endRow);
//   const rowCount = Math.abs(range.endRow - range.startRow) + 1;
//   insertRows(startRow, rowCount);
// });

// document.getElementById("addRowBelow")?.addEventListener("click", () => {
//   const range = grid.SELECTED_CELL_RANGE;
//   if (!range) return;

//   const endRow = Math.max(range.startRow, range.endRow);
//   const rowCount = Math.abs(range.endRow - range.startRow) + 1;
//   insertRows(endRow + 1, rowCount);
// });

// function insertCols(atCol: number, count: number): void {
//   const oldData = grid.cellDataManager.cellData;
//   const newData = new Map<number, Map<number, { value: string }>>();

//   for (const [row, rowMap] of oldData.entries()) {
//     const newRowMap = new Map<number, { value: string }>();

//     for (const [col, cell] of rowMap.entries()) {
//       if (col >= atCol) {
//         newRowMap.set(col + count, cell);
//       } else {
//         newRowMap.set(col, cell);
//       }
//     }

//     // Insert `count` empty cells
//     for (let i = 0; i < count; i++) {
//       newRowMap.set(atCol + i, { value: "" });
//     }

//     newData.set(row, newRowMap);
//   }

//   grid.cellDataManager.cellData = newData;
//   grid.render();
// }

// document.getElementById("addColLeft")?.addEventListener("click", () => {
//   const range = grid.SELECTED_CELL_RANGE;
//   if (!range) return;

//   const startCol = Math.min(range.startCol, range.endCol);
//   const colCount = Math.abs(range.endCol - range.startCol) + 1;
//   insertCols(startCol, colCount);
// });

// document.getElementById("addColRight")?.addEventListener("click", () => {
//   const range = grid.SELECTED_CELL_RANGE;
//   if (!range) return;

//   const endCol = Math.max(range.startCol, range.endCol);
//   const colCount = Math.abs(range.endCol - range.startCol) + 1;
//   insertCols(endCol + 1, colCount);
// });
