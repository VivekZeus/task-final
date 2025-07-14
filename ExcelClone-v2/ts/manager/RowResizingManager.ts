import { CommandManager } from "../command/CommandManager.js";
import { Grid } from "../Grid.js";
import { PointerEventManager } from "./PointerEventManager.js";
import { ResizeRowCommand } from "../command/ResizeRowCommand.js";

export class RowResizingManager implements PointerEventManager {
  grid: Grid;
  commandManager: CommandManager;

  constructor(grid: Grid, commandManager: CommandManager) {
    this.commandManager = commandManager;
    this.grid = grid;
  }
  test(x: number, y: number, e: PointerEvent): boolean {
    return this.grid.HOVERED_ROW !== -1;
  }

  onPointerDown(x: number, y: number, e: PointerEvent): void {
    this.grid.RESIZING_ROW = this.grid.HOVERED_ROW;
    this.grid.INITIAL_Y = e.clientY;
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

    e.preventDefault();
    e.stopPropagation();
  }
  onPointerMove(x: number, y: number, event: PointerEvent): void {
    if (this.grid.RESIZING_ROW === -1) return; // Safety check

    const dy = event.clientY - this.grid.INITIAL_Y;
    let newHeight =
      (this.grid.ROW_HEIGHTS.get(this.grid.RESIZING_ROW) ??
        this.grid.DEFAULT_ROW_HEIGHT) + dy;
    if (newHeight < 10) newHeight = 10;

    this.grid.ROW_HEIGHTS.set(this.grid.RESIZING_ROW, newHeight);
    this.grid.INITIAL_Y = event.clientY;
    this.grid.render();

    this.grid.resizingDrawingTool.drawHorizontalLinesRowResizing(
      this.grid.RESIZING_ROW + 1,
      this.grid.viewWidth
    );

    const scrollTop = this.grid.canvasContainer.scrollTop;
    this.grid.resizingDrawingTool.drawRowResizeIndicator(
      this.grid.RESIZING_ROW,
      scrollTop
    );

    if (
      event.clientY >=
      this.grid.prefixArrayManager.getRowYPosition(this.grid.RESIZING_ROW)
    ) {
      this.grid.resizingDrawingTool.drawHorizontalDashedLine(
        this.grid.INITIAL_Y,
        this.grid.viewWidth
      );
    }

    // Prevent event propagation
    event.preventDefault();
    event.stopPropagation();
  }

  onPointerUp(x: number, y: number, e: PointerEvent): void {
    
    const resizeCommand = new ResizeRowCommand(
      this.grid,
      this.grid.RESIZING_ROW,
      this.grid.RESIZING_ROW_OLD_HEIGHT,
      this.grid.ROW_HEIGHTS.get(this.grid.RESIZING_ROW) ??
        this.grid.DEFAULT_ROW_HEIGHT
    );
    this.commandManager.execute(resizeCommand);


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

    e.preventDefault();
    e.stopPropagation();
  }


}
