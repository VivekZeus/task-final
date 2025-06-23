(function () {
  function create2dArray(n, m, cellDefaultvalue = "") {
    let array = new Array(n);
    for (let i = 0; i < n; i++) {
      if (typeof cellDefaultvalue === "object") {
        array[i] = new Array(m).fill({ ...cellDefaultvalue });
      } else {
        array[i] = new Array(m).fill(cellDefaultvalue);
      }
    }
    return array;
  }

  function getPosition(row, col) {
    let y = 0;
    let x = 0;
    for (let r = 0; r < row; r++) {
      y += rowHeights[r];
    }
    for (let c = 0; c < col; c++) {
      x += colHeights[c];
    }
    return {x,y};
  }

  const rows = 100;
  const cols = 100;

  let spreadSheetdata = create2dArray(rows, cols, "");
  let cellProperties = create2dArray(rows, cols, { textAlign: "left" });

  let rowHeights = new Array(rows).fill(26);
  let colHeights = new Array(rows).fill(100);

  let canvas;
  let context;

  var DrawComponent = (function () {
    function drawSingleCell(row, col) {
      const properties = cellProperties[row][col];
      const pos=getPosition(row,col);

      if (context) {
        context.strokeRect(pos.x, pos.y, colHeights[row], rowHeights[col]);
      }
    }

    function drawcells() {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          drawSingleCell(r, c);
        }
      }
    }

    function drawGrid() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "rgba(0,0,0,0.3)";
      context.lineWidth = 1;
      drawcells();
    }

    return { drawGrid };
  })();

  let selectedCell = {
    row: 1,
    col: 1,
  };

  let selectedcellRange = {
    startRow: selectedCell.row,
    startCol: selectedCell.col,
    endRow: selectedCell.row,
    endCol: selectedCell.col,
  };

  document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("spreadsheet");
    context = canvas.getContext("2d");
    const ratio = window.devicePixelRatio;
    // const canvasWidth = 1024;
    // const canvasHeight = 1024;
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;

    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";

    context.scale(ratio, ratio);

    DrawComponent.drawGrid();
  });
})();
