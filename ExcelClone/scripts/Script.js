import { Grid } from "./Grid.js";
import { Config } from "./Config.js";
import { MouseHoverHandler } from "./MouseHoverHandler.js";
import { MouseClickHandler } from "./MouseClickHandler.js";
import { ArrowKeyHandler } from "./ArrowKeyHandler.js";

const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("excelCanvas");
const context = canvas.getContext("2d");
const keySet = new Set(["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"]);


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

canvas.addEventListener("mousemove", (event) => {

  if (Config.RESIZING_COL !== -1) {
    const dx = event.clientX - Config.INITIAL_X;
    let newWidth = Config.COL_WIDTHS[Config.RESIZING_COL] + dx;
    if (newWidth < 10) newWidth = 10;
    Config.COL_WIDTHS[Config.RESIZING_COL] = newWidth;
    Config.INITIAL_X = event.clientX;
    grid.render();
    return;
  }
  canvas.style.cursor = "cell";

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
    grid.getVisibleRowCols();
  MouseHoverHandler.changeCursorStyleBasedOnPos(
    canvas,
    x,
    y,
    startCol,
    endCol,
    startRow,
    endRow
  );
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log("x is " + x + " and y is " + y);
  const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
    grid.getVisibleRowCols();

  if (
    (y < Config.COL_HEADER_HEIGHT && x > Config.ROW_HEADER_WIDTH) ||
    (y > Config.COL_HEADER_HEIGHT && x < Config.ROW_HEADER_WIDTH)
  ) {
    // select all the rows or cols
    return;
  } else {
    MouseClickHandler.handleCellClick(x, y, startRow, endRow, startCol, endCol, scrollLeft, scrollTop);
    grid.render();
  }
});




window.addEventListener("keydown", (event) => {
  let key = event.key;
  if (keySet.has(key)) {
    event.preventDefault();
   if( ArrowKeyHandler.handleArrowKeyOperations(key))grid.render();
  }
});


canvas.addEventListener("mousedown", (e) => {
  if (Config.HOVERED_COL !== -1) {
    Config.RESIZING_COL = Config.HOVERED_COL;
    Config.INITIAL_X = e.clientX;
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (Config.RESIZING_COL !== -1) {
    Config.RESIZING_COL = -1;
    grid.render();
    // After resizing, if mouse is over the grid, trigger selection logic
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Only trigger if inside grid area (not header)
    if (
      y > Config.COL_HEADER_HEIGHT &&
      x > Config.ROW_HEADER_WIDTH &&
      x < canvas.width &&
      y < canvas.height
    ) {
      const { startRow, endRow, startCol, endCol } = grid.getVisibleRowCols();
      MouseClickHandler.handleCellClick(x, y, startRow, endRow, startCol, endCol);
      grid.render();
    }
  }
});