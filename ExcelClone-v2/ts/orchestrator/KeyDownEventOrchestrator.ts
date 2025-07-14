import { Grid } from "../Grid.js";
import { KeyboardKeyHandler } from "../otherManager/KeyboardKeyHandler.js";

export class KeyDownEventOrchestrator {
  grid: Grid;
  otherKeySet = new Set(["Tab", "Enter"]);
  keySet = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
  private keyboardKeyHandler: KeyboardKeyHandler;

  constructor(grid: Grid) {
    this.grid = grid;
    this.keyboardKeyHandler = new KeyboardKeyHandler(grid);
    this.listen();
  }

  getKeyboardKeyHandler() {
    return this.keyboardKeyHandler;
  }

  private listen() {
    window.addEventListener("keydown", (event) => this.handleKeyDown(event));
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    const input = document.querySelector(".cellInput") as HTMLInputElement;

    if (input && window.getComputedStyle(input).display !== "none") return;

    event.preventDefault();

    let shouldRender = false;


    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "z" &&
      !event.shiftKey
    ) {
      if (this.grid.commandManager.canUndo()) {
        this.grid.commandManager.undo();
        event.preventDefault();
        console.log("came to undo");
        this.grid.render();
      }
    }

    // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
    else if (
      (event.ctrlKey || event.metaKey) &&
      ((event.shiftKey && event.key.toLowerCase() === "z") ||
        (!event.shiftKey && event.key.toLowerCase() === "y"))
    ) {
      if (this.grid.commandManager.canRedo()) {
        console.log("came to redo");
        this.grid.commandManager.redo();
        event.preventDefault();
        this.grid.render();
      }
    } else if (this.otherKeySet.has(key)) {
      event.preventDefault();

      this.keyboardKeyHandler.handleTabEnterKeyOperations(key, event.shiftKey);

      // Show input at new cell
      const selected = this.grid.SELECTED_CELL_RANGE;
      if (selected) {
        this.grid.cellDataManager.showCellInputAtPosition("", input);
      }
    } else if (this.keyboardKeyHandler.handleColKeyboardRangeSelection(event)) {
      shouldRender = true;
    } else if (this.keyboardKeyHandler.handleRowKeyboardRangeSelection(event)) {
      shouldRender = true;
    } else if (event.shiftKey && this.keySet.has(key)) {
      if (this.keyboardKeyHandler.ifCellRangeCanShift(key)) {
        this.keyboardKeyHandler.handleShiftAndArrowKeyOperations(key);
        this.grid.statisticsManager.updateStatistics();
        shouldRender = true;
      }
    } else if (this.keySet.has(key)) {
      shouldRender = this.keyboardKeyHandler.handleArrowKeyOperations(key);
    } else if (
      (/^[a-zA-Z0-9]$/.test(key) ||
        /^[~`!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]$/.test(key)) &&
      this.grid.SELECTED_CELL_RANGE != null &&
      input
    ) {
      this.keyboardKeyHandler.handleCharacterKeyOperation(key, input);
      shouldRender = true;
    } else if (key === "Backspace" && this.grid.SELECTED_CELL_RANGE != null) {
      this.keyboardKeyHandler.handleBackspaceKeyOperation(input);
      shouldRender = true;
    } else if (key === "Delete" && this.grid.SELECTED_CELL_RANGE != null) {
      this.keyboardKeyHandler.handleDeleteKeyOperation();
      shouldRender = true;
    }

    if (shouldRender) {
      this.grid.render();
    }
  }
}
