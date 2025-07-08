// import { Grid } from "./Grid.js";
// import { Config } from "./Config.js";
// import { MouseHoverHandler } from "./MouseHoverHandler.js";
// import { ArrowKeyHandler } from "./ArrowKeyHandler.js";
// import { PrefixArrayManager } from "./PrefixArrayManager.js";
// import { Draw } from "./Draw.js";
// import { ColumnResizingManager } from "./ColumnResizingManager.js";
// import { RowResizingManager } from "./RowResizingManager.js";
// import { CellSelectionManager } from "./CellSelectionManager.js";
// import { HeaderSelectionManager } from "./HeaderSelectionManager.js";
// import { ColHeaderSelector } from "./ColHeaderSelector.js";
// import { RowHeaderSelector } from "./RowHeaderSelector.js";
// import { CellDataManager } from "./CellDataManager.js";

// import { Config } from "./Config.js";
import { Grid } from "./Grid.js";

const canvasContainer = document.getElementById("canvasContainer") as HTMLDivElement;
const canvas = document.getElementById("excelCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d")as CanvasRenderingContext2D;

const keySet:Set<string> = new Set(["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"]);
const otherKeySet:Set<string> = new Set(["Enter", "Tab"]);

function getXY(event:MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}


const grid = new Grid(
  canvasContainer,
  canvas,
  context,
);

grid.render();

function loadJSONData(jsonArray:any) {
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

fetch("scripts/data.json")
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

window.addEventListener("keydown", (event) => {
  let key = event.key;

  const input = document.querySelector(".cellInput") as HTMLInputElement;
  if (input && window.getComputedStyle(input).display !== "none") {
    return;
  }
  event.preventDefault();

  if (otherKeySet.has(key)) {
    if (grid.arrowKeyHandler.handleTabEnterKeyOperations(key, event.shiftKey))
      grid.render();
  } else if (grid.colHeaderSelector.handleKeyboardSelection(event)) {
    grid.render();
  } else if (grid.rowHeaderSelector.handleKeyboardSelection(event)) {
    grid.render();
  } else if (
    event.shiftKey &&
    keySet.has(key) &&
    grid.arrowKeyHandler.ifCellRangeCanShift(key)
  ) {
    grid.arrowKeyHandler.handleShiftAndArrowKeyOperations(key);
    grid.render();
  } else if (keySet.has(key)) {
    if (grid.arrowKeyHandler.handleArrowKeyOperations(key)) grid.render();
  } else if (
    (/^[a-zA-Z0-9]$/.test(key) ||
      /^[~`!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]$/.test(key)) &&
    grid.SELECTED_CELL_RANGE != null
  ) {
    if (!input || !grid.SELECTED_CELL_RANGE) return;

    const row = grid.SELECTED_CELL_RANGE.startRow;
    const col = grid.SELECTED_CELL_RANGE.startCol;
    if (grid.cellDataManager.cellData.has(row)) {
      const rowData = grid.cellDataManager.cellData.get(row);
      if (rowData != null && rowData.has(col)) {
        const cell = rowData.get(col);
        if (cell.value !== "") {
          rowData.delete(col); // remove the cell
          if (rowData.size === 0) {
            grid.cellDataManager.cellData.delete(row);
          }
          grid.render();
        }
      }
    }

    grid.cellDataManager.showCellInputAtPosition(key, input);
    grid.render();
  }
});

canvas.addEventListener("mousedown", (e) => {
  if (grid.HOVERED_COL !== -1) {
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

    if (!Config.INPUT_FINALIZED && Config.CURRENT_INPUT != null) {
      CellDataManager.saveInputToCell(context);
    }
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

    // for drawing column indicator
    if (Config.HOVERED_COL !== -1) {
      Draw.drawResizeIndicator(context, Config.HOVERED_COL, scrollLeft);
    }

    // for drawing row indicator
    if (Config.HOVERED_ROW !== -1) {
      Draw.drawRowResizeIndicator(context, Config.HOVERED_ROW, scrollTop);
    }
  }

  // while dragging header
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


canvas.addEventListener("dblclick", () => {
  const input = document.querySelector(".cellInput");
  if (!input || !Config.SELECTED_CELL_RANGE) return;

  const row = Config.SELECTED_CELL_RANGE.startRow;
  const col = Config.SELECTED_CELL_RANGE.startCol;

  let cellValue = "";

  if (CellDataManager.CellData.has(row)) {
    const rowData = CellDataManager.CellData.get(row);
    if (rowData && rowData.has(col)) {
      const cell = rowData.get(col);
      if (cell.value !== "") {
        cellValue = cell.value; // 1. get the value
        rowData.delete(col); // 2. clear the cell
        if (rowData.size === 0) {
          CellDataManager.CellData.delete(row);
        }
      }
    }
  }

  // 3. Show the input with old value
  CellDataManager.showCellInputAtPosition(cellValue, input, canvasContainer);

  // 4. Re-render the grid
  grid.render();
});

document
  .querySelector(".cellInput")
  .addEventListener("input", function (event) {
    Config.CURRENT_INPUT = event.target.value;
  });

document
  .querySelector(".cellInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === "Tab") {
      Config.INPUT_FINALIZED = true;
      CellDataManager.saveInputToCell(context);
      this.style.display = "none";
      event.preventDefault();
      grid.render();
    }

    if (event.key === "Escape") {
      Config.CURRENT_INPUT = null;
      this.style.display = "none";
      Config.INPUT_FINALIZED = true;
      event.preventDefault();
      // grid.render();
    }
  });

document.querySelector(".cellInput").addEventListener("blur", function () {
  if (!Config.INPUT_FINALIZED) {
    CellDataManager.saveInputToCell(context);
  }
  this.style.display = "none";
  Config.INPUT_FINALIZED = false;
  Config.CURRENT_INPUT = null;
  grid.render();
});
