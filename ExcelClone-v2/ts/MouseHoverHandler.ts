import { Grid } from "./Grid";

export class MouseHoverHandler {

  grid:Grid;

  constructor(gridObj:Grid){
    this.grid=gridObj;
  }


  changeCursorStyleBasedOnPos(
    x:number,
    y:number,
    startCol:number,
    endCol:number,
    startRow:number,
    endRow:number,
  ) {
    if (y < this.grid.COL_HEADER_HEIGHT && x > this.grid.ROW_HEADER_WIDTH) {
      this.grid.canvas.style.cursor = "s-resize";
      let currentX = this.grid.ROW_HEADER_WIDTH;
      this.grid.HOVERED_COL=-1;

      if(this.grid.CURRENT_INPUT!=null)return;

      for (let i = startCol; i < endCol; i++) {
        currentX += this.grid.COL_WIDTHS.get(i) ?? this.grid.DEFAULT_COL_WIDTH;
        if (Math.abs(x - currentX) <= this.grid.CURSOR_CHANGE_THRESHOLD) {
          this.grid.canvas.style.cursor = "col-resize";
          this.grid.HOVERED_COL = i;
          break;
        }
      }
    } else if (y > this.grid.COL_HEADER_HEIGHT && x < this.grid.ROW_HEADER_WIDTH) {
      this.grid.canvas.style.cursor = "w-resize";
      let currentY = this.grid.COL_HEADER_HEIGHT;
      this.grid.HOVERED_ROW = -1;
      if(this.grid.CURRENT_INPUT!=null)return;
      for (let i = startRow; i < endRow; i++) {
        currentY += this.grid.ROW_HEIGHTS.get(i) || this.grid.DEFAULT_ROW_HEIGHT;
        if (Math.abs(currentY - y) <= this.grid.CURSOR_CHANGE_THRESHOLD) {
          this.grid.canvas.style.cursor = "row-resize";
          this.grid.HOVERED_ROW = i;
          break;
        }
      }
    } else {
      this.grid.HOVERED_COL = -1;
      this.grid.HOVERED_ROW = -1;
    }
  }
}
