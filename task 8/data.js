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
      x += colWidths[c];
    }
    return { x, y };
  }

  function numberToColheader(num) {
    let colHeader = "";
    while (num > 0) {
      let remainder = (num - 1) % 26;
      colHeader = String.fromCharCode(65 + remainder) + colHeader;
      num = Math.floor((num - 1) / 26);
    }
    return colHeader;
  }

  const rows = 100;
  const cols = 100;

  let mode = "NORMAL"; // it can be normal or search for formula

  let spreadSheetdata = create2dArray(rows, cols, "");
  let cellProperties = create2dArray(rows, cols, { textAlign: "left" });

  let rowHeights = new Array(rows).fill(30);
  let colWidths = new Array(rows).fill(100);


  for(let r=1;r<rows;r++){
    spreadSheetdata[r][0]=r.toString();
  }

  for(let c=1;c<cols;c++){
    spreadSheetdata[0][c]=numberToColheader(c);
  }

  console.log(spreadSheetdata);
  

  let canvas;
  let context;

  // for (let col=)

  var DrawComponent = (function () {
    function drawSingleCell(row, col) {
      const properties = cellProperties[row][col];
      const pos = getPosition(row, col);

      if (context) {
        context.strokeRect(pos.x, pos.y, colWidths[row], rowHeights[col]);
      }

      let cellText=spreadSheetdata[row][col];
      context.font="18px sans-serif";
      context.fillStyle = "rgba(0, 0, 0, 0.7)"; 
      context.textAlign="left";
      context.textBaseline="middle";

      // based on the props change the style;

      const paddingX=5;
      const paddingY=5;
      let textX;
      let textY;
      if(row==0){
        textX=pos.x+(colWidths[col]/2)
      }
      else if(col==0){
        textX=pos.x+colWidths[col]-30;
      }
      else{
      textX=paddingX+pos.x;

      }
      textY=(rowHeights[row]/2)+pos.y;
      context.fillText(cellText,textX,textY);


    }

    function drawcells() {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          drawSingleCell(r, c);
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
      context.strokeStyle = "rgba(0,0,0,0.2)";
      context.lineWidth = 1;
      drawcells();
      // context.fillText("hello saboo",26,100);
      drawSelectedCellBorder();
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

  function setupGrid() {
    canvas = document.getElementById("spreadsheet");
    context = canvas.getContext("2d");

    context.imageSmoothingEnabled = false;

    const ratio = window.devicePixelRatio;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;

    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";

    context.scale(ratio, ratio);

    DrawComponent.drawGrid();
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupGrid();
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
})();
