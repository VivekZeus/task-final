import { Grid } from "./Grid.js";
import { Config } from "./Config.js";
import { MouseHoverHandler } from "./MouseHoverHandler.js";
import { MouseClickHandler } from "./MouseClickHandler.js";
import { ArrowKeyHandler } from "./ArrowKeyHandler.js";
import { PrefixArrayManager } from "./PrefixArrayManager.js";
import { Draw } from "./Draw.js";
import { ColumnResizingManager } from "./ColumnResizingManager.js";
import { RowResizingManager } from "./RowResizingManager.js";
import { Utils } from "./Utils.js";

const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("excelCanvas");
const context = canvas.getContext("2d");

const keySet = new Set(["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"]);

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

window.addEventListener("mousemove", (event) => {
  if (Config.RESIZING_COL !== -1) {
    ColumnResizingManager.handleOnMouseMouse(event, grid);
    return;
  }
  if (Config.RESIZING_ROW !== -1) {
    RowResizingManager.handleOnMouseMouse(event, grid);
    return;
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

  if (!Config.IS_SELECTING) return;
  let selCol = Utils.getSelectedCol(startCol, endCol, x);
  let selRow = Utils.getSelectedRow(startRow, endRow, y);
  Config.SELECTED_CELL_RANGE.endRow = selRow;
  Config.SELECTED_CELL_RANGE.endCol = selCol;

  grid.render();
});

window.addEventListener("keydown", (event) => {
  let key = event.key;
  if (keySet.has(key)) {
    event.preventDefault();
    if (ArrowKeyHandler.handleArrowKeyOperations(key)) grid.render();
  }
});

canvas.addEventListener("mousedown", (e) => {
  if (Config.HOVERED_COL !== -1) {
    ColumnResizingManager.handleOnMouseDown(e);
  }
  if (Config.HOVERED_ROW !== -1) {
    RowResizingManager.handleOnMouseDown(e);
  }

  const { x, y } = getXY(e);
  const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
    grid.getVisibleRowCols();

  if (
    (y < Config.COL_HEADER_HEIGHT && x > Config.ROW_HEADER_WIDTH) ||
    (y > Config.COL_HEADER_HEIGHT && x < Config.ROW_HEADER_WIDTH)
  ) {
    if (y < Config.COL_HEADER_HEIGHT && x > Config.ROW_HEADER_WIDTH) {
      
    } else {
    }
    return;
  }

  let selCol = Utils.getSelectedCol(startCol, endCol, x);
  let selRow = Utils.getSelectedRow(startRow, endRow, y);
  Config.SELECTED_CELL_RANGE.startCol = selCol;
  Config.SELECTED_CELL_RANGE.endCol = selCol;
  Config.SELECTED_CELL_RANGE.startRow = selRow;
  Config.SELECTED_CELL_RANGE.endRow = selRow;
  Config.IS_SELECTING = true;
  // grid.render();
});

window.addEventListener("mouseup", (e) => {
  if (Config.RESIZING_COL !== -1) {
    ColumnResizingManager.handleOnMouseUp(e, grid, canvas);
  }

  if (Config.RESIZING_ROW !== -1) {
    RowResizingManager.handleOnMouseUp(e, grid);
  }
  Config.IS_SELECTING = false;
  grid.render();
});
