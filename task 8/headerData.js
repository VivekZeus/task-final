import { Config } from "./config.js";
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

    const max = Math.max(Config.rows, Config.cols);
      for (let i = 1; i < max; i++) {
        if (i < Config.rows) {
          HeaderData.headerSpreadSheetData.set(`${i}-0`, i.toString());
        }
        if (i < Config.cols) {
          HeaderData.headerSpreadSheetData.set(`0-${i}`, Utils.numberToColheader(i));
        }
      }

    }



}


