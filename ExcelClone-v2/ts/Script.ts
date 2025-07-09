import { Grid } from "./Grid.js";

const canvasContainer = document.getElementById(
  "canvasContainer"
) as HTMLDivElement;
const canvas = document.getElementById("excelCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const keySet: Set<string> = new Set([
  "ArrowRight",
  "ArrowLeft",
  "ArrowDown",
  "ArrowUp",
]);
const otherKeySet: Set<string> = new Set(["Enter", "Tab"]);

function getXY(event: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

let autoScrollDir: string | null = null;
let autoScrollFrameId: number | null = null;

function startAutoScroll(direction: string) {
  autoScrollDir = direction;

  if (autoScrollFrameId !== null) return;

  function step() {
    if (!autoScrollDir) return;

    if (autoScrollDir === "down") grid.canvasContainer.scrollTop += 10;
    else if (autoScrollDir === "up") grid.canvasContainer.scrollTop -= 10;
    else if (autoScrollDir === "right") grid.canvasContainer.scrollLeft += 10;
    else if (autoScrollDir === "left") grid.canvasContainer.scrollLeft -= 10;

    // Continue loop
    autoScrollFrameId = requestAnimationFrame(step);
  }

  step();
}

function stopAutoScroll() {
  autoScrollDir = null;
  if (autoScrollFrameId !== null) {
    cancelAnimationFrame(autoScrollFrameId);
    autoScrollFrameId = null;
  }
}

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
    grid.statisticsManager.updateStatistics();
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
    grid.columnResizingManager.handleOnMouseDown(e);
    return;
  }

  if (grid.HOVERED_ROW !== -1) {
    grid.rowResizingManager.handleOnMouseDown(e);
    return;
  }

  const { x, y } = getXY(e);
  const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
    grid.getVisibleRowCols();

  // Handle header clicks (column/row selection)
  if (
    (y < grid.COL_HEADER_HEIGHT && x > grid.ROW_HEADER_WIDTH) ||
    (y > grid.COL_HEADER_HEIGHT && x < grid.ROW_HEADER_WIDTH)
  ) {
    grid.headerSelectionManager.handleOnMouseDown(
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
  if (grid.IS_SELECTING == false) {
    // Clear header selections when selecting cells
    grid.SELECTED_COL_HEADER = -1;
    grid.SELECTED_ROW_HEADER = -1;
    grid.SELECTED_COL_RANGE = null;
    grid.SELECTED_ROW_RANGE = null;

    if (!grid.INPUT_FINALIZED && grid.CURRENT_INPUT != null) {
      grid.cellDataManager.saveInputToCell();
    }
    grid.cellSelectionManager.handleMouseDown(
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
  if (grid.RESIZING_COL !== -1) {
    grid.columnResizingManager.handleOnMouseMouse(event);
    return; // Return early to prevent other mouse move handling
  }
  if (grid.RESIZING_ROW !== -1) {
    grid.rowResizingManager.handleOnMouseMouse(event);
    return; // Return early to prevent other mouse move handling
  }

  canvas.style.cursor = "cell";

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
    grid.getVisibleRowCols();

  const prevHoveredCol = grid.HOVERED_COL;
  const prevHoveredRow = grid.HOVERED_ROW;

  grid.mouseHoverHandler.changeCursorStyleBasedOnPos(
    x,
    y,
    startCol,
    endCol,
    startRow,
    endRow
  );

  // Check if either hovered column or row changed
  if (
    prevHoveredCol !== grid.HOVERED_COL ||
    prevHoveredRow !== grid.HOVERED_ROW
  ) {
    grid.render();

    // for drawing column indicator
    if (grid.HOVERED_COL !== -1) {
      grid.draw.drawResizeIndicator(grid.HOVERED_COL, scrollLeft);
    }

    // for drawing row indicator
    if (grid.HOVERED_ROW !== -1) {
      grid.draw.drawRowResizeIndicator(grid.HOVERED_ROW, scrollTop);
    }
  }

  // while dragging header
  if (grid.IS_SELECTING_HEADER) {
    grid.headerSelectionManager.handleOnMouseMove(
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

  if (grid.IS_SELECTING) {
    grid.cellSelectionManager.handleMouseMove(
      startCol,
      endCol,
      startRow,
      endRow,
      x,
      y
    );
    const margin = 30; // px from edge
    const { left, top, right, bottom } = canvas.getBoundingClientRect();

    if (event.clientY > bottom - margin) {
      startAutoScroll("down");
    } else if (event.clientY < top + margin) {
      startAutoScroll("up");
    } else if (event.clientX > right - margin) {
      startAutoScroll("right");
    } else if (event.clientX < left + margin) {
      startAutoScroll("left");
    } else {
      stopAutoScroll();
    }

    grid.render();
  }
});

window.addEventListener("mouseup", (e) => {
  if (grid.RESIZING_COL !== -1) {
    grid.columnResizingManager.handleOnMouseUp(e);
    return;
  }

  if (grid.RESIZING_ROW !== -1) {
    grid.rowResizingManager.handleOnMouseUp(e);
    return;
  }

  if (grid.IS_SELECTING == true) {
    grid.IS_SELECTING = false;
    grid.statisticsManager.updateStatistics();
    stopAutoScroll();
  }

  if (grid.IS_SELECTING_HEADER == true) {
    grid.headerSelectionManager.handleOnMouseUp();
    grid.IS_SELECTING_HEADER = false;
  }

  grid.render();
});

canvas.addEventListener("dblclick", () => {
  const input = document.querySelector(".cellInput") as HTMLInputElement;
  if (!input || !grid.SELECTED_CELL_RANGE) return;

  const row = grid.SELECTED_CELL_RANGE.startRow;
  const col = grid.SELECTED_CELL_RANGE.startCol;

  let cellValue = "";

  if (grid.cellDataManager.cellData.has(row)) {
    const rowData = grid.cellDataManager.cellData.get(row);
    if (rowData && rowData.has(col)) {
      const cell = rowData.get(col);
      if (cell.value !== "") {
        cellValue = cell.value; // 1. get the value
        rowData.delete(col); // 2. clear the cell
        if (rowData.size === 0) {
          grid.cellDataManager.cellData.delete(row);
        }
      }
    }
  }

  // 3. Show the input with old value
  grid.cellDataManager.showCellInputAtPosition(cellValue, input);

  // 4. Re-render the grid
  grid.render();
});

const inputElement = document.querySelector(
  ".cellInput"
) as HTMLInputElement | null;

if (inputElement) {
  inputElement.addEventListener("input", (event: Event) => {
    const target = event.target as HTMLInputElement;
    grid.CURRENT_INPUT = target.value;
  });

  inputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === "Tab") {
      grid.INPUT_FINALIZED = true;
      grid.cellDataManager.saveInputToCell();
      this.style.display = "none";
      event.preventDefault();
      grid.render();
    }

    if (event.key === "Escape") {
      grid.CURRENT_INPUT = null;
      this.style.display = "none";
      grid.INPUT_FINALIZED = true;
      event.preventDefault();
    }
  });

  inputElement.addEventListener("blur", function () {
    if (!grid.INPUT_FINALIZED) {
      grid.cellDataManager.saveInputToCell();
    }
    this.style.display = "none";
    grid.INPUT_FINALIZED = false;
    grid.CURRENT_INPUT = null;
    grid.render();
  });
}
