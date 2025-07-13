import { Grid } from "../Grid.js";
import { KeyboardKeyHandler } from "../otherManager/KeyboardKeyHandler.js";

export class DoubleClickEventOrchestrator {
  grid: Grid;
  private keyboardKeyHandler: KeyboardKeyHandler;

  constructor(grid: Grid, keyboardKeyHandler: KeyboardKeyHandler) {
    this.grid = grid;
    this.keyboardKeyHandler = keyboardKeyHandler;
    this.listen();
  }

  private listen() {
    this.grid.canvas.addEventListener("dblclick", () =>
      this.handleDoubleClick()
    );
  }

  private handleDoubleClick() {
    const input = document.querySelector(".cellInput") as HTMLInputElement;
    // console.log("input finalzed "+ this.grid.INPUT_FINALIZED);
    // console.log("input val "+ this.grid.CURRENT_INPUT);
    if (!input || !this.grid.SELECTED_CELL_RANGE) return;
    this.keyboardKeyHandler.handleDoubleClick(input);
    this.grid.render();
  }
}
