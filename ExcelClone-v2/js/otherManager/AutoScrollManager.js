export class AutoScrollManager {
    constructor(gridObj) {
        this.margin = 15; // Reduced margin for better control
        this.grid = gridObj;
        this.step = this.step.bind(this);
    }
    step() {
        if (!this.grid.autoScrollDir)
            return;
        const scrollStep = 5; // Reduced scroll step for smoother movement
        if (this.grid.autoScrollDir === "down")
            this.grid.canvasContainer.scrollTop += scrollStep;
        else if (this.grid.autoScrollDir === "up")
            this.grid.canvasContainer.scrollTop -= scrollStep;
        else if (this.grid.autoScrollDir === "right")
            this.grid.canvasContainer.scrollLeft += scrollStep;
        else if (this.grid.autoScrollDir === "left")
            this.grid.canvasContainer.scrollLeft -= scrollStep;
        this.grid.autoScrollFrameId = requestAnimationFrame(this.step);
    }
    checkAutoScroll(event) {
        const { left, top, right, bottom } = this.grid.canvas.getBoundingClientRect();
        // Only auto-scroll if we're not in the header area for vertical scrolling
        const isInHeaderArea = event.clientY < (top + this.grid.COL_HEADER_HEIGHT);
        if (event.clientY > bottom - this.margin && !isInHeaderArea) {
            this.startAutoScroll("down");
        }
        else if (event.clientY < top + this.margin && !isInHeaderArea) {
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
}
