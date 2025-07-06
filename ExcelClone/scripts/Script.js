import { Grid } from "./Grid.js";
import { Config } from "./Config.js";
import { MouseHoverHandler } from "./MouseHoverHandler.js";
import { ArrowKeyHandler } from "./ArrowKeyHandler.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { Draw } from "./Draw.js";
import { ColumnResizingManager } from "./ColumnResizingManager.js";
import { RowResizingManager } from "./RowResizingManager.js";
import { CellSelectionManager } from "./CellSelectionManager.js";
import { HeaderSelectionManager } from "./HeaderSelectionManager.js";
import { ColHeaderSelector } from "./ColHeaderSelector.js";
import { RowHeaderSelector } from "./RowHeaderSelector.js";
import { CellDataManager } from "./CellDataManager.js";

const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("excelCanvas");
const context = canvas.getContext("2d");

const keySet = new Set(["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"]);
const otherKeySet = new Set(["Enter", "Tab"]);

function getXY(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

PrefixArrayManager.createColPrefixArray(Config.TOTAL_COLUMNS);
PrefixArrayManager.createRowPrefixArray(Config.TOTAL_ROWS);

const grid = new Grid(
  canvasContainer,
  canvas,
  context,
  Config.TOTAL_ROWS,
  Config.TOTAL_COLUMNS,
  Config.COL_WIDTH,
  Config.ROW_HEIGHT
);

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
            rowMap.set(colIdx, { value: rowObj[key] ?? "" });
        });
        cellData.set(rowIndex + 1, rowMap);
    });

    // Assign to your manager
    CellDataManager.CellData = cellData;
}

fetch("scripts/data.json")
  .then(res => res.json())
  .then(data => {
  loadJSONData(data);
  grid.render();
  });


canvasContainer.addEventListener("scroll", (e) => {
  grid.render();
});

window.addEventListener("resize", () => {
  grid.resizeCanvas();
});

window.addEventListener("keydown", (event) => {
  let key = event.key;

 const input = document.querySelector('.cellInput');
  if (input && window.getComputedStyle(input).display !== 'none') {
    return;
  }
  event.preventDefault();

  if(otherKeySet.has(key)){
    if(ArrowKeyHandler.handleTabEnterKeyOperations(key,event.shiftKey)) grid.render();
  }
  else if (ColHeaderSelector.handleKeyboardSelection(event)) {
    grid.render();
  }

  else if (RowHeaderSelector.handleKeyboardSelection(event)) {
    grid.render();
  }

  else if(event.shiftKey && keySet.has(key) && ArrowKeyHandler.ifCellRangeCanShift(key)){
    ArrowKeyHandler.handleShiftAndArrowKeyOperations(key);
    grid.render()
  }

  else if (keySet.has(key)) {
    if (ArrowKeyHandler.handleArrowKeyOperations(key)) grid.render();
  }

  else if (
    (/^[a-zA-Z0-9]$/.test(key) ||                
    /^[~`!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]$/.test(key)) && 
    Config.SELECTED_CELL_RANGE != null
  ) {
    CellDataManager.showCellInputAtPosition(key,input,canvasContainer);
    grid.render();
  }
});

canvas.addEventListener("mousedown", (e) => {
 
  if (Config.HOVERED_COL !== -1) {
    ColumnResizingManager.handleOnMouseDown(e);
    return; 
  }

 
  if (Config.HOVERED_ROW !== -1) {
    RowResizingManager.handleOnMouseDown(e);
    return; 
  }

  const { x, y } = getXY(e);
  const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
    grid.getVisibleRowCols();

  // Handle header clicks (column/row selection)
  if (
    (y < Config.COL_HEADER_HEIGHT && x > Config.ROW_HEADER_WIDTH) ||
    (y > Config.COL_HEADER_HEIGHT && x < Config.ROW_HEADER_WIDTH)
  ) {
    HeaderSelectionManager.handleOnMouseDown(
      startCol,
      startRow,
      endCol,
      endRow,
      scrollLeft,
      scrollTop,
      x,
      y
    );

    grid.render(); // Render after selection
    return;
  }

  // Handle cell selection
  if (Config.IS_SELECTING == false) {
    // Clear header selections when selecting cells
    Config.SELECTED_COL_HEADER = -1;
    Config.SELECTED_ROW_HEADER = -1;
    Config.SELECTED_COL_RANGE = null;
    Config.SELECTED_ROW_RANGE = null;
    CellSelectionManager.handleMouseDown(
      startCol,
      endCol,
      startRow,
      endRow,
      x,
      y
    );
  }
  grid.render();
});

window.addEventListener("mousemove", (event) => {
  if (Config.RESIZING_COL !== -1) {
    ColumnResizingManager.handleOnMouseMouse(event, grid);
    return; // Return early to prevent other mouse move handling
  }
  if (Config.RESIZING_ROW !== -1) {
    RowResizingManager.handleOnMouseMouse(event, grid);
    return; // Return early to prevent other mouse move handling
  }

  canvas.style.cursor = "cell";

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
    grid.getVisibleRowCols();

  const prevHoveredCol = Config.HOVERED_COL;
  const prevHoveredRow = Config.HOVERED_ROW;

  MouseHoverHandler.changeCursorStyleBasedOnPos(
    canvas,
    x,
    y,
    startCol,
    endCol,
    startRow,
    endRow,
    context,
    scrollLeft
  );

  // Check if either hovered column or row changed
  if (
    prevHoveredCol !== Config.HOVERED_COL ||
    prevHoveredRow !== Config.HOVERED_ROW
  ) {
    grid.render();

    // Draw column indicator if hovering over column edge
    if (Config.HOVERED_COL !== -1) {
      Draw.drawResizeIndicator(context, Config.HOVERED_COL, scrollLeft);
    }

    // Draw row indicator if hovering over row edge
    if (Config.HOVERED_ROW !== -1) {
      Draw.drawRowResizeIndicator(context, Config.HOVERED_ROW, scrollTop);
    }
  }

  // Handle header drag selection
  if (Config.IS_SELECTING_HEADER) {
    HeaderSelectionManager.handleOnMouseMove(
      startCol,
      startRow,
      endCol,
      endRow,
      scrollLeft,
      scrollTop,
      x,
      y
    );
    grid.render();
    return;
  }

  if (Config.IS_SELECTING) {
    CellSelectionManager.handleMouseMove(
      startCol,
      endCol,
      startRow,
      endRow,
      x,
      y
    );
    grid.render();
  }
  
});

window.addEventListener("mouseup", (e) => {
  if (Config.RESIZING_COL !== -1) {
    ColumnResizingManager.handleOnMouseUp(e, grid, canvas);
    return;
  }

  if (Config.RESIZING_ROW !== -1) {
    RowResizingManager.handleOnMouseUp(e, grid);
    return;
  }

  if (Config.IS_SELECTING == true) Config.IS_SELECTING = false;

  if (Config.IS_SELECTING_HEADER == true) {
    
    HeaderSelectionManager.handleOnMouseUp();
    Config.IS_SELECTING_HEADER = false;
  }

  grid.render();
});

canvas.addEventListener("dblclick",()=>{

  CellDataManager.showCellInputAtPosition("",document.querySelector('.cellInput'),canvasContainer);
});

document.querySelector('.cellInput').addEventListener('input', function(event) {
  Config.CURRENT_INPUT = event.target.value;
});

document.querySelector('.cellInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === 'Tab') {
    Config.INPUT_FINALIZED = true; 
    CellDataManager.saveInputToCell(context);
    this.style.display = 'none';
    event.preventDefault();
    grid.render();
  }

  if (event.key === 'Escape') {
    Config.CURRENT_INPUT = null;
    this.style.display = 'none';
    Config.INPUT_FINALIZED = true;
    event.preventDefault();
    // grid.render();
  }
});

document.querySelector('.cellInput').addEventListener('blur', function() {
  if (!Config.INPUT_FINALIZED) {
    CellDataManager.saveInputToCell(context);
  }
  this.style.display = 'none';
  Config.INPUT_FINALIZED = false; 
  Config.CURRENT_INPUT=null;
  grid.render();
});

