var _a, _b, _c, _d;
import { Grid } from "./Grid.js";
const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("excelCanvas");
const context = canvas.getContext("2d");
const grid = new Grid(canvasContainer, canvas, context);
grid.render();
// function loadJSONData(jsonArray: any) {
//   const cellData = new Map();
//   if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
//     console.warn("Empty or invalid JSON");
//     return;
//   }
//   // Get column headers from first row keys
//   const headers = Object.keys(jsonArray[0]);
//   const headerRow = new Map();
//   headers.forEach((key, colIdx) => {
//     headerRow.set(colIdx, { value: key });
//   });
//   cellData.set(0, headerRow); // header row at row 0
//   // Fill data rows
//   jsonArray.forEach((rowObj, rowIndex) => {
//     const rowMap = new Map();
//     headers.forEach((key, colIdx) => {
//       rowMap.set(colIdx, { value: rowObj[key] ?? "" });
//     });
//     cellData.set(rowIndex + 1, rowMap);
//   });
//   grid.cellDataManager.cellData = cellData;
//   grid.render();
// }
// function loadCSVData(csvText: string) {
//   const cellData = new Map<number, Map<number, { value: string }>>();
//   const rows = csvText.trim().split("\n").map((line) => line.split(","));
//   if (rows.length === 0 || rows[0].length === 0) {
//     console.warn("Empty or invalid CSV");
//     return;
//   }
//   // Process each row
//   rows.forEach((cols, rowIndex) => {
//     const rowMap = new Map<number, { value: string }>();
//     cols.forEach((cell, colIndex) => {
//       rowMap.set(colIndex, { value: cell.trim() });
//     });
//     cellData.set(rowIndex, rowMap);
//   });
//   grid.cellDataManager.cellData = cellData;
//   grid.render();
// }
canvasContainer.addEventListener("scroll", (e) => {
    grid.render();
});
window.addEventListener("resize", () => {
    grid.resizeCanvas();
});
// const jsonInput = document.getElementById('jsonInput') as HTMLInputElement;
// jsonInput.addEventListener('change', (event: Event) => {
//   const target = event.target as HTMLInputElement;
//   const file = target.files?.[0];
//   if (!file) return;
//   const reader = new FileReader();
//   reader.onload = (e: ProgressEvent<FileReader>) => {
//     try {
//       const result = e.target?.result as string;
//      loadJSONData( JSON.parse(result));
//     } catch (error) {
//       console.error('Error parsing JSON:', error);
//     }
//   };
//   reader.onerror = () => {
//     console.error('Error reading file:', reader.error);
//   };
//   reader.readAsText(file);
// });
// const csvInput = document.getElementById('csvInput') as HTMLInputElement;
// csvInput.addEventListener('change', (event: Event) => {
//   const target = event.target as HTMLInputElement;
//   const file = target.files?.[0];
//   if (!file) return;
//   const reader = new FileReader();
//   reader.onload = (e: ProgressEvent<FileReader>) => {
//     const result = e.target?.result as string;
//     loadCSVData(result);
//   };
//   reader.onerror = () => {
//     console.error('Error reading CSV file:', reader.error);
//   };
//   reader.readAsText(file);
// });
function insertRows(atRow, count) {
    const oldData = grid.cellDataManager.cellData;
    const newData = new Map();
    // Shift rows below down by `count`
    for (const [row, rowMap] of oldData.entries()) {
        if (row >= atRow) {
            newData.set(row + count, rowMap);
        }
        else {
            newData.set(row, rowMap);
        }
    }
    // Insert `count` empty rows
    for (let i = 0; i < count; i++) {
        newData.set(atRow + i, new Map());
    }
    grid.cellDataManager.cellData = newData;
    grid.render();
}
(_a = document.getElementById("addRowAbove")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const range = grid.SELECTED_CELL_RANGE;
    if (!range)
        return;
    const startRow = Math.min(range.startRow, range.endRow);
    const rowCount = Math.abs(range.endRow - range.startRow) + 1;
    insertRows(startRow, rowCount);
});
(_b = document.getElementById("addRowBelow")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    const range = grid.SELECTED_CELL_RANGE;
    if (!range)
        return;
    const endRow = Math.max(range.startRow, range.endRow);
    const rowCount = Math.abs(range.endRow - range.startRow) + 1;
    insertRows(endRow + 1, rowCount);
});
function insertCols(atCol, count) {
    const oldData = grid.cellDataManager.cellData;
    const newData = new Map();
    for (const [row, rowMap] of oldData.entries()) {
        const newRowMap = new Map();
        for (const [col, cell] of rowMap.entries()) {
            if (col >= atCol) {
                newRowMap.set(col + count, cell);
            }
            else {
                newRowMap.set(col, cell);
            }
        }
        // Insert `count` empty cells
        for (let i = 0; i < count; i++) {
            newRowMap.set(atCol + i, { value: "" });
        }
        newData.set(row, newRowMap);
    }
    grid.cellDataManager.cellData = newData;
    grid.render();
}
(_c = document.getElementById("addColLeft")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    const range = grid.SELECTED_CELL_RANGE;
    if (!range)
        return;
    const startCol = Math.min(range.startCol, range.endCol);
    const colCount = Math.abs(range.endCol - range.startCol) + 1;
    insertCols(startCol, colCount);
});
(_d = document.getElementById("addColRight")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
    const range = grid.SELECTED_CELL_RANGE;
    if (!range)
        return;
    const endCol = Math.max(range.startCol, range.endCol);
    const colCount = Math.abs(range.endCol - range.startCol) + 1;
    insertCols(endCol + 1, colCount);
});
