import { Grid } from "./Grid.js";

const canvasContainer = document.getElementById(
  "canvasContainer"
) as HTMLDivElement;
const canvas = document.getElementById("excelCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;


const grid = new Grid(canvasContainer, canvas, context);
grid.render();

function loadJSONData(jsonArray: any) {
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
      rowMap.set(colIdx, { value: rowObj[key] ?? "" });
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

