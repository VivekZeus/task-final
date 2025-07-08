import { Grid } from "./Grid";

export class RowResizingManager {
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }

  handleOnMouseDown(event: MouseEvent) {
    this.grid.RESIZING_ROW = this.grid.HOVERED_ROW;
    this.grid.INITIAL_Y = event.clientY;
    this.grid.RESIZING_ROW_OLD_HEIGHT =
      this.grid.ROW_HEIGHTS.get(this.grid.RESIZING_ROW) ??
      this.grid.DEFAULT_ROW_HEIGHT;

    this.grid.SELECTION_BEFORE_RESIZE = {
      selectedColHeader: this.grid.SELECTED_COL_HEADER,
      selectedRowHeader: this.grid.SELECTED_ROW_HEADER,
      selectedCellRange: this.grid.SELECTED_CELL_RANGE
        ? { ...this.grid.SELECTED_CELL_RANGE }
        : null,
    };

    event.preventDefault();
    event.stopPropagation();
  }

  handleOnMouseUp(event: MouseEvent) {
    if (this.grid.RESIZING_ROW === -1) return; // Safety check

    this.grid.prefixArrayManager.updateRowHeight(this.grid.RESIZING_ROW);

    if (this.grid.SELECTION_BEFORE_RESIZE) {
      this.grid.SELECTED_COL_HEADER =
        this.grid.SELECTION_BEFORE_RESIZE.selectedColHeader;
      this.grid.SELECTED_ROW_HEADER =
        this.grid.SELECTION_BEFORE_RESIZE.selectedRowHeader;
      this.grid.SELECTED_CELL_RANGE =
        this.grid.SELECTION_BEFORE_RESIZE.selectedCellRange;

      if (this.grid.SELECTED_ROW_HEADER !== -1) {
        let y1Pos = this.grid.prefixArrayManager.getRowYPosition(
          this.grid.SELECTED_ROW_HEADER - 1
        );
        let adjustedY1 = y1Pos - this.grid.canvasContainer.scrollTop;
        this.grid.ADJUSTED_y1 = adjustedY1;
      }

      this.grid.SELECTION_BEFORE_RESIZE = null; // Clear the stored state
    }

    this.grid.RESIZING_ROW = -1;
    this.grid.HOVERED_ROW = -1;

    this.grid.render();

    event.preventDefault();
    event.stopPropagation();
  }

  handleOnMouseMouse(event: MouseEvent) {
    if (this.grid.RESIZING_ROW === -1) return; // Safety check

    const dy = event.clientY - this.grid.INITIAL_Y;
    let newHeight =
      (this.grid.ROW_HEIGHTS.get(this.grid.RESIZING_ROW) ??
        this.grid.DEFAULT_ROW_HEIGHT) + dy;
    if (newHeight < 10) newHeight = 10;

    this.grid.ROW_HEIGHTS.set(this.grid.RESIZING_ROW, newHeight);
    this.grid.INITIAL_Y = event.clientY;
    this.grid.render();

    // Draw resize indicators
    this.grid.draw.drawHorizontalLinesRowResizing(
      this.grid.RESIZING_ROW + 1,
      this.grid.viewWidth
    );

    const scrollTop = this.grid.canvasContainer.scrollTop;
    this.grid.draw.drawRowResizeIndicator(this.grid.RESIZING_ROW, scrollTop);

    if (
      event.clientY >=
      this.grid.prefixArrayManager.getRowYPosition(this.grid.RESIZING_ROW)
    ) {
      this.grid.draw.drawHorizontalDashedLine(
        this.grid.INITIAL_Y,
        this.grid.viewWidth
      );
    }

    // Prevent event propagation
    event.preventDefault();
    event.stopPropagation();
  }
}
