import { Grid } from "../Grid.js";


export class ResizingDrawingTool {
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }

  drawVerticalLinesColResizing(col: number, height: number) {
    if (this.grid.RESIZING_COL == -1) return;

    let currentResizingColPos =
      this.grid.prefixArrayManager.getColXPosition(col);

    this.grid.context.save();
    this.grid.context.strokeStyle = "#187c44";
    this.grid.context.lineWidth = 2;

    // Draw line at previous column position
    this.grid.context.beginPath();
    this.grid.context.moveTo(
      currentResizingColPos,
      this.grid.COL_HEADER_HEIGHT
    );
    this.grid.context.lineTo(currentResizingColPos, height);
    if (col != 1) {
      let prevCol = this.grid.prefixArrayManager.getColXPosition(col - 1);
      this.grid.context.moveTo(prevCol, this.grid.COL_HEADER_HEIGHT);
      this.grid.context.lineTo(prevCol, height);
    }
    this.grid.context.stroke();

    this.grid.context.restore();
  }

  drawVerticalDashedLine(x: number, height: number) {
    if (this.grid.RESIZING_COL == -1) return;

    this.grid.context.save();
    this.grid.context.strokeStyle = "#187c44"; // Green color
    this.grid.context.lineWidth = 2;

    this.grid.context.setLineDash([5, 3]); // Dash pattern: 5px line, 3px gap

    this.grid.context.beginPath();
    this.grid.context.moveTo(x, this.grid.COL_HEADER_HEIGHT);
    this.grid.context.lineTo(x, height);
    this.grid.context.stroke();

    this.grid.context.restore();
  }

  drawHorizontalDashedLine(y: number, width: number) {
    if (this.grid.RESIZING_ROW == -1) return;

    this.grid.context.save();
    this.grid.context.strokeStyle = "#187c44"; // Green color
    this.grid.context.lineWidth = 2;

    this.grid.context.setLineDash([5, 3]); // Dash pattern: 5px line, 3px gap

    this.grid.context.beginPath();
    this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, y - 100);
    this.grid.context.lineTo(width, y - 100);
    this.grid.context.stroke();

    this.grid.context.restore();
  }

  drawHorizontalLinesRowResizing(row: number, width: number) {
    if (this.grid.RESIZING_ROW == -1) return;
    let currentResizingRowPos =
      this.grid.prefixArrayManager.getRowYPosition(row);

    this.grid.context.save();
    this.grid.context.strokeStyle = "#187c44";
    this.grid.context.lineWidth = 2;

    // Draw line at previous column position
    this.grid.context.beginPath();
    this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, currentResizingRowPos);
    this.grid.context.lineTo(width, currentResizingRowPos);

    if (row != 1) {
      let prevRowPos = this.grid.prefixArrayManager.getRowYPosition(row - 1);
      this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, prevRowPos);
      this.grid.context.lineTo(width, prevRowPos);
    }
    this.grid.context.stroke();

    this.grid.context.restore();
  }

  drawResizeIndicator(colIndex: number, scrollLeft: number) {
    if (colIndex === -1) return;

    // Get the x position of the column edge (right edge of the column)
    let x =
      this.grid.prefixArrayManager.getColXPosition(colIndex) +
      (this.grid.COL_WIDTHS.get(colIndex) ?? this.grid.DEFAULT_COL_WIDTH);
    x -= scrollLeft;

    // Make sure the indicator is visible
    if (x < this.grid.ROW_HEADER_WIDTH || x > this.grid.context.canvas.width)
      return;

    const pillWidth = 6;
    const pillHeight = (this.grid.COL_HEADER_HEIGHT - 6) * 0.6; // Reduced height to 60% of original
    const radius = pillWidth / 2;

    const pillX = x - pillWidth / 2;
    const pillY = 3 + (this.grid.COL_HEADER_HEIGHT - 6 - pillHeight) / 2; // Center vertically

    this.grid.context.save();
    this.grid.context.fillStyle = "white"; // White fill
    this.grid.context.strokeStyle = "green"; // Green border
    this.grid.context.lineWidth = 1;

    // Draw pill
    this.grid.context.beginPath();
    this.grid.context.moveTo(pillX + radius, pillY);
    this.grid.context.lineTo(pillX + pillWidth - radius, pillY);
    this.grid.context.quadraticCurveTo(
      pillX + pillWidth,
      pillY,
      pillX + pillWidth,
      pillY + radius
    );
    this.grid.context.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
    this.grid.context.quadraticCurveTo(
      pillX + pillWidth,
      pillY + pillHeight,
      pillX + pillWidth - radius,
      pillY + pillHeight
    );
    this.grid.context.lineTo(pillX + radius, pillY + pillHeight);
    this.grid.context.quadraticCurveTo(
      pillX,
      pillY + pillHeight,
      pillX,
      pillY + pillHeight - radius
    );
    this.grid.context.lineTo(pillX, pillY + radius);
    this.grid.context.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
    this.grid.context.closePath();

    this.grid.context.fill(); // Fill with white
    this.grid.context.stroke(); // Stroke with green border
    this.grid.context.restore();
  }

  drawRowResizeIndicator(rowIndex: number, scrollTop: number) {
    if (rowIndex === -1) return;

    // Get the y position of the row edge (bottom edge of the row)
    let y =
      this.grid.prefixArrayManager.getRowYPosition(rowIndex) +
      (this.grid.ROW_HEIGHTS.get(rowIndex) ?? this.grid.DEFAULT_ROW_HEIGHT);
    y -= scrollTop;

    // Make sure the indicator is visible
    if (y < this.grid.COL_HEADER_HEIGHT || y > this.grid.context.canvas.height)
      return;

    const pillWidth = this.grid.ROW_HEADER_WIDTH * 0.35; // Reduced from 0.6 to 0.35 (about 35% of row header width)
    const pillHeight = 4; // Small height
    const radius = pillHeight / 2;

    const pillX = (this.grid.ROW_HEADER_WIDTH - pillWidth) / 2; // Center horizontally in row header
    const pillY = y - pillHeight / 2; // Center on the row edge

    this.grid.context.save();
    this.grid.context.fillStyle = "white"; // White fill
    this.grid.context.strokeStyle = "green"; // Green border
    this.grid.context.lineWidth = 1;

    // Draw horizontal pill
    this.grid.context.beginPath();
    this.grid.context.moveTo(pillX + radius, pillY);
    this.grid.context.lineTo(pillX + pillWidth - radius, pillY);
    this.grid.context.quadraticCurveTo(
      pillX + pillWidth,
      pillY,
      pillX + pillWidth,
      pillY + radius
    );
    this.grid.context.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
    this.grid.context.quadraticCurveTo(
      pillX + pillWidth,
      pillY + pillHeight,
      pillX + pillWidth - radius,
      pillY + pillHeight
    );
    this.grid.context.lineTo(pillX + radius, pillY + pillHeight);
    this.grid.context.quadraticCurveTo(
      pillX,
      pillY + pillHeight,
      pillX,
      pillY + pillHeight - radius
    );
    this.grid.context.lineTo(pillX, pillY + radius);
    this.grid.context.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
    this.grid.context.closePath();

    this.grid.context.fill(); // Fill with white
    this.grid.context.stroke(); // Stroke with green border
    this.grid.context.restore();
  }
}
