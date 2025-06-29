import { Config } from "./Config.js";
import { Utils } from "./Utils.js";

export class HeaderData{

    static headerSpreadSheetData=new Map();

    constructor(){

    }

    static putData(rowCol,value){
        HeaderData.headerSpreadSheetData.set(rowCol,value);
    }

    static getData(rowCol){
        return HeaderData.headerSpreadSheetData.get(rowCol);
    }

    static insertHeaderData(){

    const max = Math.max(Config.TOTAL_ROWS, Config.TOTAL_COLUMNS);
      for (let i = 1; i < max; i++) {
        if (i < Config.TOTAL_ROWS) {
          HeaderData.headerSpreadSheetData.set(`${i}-0`, i.toString());
        }
        if (i < Config.TOTAL_COLUMNS) {
          HeaderData.headerSpreadSheetData.set(`0-${i}`, Utils.numberToColheader(i));
        }
      }

    }



}


