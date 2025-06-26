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



}


