import { Grid } from "../Grid.js";
import { PointerEventManager } from "./PointerEventManager.js";
import { CommandManager } from "../CommandManager.js";
import { ResizeColumnCommand } from "../ResizeCommands.js";

export class ColumnResizingManager implements PointerEventManager {
  grid: Grid;
  commandManager:CommandManager;

  constructor(gridObj: Grid,commandManager: CommandManager) {
    this.grid = gridObj;
        this.commandManager = commandManager;
    
  }

  test(x: number, y: number, event: PointerEvent): boolean {
    return this.grid.HOVERED_COL !== -1;
  }

  onPointerDown(x: number, y: number, event: PointerEvent): void {
    console.log("came");
    this.grid.canvas.style.cursor = "col-resize";
    this.grid.RESIZING_COL = this.grid.HOVERED_COL;
    this.grid.INITIAL_X = event.clientX;
    this.grid.RESIZING_COL_OLD_WIDTH =
      this.grid.COL_WIDTHS.get(this.grid.RESIZING_COL) ??
      this.grid.DEFAULT_COL_WIDTH;

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

  onPointerMove(x: number, y: number, event: PointerEvent): void {
    if (this.grid.RESIZING_COL === -1) return;

    this.grid.canvas.style.cursor = "col-resize";
    const dx = event.clientX - this.grid.INITIAL_X;
    let newWidth =
      (this.grid.COL_WIDTHS.get(this.grid.RESIZING_COL) ??
        this.grid.DEFAULT_COL_WIDTH) + dx;
    if (newWidth < 10) newWidth = 10;

    this.grid.COL_WIDTHS.set(this.grid.RESIZING_COL, newWidth);
    this.grid.INITIAL_X = event.clientX;

    this.grid.render();

    this.grid.resizingDrawingTool.drawVerticalLinesColResizing(
      this.grid.RESIZING_COL + 1,
      this.grid.viewHeight
    );

    const scrollLeft = this.grid.canvasContainer.scrollLeft;
    this.grid.resizingDrawingTool.drawResizeIndicator(this.grid.RESIZING_COL, scrollLeft);

    if (
      event.clientX >=
      this.grid.prefixArrayManager.getColXPosition(this.grid.RESIZING_COL)
    ) {
      this.grid.resizingDrawingTool.drawVerticalDashedLine(
        this.grid.INITIAL_X,
        this.grid.viewHeight
      );
    }

    event.preventDefault();
    event.stopPropagation();
  }

  // onPointerUp(x: number, y: number, event: PointerEvent): void {
  //   if (this.grid.RESIZING_COL === -1) return; // Safety check
  //   this.grid.prefixArrayManager.updateColumnWidth(this.grid.RESIZING_COL);
  //   // this.grid.canvas.style.cursor = "cell";

  //   if (this.grid.SELECTION_BEFORE_RESIZE) {
  //     this.grid.SELECTED_COL_HEADER =
  //       this.grid.SELECTION_BEFORE_RESIZE.selectedColHeader;
  //     this.grid.SELECTED_ROW_HEADER =
  //       this.grid.SELECTION_BEFORE_RESIZE.selectedRowHeader;
  //     this.grid.SELECTED_CELL_RANGE =
  //       this.grid.SELECTION_BEFORE_RESIZE.selectedCellRange;
  //     this.grid.SELECTION_BEFORE_RESIZE = null;
  //   }

  //   this.grid.RESIZING_COL = -1;
  //   this.grid.HOVERED_COL = -1;

  //   this.grid.render();

  //   event.preventDefault();
  //   event.stopPropagation();
  // }

  onPointerUp(x: number, y: number, event: PointerEvent): void {
        if (this.grid.RESIZING_COL === -1) return;

        const newWidth = this.grid.COL_WIDTHS.get(this.grid.RESIZING_COL) ?? this.grid.DEFAULT_COL_WIDTH;
        const resizeCommand = new ResizeColumnCommand(
            this.grid,
            this.grid.RESIZING_COL,
            newWidth
        );
        this.commandManager.execute(resizeCommand);

        // Reset states
        if (this.grid.SELECTION_BEFORE_RESIZE) {
            this.grid.SELECTED_COL_HEADER = this.grid.SELECTION_BEFORE_RESIZE.selectedColHeader;
            this.grid.SELECTED_ROW_HEADER = this.grid.SELECTION_BEFORE_RESIZE.selectedRowHeader;
            this.grid.SELECTED_CELL_RANGE = this.grid.SELECTION_BEFORE_RESIZE.selectedCellRange;
            this.grid.SELECTION_BEFORE_RESIZE = null;
        }

        this.grid.RESIZING_COL = -1;
        this.grid.HOVERED_COL = -1;

        event.preventDefault();
        event.stopPropagation();
    }
}
