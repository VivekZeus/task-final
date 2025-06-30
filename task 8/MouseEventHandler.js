import { Draw } from "./Draw.js";

export class MouseEventHandler {
  constructor(canvas, rowHeights, colWidths, checkThreshold, context) {
    this.canvas = canvas;
    this.rowHeights = rowHeights;
    this.colWidths = colWidths;
    this.checkThreshold = checkThreshold;
    this.context = context;
  }

  handleCursorChange() {
    this.canvas.addEventListener("mousemove", (event) => {
      this.canvas.style.cursor = "cell";

      let cursorIsSet = false;

      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (y < this.rowHeights[0] && x > this.colWidths[0]) {
        this.canvas.style.cursor = "s-resize";
        let currentX = 0;

        for (let i = 0; i < this.colWidths.length; i++) {
          currentX += this.colWidths[i];
          if (Math.abs(x - currentX) <= this.checkThreshold) {
            this.canvas.style.cursor = "col-resize";
            cursorIsSet = true;
            break;
          }
        }
      } else if (y > this.rowHeights[0] && x < this.colWidths[0]) {
        this.canvas.style.cursor = "w-resize";
        let currentY = 0;
        for (let i = 0; i < this.rowHeights.length; i++) {
          currentY += this.rowHeights[i];
          if (Math.abs(currentY - y) <= this.checkThreshold) {
            this.canvas.style.cursor = "row-resize";
            cursorIsSet = true;
            break;
          }
        }
      }
    });
  }

  handleMouseClick() {
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (
        (y < this.rowHeights[0] && x > this.colWidths[0]) ||
        (y > this.rowHeights[0] && x < this.colWidths[0])
      ) {
        // select all the rows or cols
        console.log("clicked some header ...");

        return;
      }

      let currentX = 0;
      let currentY = 0;
      let rowSelected = -1;
      let colSelected = -1;

      //   determinging the column
      let prevColPos;
      for (let i = 0; i < this.colWidths.length; i++) {
        prevColPos = currentX;
        currentX += this.colWidths[i];
        if (currentX > x) {
          colSelected = i;
          break;
        }
      }
      //   determining the row
      let prevRowPos;
      for (let i = 0; i < this.rowHeights.length; i++) {
        prevRowPos = currentY;
        currentY += this.rowHeights[i];
        // prevColPos=i!=0?this.colWidths[i-1]:0;
        if (currentY > y) {
          rowSelected = i;
          break;
        }
      }

      this.context.clear();
      this.context.strokeStyle = "#187c44";
      this.context.lineWidth = 2;

      this.context.strokeRect(
        prevColPos + 2,
        prevRowPos + 2,
        this.colWidths[colSelected] - 4,
        this.rowHeights[rowSelected] - 4
      );

      console.log(prevRowPos, prevColPos);


    });
  }
}
