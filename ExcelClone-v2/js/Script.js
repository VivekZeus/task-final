import { Grid } from "./Grid.js";
const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("excelCanvas");
const context = canvas.getContext("2d");
function getXY(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
}
const grid = new Grid(canvasContainer, canvas, context);
grid.render();
function loadJSONData(jsonArray) {
    const cellData = new Map();
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
        console.warn("Empty or invalid JSON");
        return;
    }
    // Get column headers from first row keys
    const headers = Object.keys(jsonArray[0]);
    const headerRow = new Map();
    headers.forEach((key, colIdx) => {
        headerRow.set(colIdx, { value: key });
    });
    cellData.set(0, headerRow); // header row at row 0
    // Fill data rows
    jsonArray.forEach((rowObj, rowIndex) => {
        const rowMap = new Map();
        headers.forEach((key, colIdx) => {
            var _a;
            rowMap.set(colIdx, { value: (_a = rowObj[key]) !== null && _a !== void 0 ? _a : "" });
        });
        cellData.set(rowIndex + 1, rowMap);
    });
    grid.cellDataManager.cellData = cellData;
}
fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
    loadJSONData(data);
    grid.render();
});
canvasContainer.addEventListener("scroll", (e) => {
    grid.render();
});
window.addEventListener("resize", () => {
    grid.resizeCanvas();
});
// canvas.addEventListener("mousedown", (e) => {
//   if (grid.HOVERED_COL !== -1) {
//     grid.columnResizingManager.handleOnMouseDown(e);
//     return;
//   }
//   if (grid.HOVERED_ROW !== -1) {
//     grid.rowResizingManager.handleOnMouseDown(e);
//     return;
//   }
//   const { x, y } = getXY(e);
//   const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
//     grid.getVisibleRowCols();
//   // Handle header clicks (column/row selection)
//   if (
//     (y < grid.COL_HEADER_HEIGHT && x > grid.ROW_HEADER_WIDTH) ||
//     (y > grid.COL_HEADER_HEIGHT && x < grid.ROW_HEADER_WIDTH)
//   ) {
//     grid.headerSelectionManager.handleOnMouseDown(
//       startCol,
//       startRow,
//       endCol,
//       endRow,
//       scrollLeft,
//       scrollTop,
//       x,
//       y
//     );
//     grid.render(); // Render after selection
//     return;
//   }
//   // Handle cell selection
//   if (grid.IS_SELECTING == false) {
//     // Clear header selections when selecting cells
//     grid.SELECTED_COL_HEADER = -1;
//     grid.SELECTED_ROW_HEADER = -1;
//     grid.SELECTED_COL_RANGE = null;
//     grid.SELECTED_ROW_RANGE = null;
//     if (!grid.INPUT_FINALIZED && grid.CURRENT_INPUT != null) {
//       grid.cellDataManager.saveInputToCell();
//     }
//     grid.cellSelectionManager.handleMouseDown(
//       startCol,
//       endCol,
//       startRow,
//       endRow,
//       x,
//       y
//     );
//   }
//   grid.render();
// });
window.addEventListener("mousemove", (event) => {
    if (grid.RESIZING_COL !== -1) {
        grid.columnResizingManager.handleOnMouseMouse(event);
        return;
    }
    if (grid.RESIZING_ROW !== -1) {
        grid.rowResizingManager.handleOnMouseMouse(event);
        return;
    }
    canvas.style.cursor = "cell";
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } = grid.getVisibleRowCols();
    const prevHoveredCol = grid.HOVERED_COL;
    const prevHoveredRow = grid.HOVERED_ROW;
    grid.mouseHoverHandler.changeCursorStyleBasedOnPos(x, y, startCol, endCol, startRow, endRow);
    // Check if either hovered column or row changed
    if (prevHoveredCol !== grid.HOVERED_COL ||
        prevHoveredRow !== grid.HOVERED_ROW) {
        grid.render();
        // for drawing column indicator
        if (grid.HOVERED_COL !== -1) {
            grid.draw.drawResizeIndicator(grid.HOVERED_COL, scrollLeft);
        }
        // for drawing row indicator
        if (grid.HOVERED_ROW !== -1) {
            grid.draw.drawRowResizeIndicator(grid.HOVERED_ROW, scrollTop);
        }
    }
    // while dragging header
    if (grid.IS_SELECTING_HEADER) {
        grid.headerSelectionManager.handleOnMouseMove(startCol, startRow, endCol, endRow, scrollLeft, scrollTop, x, y, event);
        grid.render();
        return;
    }
    if (grid.IS_SELECTING) {
        grid.cellSelectionManager.handleMouseMove(startCol, endCol, startRow, endRow, x, y);
        grid.autoScrollManager.checkAutoScroll(event);
        grid.render();
    }
});
// window.addEventListener("mouseup", (e) => {
//   if (grid.RESIZING_COL !== -1) {
//     grid.columnResizingManager.handleOnMouseUp(e);
//     return;
//   }
//   if (grid.RESIZING_ROW !== -1) {
//     grid.rowResizingManager.handleOnMouseUp(e);
//     return;
//   }
//   if (grid.IS_SELECTING == true) {
//     grid.IS_SELECTING = false;
//     grid.autoScrollManager.stopAutoScroll();
//     grid.statisticsManager.updateStatistics();
//   }
//   if (grid.IS_SELECTING_HEADER == true) {
//     grid.headerSelectionManager.handleOnMouseUp();
//     grid.autoScrollManager.stopAutoScroll();
//     grid.IS_SELECTING_HEADER = false;
//   }
//   grid.render();
// });
