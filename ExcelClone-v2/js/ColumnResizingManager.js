"use strict";
// import { Grid } from "./Grid.js";
// export class ColumnResizingManager {
//   grid: Grid;
//   constructor(gridObj: Grid) {
//     this.grid = gridObj;
//   }
//   handleOnMouseDown(event: MouseEvent) {
//     this.grid.RESIZING_COL = this.grid.HOVERED_COL;
//     this.grid.INITIAL_X = event.clientX;
//     this.grid.RESIZING_COL_OLD_WIDTH =
//       this.grid.COL_WIDTHS.get(this.grid.RESIZING_COL) ??
//       this.grid.DEFAULT_COL_WIDTH;
//     // Store the current selection state before resizing
//     this.grid.SELECTION_BEFORE_RESIZE = {
//       selectedColHeader: this.grid.SELECTED_COL_HEADER,
//       selectedRowHeader: this.grid.SELECTED_ROW_HEADER,
//       selectedCellRange: this.grid.SELECTED_CELL_RANGE
//         ? { ...this.grid.SELECTED_CELL_RANGE }
//         : null,
//     };
//     // Prevent event propagation to avoid triggering other mousedown handlers
//     event.preventDefault();
//     event.stopPropagation();
//   }
//   handleOnMouseUp(event: MouseEvent) {
//     if (this.grid.RESIZING_COL === -1) return; // Safety check
//     this.grid.prefixArrayManager.updateColumnWidth(this.grid.RESIZING_COL);
//     // Restore the selection state that existed before resizing
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
//     this.grid.render();
//     // Prevent event propagation
//     event.preventDefault();
//     event.stopPropagation();
//   }
//   handleOnMouseMouse(event: MouseEvent) {
//     if (this.grid.RESIZING_COL === -1) return; // Safety check
//     const dx = event.clientX - this.grid.INITIAL_X;
//     let newWidth =
//       (this.grid.COL_WIDTHS.get(this.grid.RESIZING_COL) ??
//         this.grid.DEFAULT_COL_WIDTH) + dx;
//     if (newWidth < 10) newWidth = 10;
//     this.grid.COL_WIDTHS.set(this.grid.RESIZING_COL, newWidth);
//     this.grid.INITIAL_X = event.clientX;
//     // Don't clear selections during resize - keep them intact
//     this.grid.render();
//     this.grid.draw.drawVerticalLinesColResizing(
//       this.grid.RESIZING_COL + 1,
//       this.grid.viewHeight
//     );
//     const scrollLeft = this.grid.canvasContainer.scrollLeft;
//     this.grid.draw.drawResizeIndicator(this.grid.RESIZING_COL, scrollLeft);
//     if (
//       event.clientX >=
//       this.grid.prefixArrayManager.getColXPosition(this.grid.RESIZING_COL)
//     ) {
//       this.grid.draw.drawVerticalDashedLine(
//         this.grid.INITIAL_X,
//         this.grid.viewHeight
//       );
//     }
//     // Prevent event propagation
//     event.preventDefault();
//     event.stopPropagation();
//   }
// }
