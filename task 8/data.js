export class Data{

    static spreadSheetData=new Map();

    constructor(){

    }

    static putData(rowCol,value){
        Data.spreadSheetData.set(rowCol,value);
    }

    static getData(rowCol){
        return Data.spreadSheetData.get(rowCol);
    }



}


