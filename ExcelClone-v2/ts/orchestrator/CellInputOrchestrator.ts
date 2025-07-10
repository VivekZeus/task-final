import { Grid } from "../Grid.js";

export class CellInputOrchestrator {
  private grid: Grid;
  private inputElement: HTMLInputElement | null;

  constructor(grid: Grid) {
    this.grid = grid;
    this.inputElement = document.querySelector(".cellInput");

    if (this.inputElement) {
      this.setupInputEvents();
    }
  }

  private setupInputEvents() {
    const input = this.inputElement!;

    input.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.grid.CURRENT_INPUT = target.value;
    });

    input.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Tab") {
        this.grid.INPUT_FINALIZED = true;
        this.grid.cellDataManager.saveInputToCell();
        input.style.display = "none";
        event.preventDefault();
        this.grid.render();
      }

      if (event.key === "Escape") {
        this.grid.CURRENT_INPUT = null;
        input.style.display = "none";
        this.grid.INPUT_FINALIZED = true;
        event.preventDefault();
      }
    });

    input.addEventListener("blur", () => {
      if (!this.grid.INPUT_FINALIZED) {
        this.grid.cellDataManager.saveInputToCell();
      }
      input.style.display = "none";
      this.grid.INPUT_FINALIZED = false;
      this.grid.CURRENT_INPUT = null;
      this.grid.render();
    });
  }

  public getInputElement(): HTMLInputElement | null {
    return this.inputElement;
  }
}
