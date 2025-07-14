"use strict";
//   onPointerUp(x: number, y: number, event: PointerEvent): void {
//     // if (this.grid.RESIZING_COL === -1) return;
//     const newWidth =
//       this.grid.COL_WIDTHS.get(this.grid.RESIZING_COL) ??
//       this.grid.DEFAULT_COL_WIDTH;
//     const resizeCommand = new ResizeColumnCommand(
//       this.grid,
//       this.grid.RESIZING_COL,
//       newWidth
//     );
//     this.commandManager.execute(resizeCommand);
//     // Reset states
//     if (this.grid.SELECTION_BEFORE_RESIZE) {
//       this.grid.SELECTED_COL_HEADER =
//         this.grid.SELECTION_BEFORE_RESIZE.selectedColHeader;
//       this.grid.SELECTED_ROW_HEADER =
//         this.grid.SELECTION_BEFORE_RESIZE.selectedRowHeader;
//       this.grid.SELECTED_CELL_RANGE =
//         this.grid.SELECTION_BEFORE_RESIZE.selectedCellRange;
//       this.grid.SELECTION_BEFORE_RESIZE = null;
//     }
//     this.grid.RESIZING_COL = -1;
//     this.grid.HOVERED_COL = -1;
//     event.preventDefault();
//     event.stopPropagation();
//   }
