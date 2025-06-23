(function () {
  interface SelectedCell {
    row: number;
    col: number;
  }

  interface SelectedCellRange {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  }

  function create2dArray(
    n: number,
    m: number,
    cellDefaultvalue: any = ""
  ): Array<Array<any>> {
    let array: Array<Array<any>> = new Array(n);
    for (let i = 0; i < n; i++) {
      if (typeof cellDefaultvalue == "object") {
        array[i] = new Array(m).fill({ ...cellDefaultvalue });
      } else {
        array[i] = new Array(m).fill(cellDefaultvalue);
      }
    }

    return array;
  }

  const rows: number = 100;
  const cols: number = 100;

  let spreadSheetdata = create2dArray(rows, cols, "");
  let cellProperties = create2dArray(rows, cols, { textAlign: "left" });

  let rowHeights = new Array(rows).fill(26);
  let colHeights = new Array(rows).fill(100);

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | null;

  var DrawComponent = (function () {
    function drawSingleCell(row: number, col: number) {
      const properties = cellProperties[row][col];
      let y = 0;
      let x = 0;
      for (let r = 0; r < row; r++) {
        y += rowHeights[r];
      }
      for (let c = 0; c < col; c++) {
        x += colHeights[c];
      }

      context?.strokeRect(x, y, colHeights[row], rowHeights[col]);
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
      context.strokeStyle = "rgba(0,0,0,0.2)";
      drawcells();
    }

    return { drawGrid };
  })();

  let selectedCell: SelectedCell = {
    row: 1,
    col: 1,
  };

  let selectedcellRange: SelectedCellRange = {
    startRow: selectedCell.row,
    startCol: selectedCell.col,
    endRow: selectedCell.row,
    endCol: selectedCell.col,
  };

  document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("spreadsheet") as HTMLCanvasElement;
    context = canvas.getContext("2d");
    DrawComponent.drawGrid();
  });
});
