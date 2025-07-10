import { Grid } from "../Grid.js";
import { PointerEventManager } from "../manager/PointerEventManager.js";

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
    this.grid.canvas.style.cursor = "cell";

    for (const manager of this.managers) {
      console.log(manager.test(x, y, e));
      if (manager.test(x, y, e)) {
        this.currentManager = manager;
        manager.onPointerDown(x, y, e);
        break;
      }
    }
  }

  private pointerMove(e: PointerEvent) {
    if (this.currentManager) {
      const { x, y } = this.getXY(e);
      this.currentManager.onPointerMove(x, y, e);
    }
    else{
      
    }
  }

  private pointerUp(e: PointerEvent) {
    if (this.currentManager) {
      const { x, y } = this.getXY(e);
      this.currentManager.onPointerUp(x, y, e);
      this.currentManager = null;
    }
  }
}
