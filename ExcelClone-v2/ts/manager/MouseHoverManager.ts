import { Grid } from "../Grid";
import { PointerEventManager } from "./PointerEventManager";

export class MouseHoverManager implements PointerEventManager {
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }

  test(x: number, y: number, e: PointerEvent): boolean {
    return this.grid.RESIZING_COL == -1 || this.grid.RESIZING_ROW == -1;
  }

  onPointerDown(x: number, y: number, e: MouseEvent): void {}

  onPointerMove(
    x: number,
    y: number,
    e: MouseEvent,
    startCol: number,
    endCol: number,
    startRow: number,
    endRow: number,
    scrollLeft:number,
    scrollTop:number
  ): void {
    const prevHoveredCol = this.grid.HOVERED_COL;
    const prevHoveredRow = this.grid.HOVERED_ROW;
    this.changeCursorStyleBasedOnPos(x, y, startCol, endCol, startRow, endRow);
    if (
      prevHoveredCol !== this.grid.HOVERED_COL ||
      prevHoveredRow !== this.grid.HOVERED_ROW
    ) {
      this.grid.render();

      // for drawing column indicator
      if (this.grid.HOVERED_COL !== -1) {
        this.grid.draw.drawResizeIndicator(this.grid.HOVERED_COL, scrollLeft);
      }

      // for drawing row indicator
      if (this.grid.HOVERED_ROW !== -1) {
        this.grid.draw.drawRowResizeIndicator(this.grid.HOVERED_ROW, scrollTop);
      }
    }
  }

  onPointerUp(x: number, y: number, e: MouseEvent): void {}

  private changeCursorStyleBasedOnPos(
    x: number,
    y: number,
    startCol: number,
    endCol: number,
    startRow: number,
    endRow: number
  ) {
    this.grid.canvas.style.cursor = "cell";
    if (y < this.grid.COL_HEADER_HEIGHT && x > this.grid.ROW_HEADER_WIDTH) {
      this.grid.canvas.style.cursor = "s-resize";
      let currentX = this.grid.ROW_HEADER_WIDTH;
      this.grid.HOVERED_COL = -1;

      if (this.grid.CURRENT_INPUT != null) return;

      for (let i = startCol; i < endCol; i++) {
        currentX += this.grid.COL_WIDTHS.get(i) ?? this.grid.DEFAULT_COL_WIDTH;
        if (Math.abs(x - currentX) <= this.grid.CURSOR_CHANGE_THRESHOLD) {
          this.grid.canvas.style.cursor = "col-resize";
          this.grid.HOVERED_COL = i;
          break;
        }
      }
    } else if (
      y > this.grid.COL_HEADER_HEIGHT &&
      x < this.grid.ROW_HEADER_WIDTH
    ) {
      this.grid.canvas.style.cursor = "w-resize";
      let currentY = this.grid.COL_HEADER_HEIGHT;
      this.grid.HOVERED_ROW = -1;
      if (this.grid.CURRENT_INPUT != null) return;
      for (let i = startRow; i < endRow; i++) {
        currentY +=
          this.grid.ROW_HEIGHTS.get(i) || this.grid.DEFAULT_ROW_HEIGHT;
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
