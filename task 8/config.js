export class Config {
  static rows = 100;
  static cols = 100;

  static defaultColumnWidth = 100;
  static defaultRowHeight = 30;
  static rowHeights = new Array(Config.rows).fill(30);
  static colWidths = new Array(Config.cols).fill(100);

  static mode = "NORMAL";

  static selectedCell = {
    row: -1,
    col: -1,
  };

  static selectedcellRange = {
    startRow: 1,
    startCol: 1,
    endRow: 1,
    endCol: 1
  };
}
