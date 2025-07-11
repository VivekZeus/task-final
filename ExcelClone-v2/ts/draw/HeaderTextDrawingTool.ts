import { Grid } from "../Grid.js";
import { Utils } from "../Utils.js";

export class HeaderTextDrawingTool {
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }

  insertRowHeaderText(startRow: number, endRow: number, scrollTop: number) {
    const paddingX = 5;

    for (let row = startRow; row <= endRow; row++) {
      const text = (row + 1).toString();
      const pos = this.grid.getPosition(row, 0);

      const height =
        this.grid.ROW_HEIGHTS.get(row) ?? this.grid.DEFAULT_ROW_HEIGHT;

      const textY = pos.y - scrollTop + height / 2 + this.grid.TEXT_PADDING_Y;

      const measuredWidth = this.grid.context.measureText(text).width;
      let textX = pos.x - measuredWidth - paddingX;
      textX = row == startRow ? textX - 4: textX;

      this.grid.context.font = "18px sans-serif";
      this.grid.context.fillStyle = "rgba(0, 0, 0, 0.7)";
      this.grid.context.textAlign = "left";
      this.grid.context.textBaseline = "middle";

      this.grid.context.fillText(text, textX, textY);
    }
  }

  insertColHeaderText(startCol: number, endCol: number, scrollLeft: number) {
    for (let col = startCol; col <= endCol; col++) {
      const text = Utils.numberToColheader(col);

      const pos = this.grid.getPosition(0, col);
      const width =
        this.grid.COL_WIDTHS.get(col) ?? this.grid.DEFAULT_COL_WIDTH;

      const textX = pos.x - scrollLeft + width / 2;
      const textY = this.grid.COL_HEADER_HEIGHT / 2 + this.grid.TEXT_PADDING_Y;

      this.grid.context.font = "18px sans-serif";
      this.grid.context.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.grid.context.textAlign = "center";
      this.grid.context.textBaseline = "middle";

      this.grid.context.fillText(text, textX, textY);
    }
  }
}
