import { Data } from "./data.js";
import { Config } from "./config.js";
import { HeaderData } from "./headerData.js";
import { MouseEventHandler } from "./MouseEventHandler.js";
import { Utils } from "./Utils.js";
import { Draw } from "./Draw.js";

(function () {
  // function create2dArray(n, m, cellDefaultvalue = "") {
  //   let array = new Array(n);
  //   for (let i = 0; i < n; i++) {
  //     if (typeof cellDefaultvalue === "object") {
  //       array[i] = new Array(m).fill({ ...cellDefaultvalue });
  //     } else {
  //       array[i] = new Array(m).fill(cellDefaultvalue);
  //     }
  //   }
  //   return array;
  // }

  function getPosition(row, col) {
    let y = 0;
    let x = 0;
    for (let r = 0; r < row; r++) {
      y += rowHeights[r];
    }
    for (let c = 0; c < col; c++) {
      x += colWidths[c];
    }
    return { x, y };
  }

  // function numberToColheader(num) {
  //   let colHeader = "";
  //   while (num > 0) {
  //     let remainder = (num - 1) % 26;
  //     colHeader = String.fromCharCode(65 + remainder) + colHeader;
  //     num = Math.floor((num - 1) / 26);
  //   }
  //   return colHeader;
  // }

  const rows = 100;
  const cols = 100;

  let mode = "NORMAL"; // it can be normal or search for formula

  let rowHeights = new Array(rows).fill(30);
  let colWidths = new Array(rows).fill(100);

  function getColumnWidthSum() {
    let sum = 0;
    for (let i = 0; i < colWidths.length; i++) {
      sum += colWidths[i];
    }
    return sum;
  }

  function getRowHeightSum() {
    let sum = 0;
    for (let i = 0; i < rowHeights.length; i++) {
      sum += rowHeights[i];
    }
    return sum;
  }

  HeaderData.insertHeaderData();

  let canvas;
  let context;

  const checkThreshold = 3;

  var DrawComponent = (function () {

    function insertText(data = HeaderData.headerSpreadSheetData) {
      for (const [rowCol, cellText] of data) {
        const [rowStr, colStr] = rowCol.split("-");
        let row = parseInt(rowStr, 10);
        let col = parseInt(colStr, 10);

        const pos = getPosition(row, col);
        context.font = "18px sans-serif";
        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.textAlign = "left";
        context.textBaseline = "middle";

        // based on the props change the style;

        const paddingX = 5;
        const paddingY = 5;

        let textX;
        let textY;

        if (row == 0) {
          textX = pos.x + colWidths[col] / 2;
        } else if (col == 0) {
          const measured = context.measureText(cellText).width;
          textX = pos.x + colWidths[col] - measured - paddingX;
        } else {
          textX = paddingX + pos.x;
        }
        textY = rowHeights[row] / 2 + pos.y;
        context.fillText(cellText, textX, textY);
      }
    }

    function drawHeaderInsertText() {
      let totalColWidth = getColumnWidthSum();
      context.beginPath();
      context.moveTo(0, rowHeights[0]);
      context.lineTo(totalColWidth, rowHeights[0]);
      context.stroke();
      let totalRowHeight = getRowHeightSum();
      context.beginPath();
      context.moveTo(colWidths[0], 0);
      context.lineTo(colWidths[0], totalRowHeight);
      context.stroke();

      insertText();
    }

    function insertspreadSheetText() {
      insertText(Data.spreadSheetData);
    }


    function drawRowsCols() {
      let rowSum = Config.defaultRowHeight;
      let colSum = Config.defaultColumnWidth;
      let totalColWidth = getColumnWidthSum();
      let totalRowHeight = getRowHeightSum();
      context.fillStyle = "#f0f0f0";
      context.fillRect(0, 0, totalColWidth, rowHeights[0]);
      context.fillRect(0, 0, colWidths[0], totalRowHeight);
      let max = Math.max(rows, cols);

      for (let i = 1; i < max; i++) {
        if (i < rows) {
          let rowHeightNeeded = rowHeights[i] + rowSum;
          context.beginPath();
          context.moveTo(0, rowHeightNeeded);
          // context.moveTo(0, rowHeightNeeded+0.5);
          context.lineTo(totalColWidth, rowHeightNeeded);
          context.stroke();
          rowSum += rowHeights[i];
        }

        if (i < cols) {
          let colWidthNeeded = colWidths[i] + colSum;
          context.beginPath();
          context.moveTo(colWidthNeeded, 0);
          // context.moveTo(colWidthNeeded + 0.5, 0);
          context.lineTo(colWidthNeeded, totalRowHeight);
          context.stroke();
          colSum += colWidths[i];
        }
      }
    }

    function drawSelectedCellBorder() {
      const borderDiv = document.getElementById("selectedCellBorder");
      borderDiv.style.display = "block";
      const { x, y } = getPosition(selectedCell.row, selectedCell.col);
      borderDiv.style.left = `${x}px`;
      borderDiv.style.top = `${y}px`;
      borderDiv.style.width = `${colWidths[selectedCell.col] + 1}px`;
      borderDiv.style.height = `${rowHeights[selectedCell.row] + 1}px`;
      borderDiv.style.border = "2px solid #187c44";
    }

    function drawGrid() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "rgb(0,0,0)";
      context.lineWidth = 0.1;
      drawRowsCols();
      // insertText();
      drawHeaderInsertText();
    }

    return { drawGrid };
  })();

  let drawComponent;

  function setupGrid() {
    const container = document.getElementById("container");

    canvas = document.getElementById("spreadsheet");
    context = canvas.getContext("2d");

    context.imageSmoothingEnabled = false;

    // const ratio = window.devicePixelRatio;

    // const canvasWidth = window.innerWidth;
    // const canvasHeight = window.innerHeight;

    // canvas.width = canvasWidth * ratio;
    // canvas.height = canvasHeight * ratio;

    // canvas.style.width = canvasWidth + "px";
    // canvas.style.height = canvasHeight + "px";

    // context.scale(ratio, ratio);
    // DrawComponent.drawGrid();

    const dpr = window.devicePixelRatio || 1;

    // Get new viewport size
    const viewWidth = container.clientWidth;
    const viewHeight = container.clientHeight;

    // Update canvas internal resolution
    canvas.width = viewWidth * dpr;
    canvas.height = viewHeight * dpr;

    // Match actual css size
    canvas.style.width = `${viewWidth}px`;
    canvas.style.height = `${viewHeight}px`;

    // Reset context and scale
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(dpr, dpr);
    drawComponent=new Draw(canvas,context);
    drawComponent.drawGrid();
    // drawComponent=new Draw();
    // DrawComponent.drawGrid();
  }

  // function handleMouseMovement() {
  //   canvas.addEventListener("mousemove", (event) => {
  //     canvas.style.cursor = "cell";

  //     let cursorIsSet = false;

  //     const rect = canvas.getBoundingClientRect();
  //     const x = event.clientX - rect.left;
  //     const y = event.clientY - rect.top;

  //     if (y < rowHeights[0] && x > colWidths[0]) {
  //       canvas.style.cursor = "s-resize";
  //       let currentX = 0;

  //       for (let i = 0; i < colWidths.length; i++) {
  //         currentX += colWidths[i];
  //         if (Math.abs(x - currentX) <= checkThreshold) {
  //           canvas.style.cursor = "col-resize";
  //           cursorIsSet = true;
  //           break;
  //         }
  //       }
  //     } else if (y > rowHeights[0] && x < colWidths[0]) {
  //       canvas.style.cursor = "w-resize";
  //       let currentY = 0;
  //       for (let i = 0; i < rowHeights.length; i++) {
  //         currentY += rowHeights[i];
  //         if (Math.abs(currentY - y) <= checkThreshold) {
  //           canvas.style.cursor = "row-resize";
  //           cursorIsSet = true;
  //           break;
  //         }
  //       }
  //     }
  //   });
  // }

  document.addEventListener("DOMContentLoaded", () => {
    setupGrid();
    let mouseEventHandler = new MouseEventHandler(
      canvas,
      rowHeights,
      colWidths,
      checkThreshold,
      context
    );
    mouseEventHandler.handleCursorChange();
    mouseEventHandler.handleMouseClick();
    // handleMouseMovement();
    // canvas.addEventListener("click", (event) => {
    //   const rect = canvas.getBoundingClientRect();
    //   const x = event.clientX - rect.left;
    //   const y = event.clientY - rect.top;

    //   if (
    //     (y < rowHeights[0] && x > colWidths[0]) ||
    //     (y > rowHeights[0] && x < colWidths[0])
    //   ) {
    //     // select all the rows or cols
    //     console.log("clicked some header ...");

    //     return;
    //   }

    //   let currentX = 0;
    //   let currentY = 0;
    //   let rowSelected = -1;
    //   let colSelected = -1;

    //   //   determinging the column
    //   let prevColPos;
    //   for (let i = 0; i < colWidths.length; i++) {
    //     prevColPos = currentX;
    //     currentX += colWidths[i];
    //     if (currentX > x) {
    //       colSelected = i;
    //       break;
    //     }
    //   }
    //   //   determining the row
    //   let prevRowPos;
    //   for (let i = 0; i < rowHeights.length; i++) {
    //     prevRowPos = currentY;
    //     currentY += rowHeights[i];
    //     if (currentY > y) {
    //       rowSelected = i;
    //       break;
    //     }
    //   }

    //   // context.strokeStyle = "#187c44";
    //   // context.lineWidth = 2;
    //   // context.strokeRect(
    //   //   prevColPos,
    //   //   prevRowPos,
    //   //   colWidths[colSelected],
    //   //   rowHeights[rowSelected]
    //   // );
    //   console.log(prevRowPos, prevColPos);
    // });
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

  document.addEventListener("keydown", (event) => {
    let key = event.key;
    if (keySet.has(key)) {
      event.preventDefault();
      handleArrowKeyOperations(key);
    }
  });

  window.addEventListener("resize", () => {
    setupGrid();
  });

  // canvas.addEventListener("click", (event) => {
  //   const rect = canvas.getBoundingClientRect();
  //   const x = event.clientX - rect.left;
  //   const y = event.clientY - rect.top;

  //   if (
  //     (y < rowHeights[0] && x > colWidths[0]) ||
  //     (y > rowHeights[0] && x < colWidths[0])
  //   ) {
  //     // select all the rows or cols
  //     console.log("clicked some header ...");

  //     return;
  //   }

  //   let currentX = 0;
  //   let currentY = 0;
  //   let rowSelected = -1;
  //   let colSelected = -1;

  //   //   determinging the column
  //   let prevColPos;
  //   for (let i = 0; i < colWidths.length; i++) {
  //     prevColPos = currentX;
  //     currentX += colWidths[i];
  //     if (currentX > x) {
  //       colSelected = i;
  //       break;
  //     }
  //   }
  //   //   determining the row
  //   let prevRowPos;
  //   for (let i = 0; i < rowHeights.length; i++) {
  //     prevRowPos = currentY;
  //     currentY += rowHeights[i];
  //     if (currentY > y) {
  //       rowSelected = i;
  //       break;
  //     }
  //   }

  //   // context.strokeStyle = "#187c44";
  //   // context.lineWidth = 2;
  //   // context.strokeRect(
  //   //   prevColPos,
  //   //   prevRowPos,
  //   //   colWidths[colSelected],
  //   //   rowHeights[rowSelected]
  //   // );
  //   console.log(prevRowPos, prevColPos);
  // });
})();
