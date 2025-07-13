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
      const target:any = event.target;
      this.grid.CURRENT_INPUT = target.value;
    });

    input.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Tab") {
        this.grid.cellDataManager.saveInputToCell();
        input.style.display = "none";

        input.value="";
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
  // ✅ Save input regardless of visibility
  if (!this.grid.INPUT_FINALIZED && this.grid.CURRENT_INPUT != null) {
    console.log("Input saved by blur at", Date.now());
    this.grid.cellDataManager.saveInputToCell();
    this.grid.CURRENT_INPUT = null;
    this.grid.INPUT_FINALIZED = true;
  } else {
    // Just reset to be safe
    this.grid.CURRENT_INPUT = null;
    this.grid.INPUT_FINALIZED = false;
  }

  input.style.display = "none";
  this.grid.render();
});



    // input.addEventListener("blur", () => {
    // const isVisible = this.grid.isVisible();

    // if(!isVisible){
    //   input.style.display = "none";
    // return;
    // }

    //   if (!this.grid.INPUT_FINALIZED && this.grid.CURRENT_INPUT!=null) {
    //     console.log("input saved by blur listener at ",Date.now() / 1000);
    //     this.grid.cellDataManager.saveInputToCell();
    //         this.grid.CURRENT_INPUT = null;
    // this.grid.INPUT_FINALIZED = true;
            
    //   }
    //   else{

    //     this.grid.INPUT_FINALIZED = false;
    //     this.grid.CURRENT_INPUT = null;
    //   }
    //   input.style.display = "none";
    //   this.grid.render();
    // });
  }

  public getInputElement(): HTMLInputElement | null {
    return this.inputElement;
  }
}


