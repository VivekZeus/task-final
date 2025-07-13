var _a, _b, _c, _d;
import { Grid } from "./Grid.js";
const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("excelCanvas");
const context = canvas.getContext("2d");
const grid = new Grid(canvasContainer, canvas, context);
grid.render();
canvasContainer.addEventListener("scroll", (e) => {
    grid.render();
});
window.addEventListener("resize", () => {
    grid.resizeCanvas();
});
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
