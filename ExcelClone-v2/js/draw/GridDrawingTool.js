export class GridDrawingTool {
    constructor(gridObj) {
        this.grid = gridObj;
    }
    drawRowsCols(startRow, startCol, endRow, endCol) {
        let additional = 0.5;
        // Draw horizontal grid lines (row separators)
        for (let i = startRow; i < endRow; i++) {
            const y = this.grid.prefixArrayManager.getRowYPosition(i + 1);
            this.grid.context.moveTo(this.grid.ROW_HEADER_WIDTH, y + additional); // Usually ROW_HEADER_WIDTH
            this.grid.context.lineTo(this.grid.prefixArrayManager.getColXPosition(endCol), y + additional);
        }
        // Draw vertical grid lines (column separators)
        for (let j = startCol; j < endCol; j++) {
            const x = this.grid.prefixArrayManager.getColXPosition(j + 1);
            this.grid.context.moveTo(x + additional, this.grid.COL_HEADER_HEIGHT);
            this.grid.context.lineTo(x + additional, this.grid.prefixArrayManager.getRowYPosition(endRow));
        }
        this.grid.context.strokeStyle = "rgb(0,0,0)";
        this.grid.context.lineWidth = 0.1;
        this.grid.context.stroke();
        this.grid.context.restore();
    }
    drawColumnHeader(endCol) {
        this.grid.context.fillStyle = "#f0f0f0";
        this.grid.context.fillRect(0, 0, this.grid.prefixArrayManager.getColXPosition(endCol), this.grid.COL_HEADER_HEIGHT + 0.5);
    }
    drawRowHeader(endRow) {
        this.grid.context.fillStyle = "#f0f0f0";
        this.grid.context.fillRect(0, 0, this.grid.ROW_HEADER_WIDTH + 0.5, this.grid.prefixArrayManager.getRowYPosition(endRow));
    }
    drawCornerBox() {
        this.grid.context.fillStyle = "white";
        this.grid.context.fillRect(0, 0, this.grid.ROW_HEADER_WIDTH + 0.5, this.grid.COL_HEADER_HEIGHT + 0.5);
    }
}
