import { Grid } from "./Grid.js";
import { Config } from "./Config.js";
import { MouseHoverHandler } from "./MouseHoverHandler.js";
import { ArrowKeyHandler } from "./ArrowKeyHandler.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { Draw } from "./Draw.js";
import { ColumnResizingManager } from "./ColumnResizingManager.js";
import { RowResizingManager } from "./RowResizingManager.js";
import { Utils } from "./Utils.js";
import { CellSelectionManager } from "./CellSelectionManager.js";
import { HeaderSelectionManager } from "./HeaderSelectionManager.js";

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

canvasContainer.addEventListener("scroll", (e) => {
  grid.render();
});

window.addEventListener("resize", () => {
  grid.resizeCanvas();
});

window.addEventListener("keydown", (event) => {
  let key = event.key;
  event.preventDefault();
  if (event.shiftKey && otherKeySet.has(key)) {
    console.log(("came here"));
    
    if (key == "Tab" && ArrowKeyHandler.ifCellCanShift("ArrowLeft")) {
      ArrowKeyHandler.shiftSelectedCell("ArrowLeft");
      grid.render();
    }
    if (key == "Enter" && ArrowKeyHandler.ifCellCanShift("ArrowUp")) {
      ArrowKeyHandler.shiftSelectedCell("ArrowUp");
      grid.render();
    }
  }

  if (otherKeySet.has(key)) {
    if (key == "Tab" && ArrowKeyHandler.ifCellCanShift(key)) {
      ArrowKeyHandler.shiftSelectedCell(key);
      grid.render();
    }
    if (key == "Enter" && ArrowKeyHandler.ifCellCanShift(key)) {
      ArrowKeyHandler.shiftSelectedCell(key);
      grid.render();
    }
  }

  if (keySet.has(key)) {
    // event.preventDefault();
    if (ArrowKeyHandler.handleArrowKeyOperations(key)) grid.render();
  }
});

canvas.addEventListener("mousedown", (e) => {
  // Handle column resizing - this should have highest priority
  if (Config.HOVERED_COL !== -1) {
    ColumnResizingManager.handleOnMouseDown(e);
    return; // Important: Return early to prevent column selection
  }

  // Handle row resizing
  if (Config.HOVERED_ROW !== -1) {
    RowResizingManager.handleOnMouseDown(e);
    return; // Important: Return early to prevent row selection
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
    console.log("resizing col", Config.RESIZING_COL);
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
