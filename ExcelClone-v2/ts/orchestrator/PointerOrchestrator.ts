import { Grid } from "../Grid.js";
import { PointerEventManager } from "../manager/PointerEventManager.js";
import { MouseHoverManager } from "../manager/MouseHoverManager.js";

export class PointerOrchestrator {
  private grid: Grid;
  private managers: PointerEventManager[] = [];
  private currentManager: PointerEventManager | null = null;

  constructor(grid: Grid) {
    this.grid = grid;
    this.setupListeners();
  }

  private getXY(e: PointerEvent) {
    const rect = this.grid.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  public registerManager(manager: PointerEventManager) {
    this.managers.push(manager);
  }

  private setupListeners() {
    const canvas = this.grid.canvas;
    canvas.addEventListener("pointerdown", (e) => this.pointerDown(e));
    window.addEventListener("pointermove", (e) => this.pointerMove(e));
    window.addEventListener("pointerup", (e) => this.pointerUp(e));
  }

  private pointerDown(e: PointerEvent) {
    const { x, y } = this.getXY(e);
    const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
      this.grid.getVisibleRowCols();
    this.grid.canvas.style.cursor = "cell";

    for (const manager of this.managers) {
      if (manager.test(x, y, e) && !(manager instanceof MouseHoverManager)) {
        this.currentManager = manager;
        manager.onPointerDown(
          x,
          y,
          e,
          startRow,
          endRow,
          startCol,
          endCol,
          scrollLeft,
          scrollTop
        );
        break;
      }
    }
  }

  private pointerMove(e: PointerEvent) {
    const { x, y } = this.getXY(e);
    if (this.currentManager) {
      const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
        this.grid.getVisibleRowCols();
      this.currentManager.onPointerMove(
        x,
        y,
        e,
        startRow,
        endRow,
        startCol,
        endCol,
        scrollLeft,
        scrollTop
      );
    } else {
      const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
        this.grid.getVisibleRowCols();
      this.managers[0].onPointerMove(
        x,
        y,
        e,
        startRow,
        endRow,
        startCol,
        endCol,
        scrollLeft,
        scrollTop
      );
    }
  }

  private pointerUp(e: PointerEvent) {
    if (this.currentManager) {
      const { x, y } = this.getXY(e);
      const { startRow, endRow, startCol, endCol, scrollLeft, scrollTop } =
        this.grid.getVisibleRowCols();
      this.currentManager.onPointerUp(
        x,
        y,
        e,
        startRow,
        endRow,
        startCol,
        endCol,
        scrollLeft,
        scrollTop
      );
      this.currentManager = null;
      this.grid.render();
    }
  }
}
