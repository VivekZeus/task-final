import { Grid } from "./Grid.js";
const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("excelCanvas");
const context = canvas.getContext("2d");
const grid = new Grid(canvasContainer, canvas, context);
grid.render();
function loadJSONData(jsonArray) {
    const cellData = new Map();
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
        console.warn("Empty or invalid JSON");
        return;
    }
    // Get column headers from first row keys
    const headers = Object.keys(jsonArray[0]);
    const headerRow = new Map();
    headers.forEach((key, colIdx) => {
        headerRow.set(colIdx, { value: key });
    });
    cellData.set(0, headerRow); // header row at row 0
    // Fill data rows
    jsonArray.forEach((rowObj, rowIndex) => {
        const rowMap = new Map();
        headers.forEach((key, colIdx) => {
            var _a;
            rowMap.set(colIdx, { value: (_a = rowObj[key]) !== null && _a !== void 0 ? _a : "" });
        });
        cellData.set(rowIndex + 1, rowMap);
    });
    grid.cellDataManager.cellData = cellData;
}
fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
    loadJSONData(data);
    grid.render();
});
canvasContainer.addEventListener("scroll", (e) => {
    grid.render();
});
window.addEventListener("resize", () => {
    grid.resizeCanvas();
});
