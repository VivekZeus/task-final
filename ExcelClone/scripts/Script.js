import { Grid } from "./Grid.js";
import { Config } from "./Config.js";
import { HeaderData } from "./HeaderData.js";
import { MouseHoverHandler } from "./MouseHoverHandler.js";
import { MouseClickHandler } from "./MouseClickHandler.js";

const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("excelCanvas");
const context = canvas.getContext("2d");

// create headers data at start
console.time("insertHeaderDataTime");
HeaderData.insertHeaderData();
console.timeEnd("insertHeaderDataTime");

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
  canvas.style.cursor = "cell";

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  // console.log("x is " + x + " and y is " + y);
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
  }
  else{
    MouseClickHandler.handleCellClick(x, y,startRow,endRow,startCol,endCol);
    grid.render();
  }
});


  function ifCellCanShift(key) {
    const { row, col } = selectedCell;
    console.log(row, col);
    if (key == "ArrowLeft") {
      return col > 1;
    } else if (key == "ArrowRight") {
      return col < cols - 1;
    } else if (key == "ArrowUp") {
      return row > 1;
    } else if (key == "ArrowDown") {
      return row < rows - 1;
    }
  }

  function shiftSelectedCell(key) {
    if (key == "ArrowLeft") {
      selectedCell.col -= 1;
    } else if (key == "ArrowRight") {
      selectedCell.col += 1;
    } else if (key == "ArrowUp") {
      selectedCell.row -= 1;
    } else if (key == "ArrowDown") {
      selectedCell.row += 1;
    }
    // localStorage.setItem("selectedCellRow", selectedCell.row);
    // localStorage.setItem("selectedCellCol", selectedCell.col);
  }

  function handleNormalArrowKeyOperations(key) {
    if (!ifCellCanShift(key)) {
      console.log("cannot shift");
      return;
    }
    shiftSelectedCell(key);
  }

  function handleArrowKeyOperations(key) {
    if (mode == "NORMAL") {
      handleNormalArrowKeyOperations(key);
    }
    DrawComponent.drawGrid();
  }

  const keySet = new Set(["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"]);

  canvas.addEventListener("keydown", (event) => {
    let key = event.key;
    if (keySet.has(key)) {
      event.preventDefault();
      handleArrowKeyOperations(key);
    }
  });
