import { Config } from "./Config.js";
import { Utils } from "./Utils.js";

export class HeaderData {
  static headerSpreadSheetData = new Map();

  constructor() {}

  static putData(rowCol, value) {
    HeaderData.headerSpreadSheetData.set(rowCol, value);
  }

  static getData(rowCol) {
    return HeaderData.headerSpreadSheetData.get(rowCol);
  }

  // static insertHeaderData(){

  // const max = Math.max(Config.TOTAL_ROWS, Config.TOTAL_COLUMNS);
  //   for (let i = 1; i < max; i++) {
  //     if (i < Config.TOTAL_ROWS) {
  //       HeaderData.headerSpreadSheetData.set(`${i}-0`, i.toString());
  //     }
  //     if (i < Config.TOTAL_COLUMNS) {
  //       HeaderData.headerSpreadSheetData.set(`0-${i}`, Utils.numberToColheader(i));
  //     }
  //   }

  // }

  // need some change here put data like
  // {
  //   row->{
  //     col1:Data
  //     col2:Data
  //   }
  //   .
  //   .
  // }
  // static insertHeaderData() {
  //   const max = Math.max(Config.TOTAL_ROWS, Config.TOTAL_COLUMNS);
  //   for (let i = 1; i <= max; i++) {
  //     if (i < Config.TOTAL_ROWS) {
  //       HeaderData.headerSpreadSheetData.set(`${i}-0`, i.toString());
  //     }
  //     if (i < Config.TOTAL_COLUMNS) {
  //       HeaderData.headerSpreadSheetData.set(
  //         `0-${i}`,
  //         Utils.numberToColheader(i)
  //       );
  //     }
  //   }
  // }

  static insertHeaderData() {
    const rowCount = Config.TOTAL_ROWS;
    const colCount = Config.TOTAL_COLUMNS;

    // Set row headers
    for (let i = 1; i < rowCount; i++) {
      HeaderData.headerSpreadSheetData.set(`${i}-0`, i.toString());
    }

    // Set column headers
    for (let i = 1; i < colCount; i++) {
      HeaderData.headerSpreadSheetData.set(
        `0-${i}`,
        Utils.numberToColheader(i)
      );
    }
  }
}
