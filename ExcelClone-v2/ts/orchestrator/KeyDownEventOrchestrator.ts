import { CopyCommand } from "../CopyCommand.js";
import { CutCommand } from "../CutCommand.js";
import { Grid } from "../Grid.js";
import { KeyboardKeyHandler } from "../otherManager/KeyboardKeyHandler.js";
import { PasteCommand } from "../PasteCommand.js";

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

    private handleCopy(): void {
    const range = this.grid.SELECTED_CELL_RANGE;
    const command = new CopyCommand(this.grid, range);
    this.grid.commandManager.execute(command);
  }

  private handleCut(): void {
    const range = this.grid.SELECTED_CELL_RANGE;
    const command = new CutCommand(this.grid, range);
    this.grid.commandManager.execute(command);
    this.grid.render();
  }

  private handlePaste(): void {
    if (!this.grid.clipboardManager.hasCopiedData()) {
      console.log("No data to paste");
      return;
    }

    const targetRange = {
      startRow: this.grid.SELECTED_CELL_RANGE.startRow,
      startCol: this.grid.SELECTED_CELL_RANGE.startCol,
      endRow: this.grid.SELECTED_CELL_RANGE.startRow, // Will be updated by paste command
      endCol: this.grid.SELECTED_CELL_RANGE.startCol  // Will be updated by paste command
    };

    const command = new PasteCommand(this.grid, targetRange);
    this.grid.commandManager.execute(command);
    this.grid.render();
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    const input = document.querySelector(".cellInput") as HTMLInputElement;

    if (input && window.getComputedStyle(input).display !== "none") return;

    event.preventDefault();

    let shouldRender = false;


    // Check for Ctrl+C (Copy)
    if (event.ctrlKey && event.key === 'c' && this.grid.SELECTED_CELL_RANGE) {
      event.preventDefault();
      this.handleCopy();
    }
    // Check for Ctrl+X (Cut)
    else if (event.ctrlKey && event.key === 'x' && this.grid.SELECTED_CELL_RANGE) {
      event.preventDefault();
      this.handleCut();
    }
    // Check for Ctrl+V (Paste)
    else if (event.ctrlKey && event.key === 'v' && this.grid.SELECTED_CELL_RANGE) {
      event.preventDefault();
      this.handlePaste();
    }
  





   else if (
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
