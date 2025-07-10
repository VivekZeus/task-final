export class AutoScrollManager {
    constructor(gridObj) {
        this.margin = 30;
        this.grid = gridObj;
        this.step = this.step.bind(this);
    }
    step() {
        if (!this.grid.autoScrollDir)
            return;
        if (this.grid.autoScrollDir === "down")
            this.grid.canvasContainer.scrollTop += 10;
        else if (this.grid.autoScrollDir === "up")
            this.grid.canvasContainer.scrollTop -= 10;
        else if (this.grid.autoScrollDir === "right")
            this.grid.canvasContainer.scrollLeft += 10;
        else if (this.grid.autoScrollDir === "left")
            this.grid.canvasContainer.scrollLeft -= 10;
        this.grid.autoScrollFrameId = requestAnimationFrame(this.step);
    }
    startAutoScroll(direction) {
        this.grid.autoScrollDir = direction;
        if (this.grid.autoScrollFrameId !== null)
            return;
        this.step();
    }
    stopAutoScroll() {
        this.grid.autoScrollDir = null;
        if (this.grid.autoScrollFrameId !== null) {
            cancelAnimationFrame(this.grid.autoScrollFrameId);
            this.grid.autoScrollFrameId = null;
        }
    }
    checkAutoScroll(event) {
        const { left, top, right, bottom } = this.grid.canvas.getBoundingClientRect();
        if (event.clientY > bottom - this.margin) {
            this.startAutoScroll("down");
        }
        else if (event.clientY < top + this.margin) {
            this.startAutoScroll("up");
        }
        else if (event.clientX > right - this.margin) {
            this.startAutoScroll("right");
        }
        else if (event.clientX < left + this.margin) {
            this.startAutoScroll("left");
        }
        else {
            this.stopAutoScroll();
        }
    }
}
