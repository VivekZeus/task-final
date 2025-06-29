import { Config } from "./Config.js";

export class Draw{

    constructor(){

    }


  static drawRowsCols(startRow,startCol,endRow,endCol,canvas,context) {

    console.log("Drawing rows from", startRow, "to", endRow, "and cols", startCol, "to", endCol);


    let additional=0.5+Config.COL_HEADER_HEIGHT
    for (let i = startRow; i < endRow; i++) {
      let y = i * Config.ROW_HEIGHTS[i] + additional;
      context.moveTo(startCol * Config.COL_WIDTHS[i], y);
      context.lineTo(endCol * Config.COL_WIDTHS[i], y);
  }


    additional= 0.5+Config.ROW_HEADER_WIDTH;
    for (let j = startCol; j < endCol; j++) {
      let x = j * Config.COL_WIDTHS[j] +additional;
      context.moveTo(x, startRow * Config.ROW_HEIGHTS[j]);
      context.lineTo(x, endRow * Config.ROW_HEIGHTS[j]);
    }

    context.strokeStyle = "rgb(0,0,0)";
    context.lineWidth = 0.1;
    context.stroke();
    context.restore();



  }

  static drawColumnHeader(startRow,startCol,endRow,endCol,canvas,context,scrollLeft,scrollTop){
    let totalColWidth = Config.getColumnWidthSum(startCol,endCol);
    let totalRowHeight = Config.getRowHeightSum(startRow,endRow);
    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, totalColWidth, Config.COL_HEADER_HEIGHT+0.5);
    context.fillRect(0, 0, Config.ROW_HEADER_WIDTH+0.5, totalRowHeight);

    // context.save();
    // context.translate(-scrollLeft, -scrollTop);
    // context.beginPath();

    // let additional= 0.5+Config.ROW_HEADER_WIDTH;
    // for (let j = startCol; j < endCol; j++) {
    //   let x = j * Config.COL_WIDTHS[j] +additional;
    //   context.moveTo(x, startRow * Config.ROW_HEIGHTS[j]);
    //   context.lineTo(x, endRow * Config.ROW_HEIGHTS[j]);
    //   break;
    // }

    // context.strokeStyle = "rgb(0,0,0)";
    // context.lineWidth = 0.1;
    // context.stroke();
    // context.restore();
  }
}