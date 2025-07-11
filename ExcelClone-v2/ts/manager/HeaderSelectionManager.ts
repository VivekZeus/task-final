import { Grid } from "../Grid.js";
import { PointerEventManager } from "./PointerEventManager.js";
import { ColHeaderSelector } from "./ColHeaderSelector.js";
import { RowHeaderSelector } from "./RowHeaderSelector.js";

export class HeaderSelectionManager implements PointerEventManager {
  grid: Grid;
  colHeaderSelector:ColHeaderSelector;
  rowHeaderSelector:RowHeaderSelector;
  constructor(gridObj: Grid) {
    this.grid = gridObj;
    this.rowHeaderSelector=new RowHeaderSelector(gridObj);
    this.colHeaderSelector=new ColHeaderSelector(gridObj);
  }

  test(x: number, y: number, e: PointerEvent): boolean {
    return (
      (y < this.grid.COL_HEADER_HEIGHT && x > this.grid.ROW_HEADER_WIDTH) ||
      (y > this.grid.COL_HEADER_HEIGHT && x < this.grid.ROW_HEADER_WIDTH)
    );
  }

  onPointerDown(
    x: number,
    y: number,
    e: PointerEvent,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    scrollLeft: number,
    scrollTop: number
  ): void {
    this.grid.IS_SELECTING_HEADER = true;

    if (y < this.grid.COL_HEADER_HEIGHT && x > this.grid.ROW_HEADER_WIDTH) {
      this.colHeaderSelector.handleOnMouseDown(
        startCol,
        endCol,
        x,
        scrollLeft
      );
      this.grid.HEADER_SELECTION_TYPE = "column";
    } else {
      this.rowHeaderSelector.handleOnMouseDown(
        startRow,
        endRow,
        y,
        scrollTop
      );
      this.grid.HEADER_SELECTION_TYPE = "row";
    }
    this.grid.render();
  }

  onPointerMove(
    x: number,
    y: number,
    event: PointerEvent,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    scrollLeft: number,
    scrollTop: number
  ): void {
    if (this.grid.HEADER_SELECTION_TYPE === "column") {
      this.colHeaderSelector.handleOnMouseMove(
        startCol,
        endCol,
        x,
        scrollLeft
      );
      this.grid.autoScrollManager.checkAutoScroll(event);
    } else if (this.grid.HEADER_SELECTION_TYPE === "row") {
      this.rowHeaderSelector.handleOnMouseMove(
        startRow,
        endRow,
        y,
        scrollTop
      );
      this.grid.autoScrollManager.checkAutoScroll(event);
    }
    this.grid.render();
  }

  onPointerUp(x: number, y: number, event: PointerEvent): void {
    if (this.grid.HEADER_SELECTION_TYPE === "column") {
      this.colHeaderSelector.handleOnMouseUp();
    } else if (this.grid.HEADER_SELECTION_TYPE === "row") {
      this.rowHeaderSelector.handleOnMouseUp();
    }
    this.grid.statisticsManager.updateStatistics();
    this.grid.HEADER_SELECTION_TYPE = null;
    
    this.grid.autoScrollManager.stopAutoScroll();
    this.grid.IS_SELECTING_HEADER = false;
  }


}
