import { Grid } from "./Grid.js";
import {Config} from "./Config.js"
import { HeaderData } from "./HeaderData.js";

const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("excelCanvas");
const context = canvas.getContext("2d");

// create headers data at start
HeaderData.insertHeaderData();


const grid = new Grid(
  canvasContainer,
  canvas,
  context,
  Config.TOTAL_ROWS,
  Config.TOTAL_COLUMNS,
  Config.COL_WIDTH,
  Config.ROW_HEIGHT
);

grid.render();

canvasContainer.addEventListener("scroll", (e) => {
  grid.render();
});

window.addEventListener("resize", () => {
  grid.resizeCanvas();
});


// canvas.addEventListener("mousemove", (event) => {
// canvas.style.cursor = "cell";


// const rect = canvas.getBoundingClientRect();
// const x = event.clientX - rect.left;
// const y = event.clientY - rect.top;
// console.log("x is "+x+" and y is "+y);

// });





