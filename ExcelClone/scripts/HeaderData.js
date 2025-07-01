// import { Config } from "./Config.js";
// import { Utils } from "./Utils.js";

// export class HeaderData {
//   static headerSpreadSheetData = new Map();

//   constructor() {}

//   static putData(rowCol, value) {
//     HeaderData.headerSpreadSheetData.set(rowCol, value);
//   }

//   static getData(rowCol) {
//     return HeaderData.headerSpreadSheetData.get(rowCol);
//   }


//   static insertHeaderData() {
//     const rowCount = Config.TOTAL_ROWS;
//     const colCount = Config.TOTAL_COLUMNS;

//     // Set row headers
//     for (let i = 1; i < rowCount; i++) {
//       HeaderData.headerSpreadSheetData.set(`${i}-0`, i.toString());
//     }

//     // Set column headers
//     for (let i = 1; i < colCount; i++) {
//       HeaderData.headerSpreadSheetData.set(
//         `0-${i}`,
//         Utils.numberToColheader(i)
//       );
//     }
//   }
// }
