import { Grid } from "./Grid.js";
const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("excelCanvas");
const context = canvas.getContext("2d");
const grid = new Grid(canvasContainer, canvas, context);
grid.render();
canvasContainer.addEventListener("scroll", (e) => {
    grid.render();
});
window.addEventListener("resize", () => {
    grid.resizeCanvas();
});
