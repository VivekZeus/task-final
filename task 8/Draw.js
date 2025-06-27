import { Config } from "./config.js";
import { HeaderData } from "./headerData.js";
import { RowColumnManager } from "./RowColumnManager.js";
import { Data } from "./data.js";
import { Utils } from "./Utils.js";

export class Draw {

  constructor(canvas, context) {
    this.context = context;
    this.canvas = canvas;
  }

  insertText(data = HeaderData.headerSpreadSheetData) {
    for (const [rowCol, cellText] of data) {
      const [rowStr, colStr] = rowCol.split("-");
      let row = parseInt(rowStr, 10);
      let col = parseInt(colStr, 10);

      const pos = Utils.getPosition(row, col);
      this.context.font = "18px sans-serif";
      this.context.fillStyle = "rgba(0, 0, 0, 0.7)";
      this.context.textAlign = "left";
      this.context.textBaseline = "middle";

      const paddingX = 5;
      const paddingY = 5;

      let textX;
      let textY;

      if (row == 0) {
        textX = pos.x + Config.colWidths[col] / 2;
      } else if (col == 0) {
        const measured = this.context.measureText(cellText).width;
        textX = pos.x + Config.colWidths[col] - measured - paddingX;
      } else {
        textX = paddingX + pos.x;
      }
      textY = Config.rowHeights[row] / 2 + pos.y;
      this.context.fillText(cellText, textX, textY);
    }
  }

  drawHeaderInsertText() {
    let totalColWidth = RowColumnManager.getColumnWidthSum();
    this.context.beginPath();
    this.context.moveTo(0, Config.rowHeights[0]);
    this.context.lineTo(totalColWidth, Config.rowHeights[0]);
    this.context.stroke();

    let totalRowHeight = RowColumnManager.getRowHeightSum();
    this.context.beginPath();
    this.context.moveTo(Config.colWidths[0], 0);
    this.context.lineTo(Config.colWidths[0], totalRowHeight);
    this.context.stroke();

    this.insertText();
  }

  insertspreadSheetText() {
    this.insertText(Data.spreadSheetData);
  }

  drawRowsCols() {
    let rowSum = Config.defaultRowHeight;
    let colSum = Config.defaultColumnWidth;
    let totalColWidth = RowColumnManager.getColumnWidthSum();
    let totalRowHeight = RowColumnManager.getRowHeightSum();
    this.context.fillStyle = "#f0f0f0";
    this.context.fillRect(0, 0, totalColWidth, Config.rowHeights[0]);
    this.context.fillRect(0, 0, Config.colWidths[0], totalRowHeight);
    let max = Math.max(Config.rows, Config.cols);

    for (let i = 1; i < max; i++) {
      if (i < Config.rows) {
        let rowHeightNeeded = Config.rowHeights[i] + rowSum;
        this.context.beginPath();
        this.context.moveTo(0, rowHeightNeeded);
        // context.moveTo(0, rowHeightNeeded+0.5);
        this.context.lineTo(totalColWidth, rowHeightNeeded);
        this.context.stroke();
        rowSum += Config.rowHeights[i];
      }

      if (i < Config.cols) {
        let colWidthNeeded = Config.colWidths[i] + colSum;
        this.context.beginPath();
        this.context.moveTo(colWidthNeeded, 0);
        // context.moveTo(colWidthNeeded + 0.5, 0);
        this.context.lineTo(colWidthNeeded, totalRowHeight);
        this.context.stroke();
        colSum += Config.colWidths[i];
      }
    }
  }

  //   drawSelectedCellBorder() {
  //     const borderDiv = document.getElementById("selectedCellBorder");
  //     borderDiv.style.display = "block";
  //     const { x, y } = getPosition(selectedCell.row, selectedCell.col);
  //     borderDiv.style.left = `${x}px`;
  //     borderDiv.style.top = `${y}px`;
  //     borderDiv.style.width = `${colWidths[selectedCell.col] + 1}px`;
  //     borderDiv.style.height = `${rowHeights[selectedCell.row] + 1}px`;
  //     borderDiv.style.border = "2px solid #187c44";
  //   }

  drawGrid() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = "rgb(0,0,0)";
    this.context.lineWidth = 0.1;
    this.drawRowsCols();
    // insertText();
    this.drawHeaderInsertText();
  }


  drawSingleCellBorder(){
    
  }
}
