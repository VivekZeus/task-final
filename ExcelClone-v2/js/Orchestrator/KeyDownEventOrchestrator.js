import { KeyboardKeyHandler } from "../KeyboardKeyHandler.js";
export class KeyDownEventOrchestrator {
    constructor(grid) {
        this.otherKeySet = new Set(["Tab", "Enter"]);
        this.keySet = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
        this.grid = grid;
        this.keyboardKeyHandler = new KeyboardKeyHandler(grid);
        this.listen();
    }
    getKeyboardKeyHandler() {
        return this.keyboardKeyHandler;
    }
    listen() {
        window.addEventListener("keydown", (event) => this.handleKeyDown(event));
    }
    handleKeyDown(event) {
        const key = event.key;
        const input = document.querySelector(".cellInput");
        if (input && window.getComputedStyle(input).display !== "none")
            return;
        event.preventDefault();
        let shouldRender = false;
        if (this.otherKeySet.has(key)) {
            shouldRender = this.keyboardKeyHandler.handleTabEnterKeyOperations(key, event.shiftKey);
        }
        else if (this.keyboardKeyHandler.handleColKeyboardRangeSelection(event)) {
            shouldRender = true;
        }
        else if (this.keyboardKeyHandler.handleRowKeyboardRangeSelection(event)) {
            shouldRender = true;
        }
        else if (event.shiftKey && this.keySet.has(key)) {
            if (this.keyboardKeyHandler.ifCellRangeCanShift(key)) {
                this.keyboardKeyHandler.handleShiftAndArrowKeyOperations(key);
                this.grid.statisticsManager.updateStatistics();
                shouldRender = true;
            }
        }
        else if (this.keySet.has(key)) {
            shouldRender = this.keyboardKeyHandler.handleArrowKeyOperations(key);
        }
        else if ((/^[a-zA-Z0-9]$/.test(key) ||
            /^[~`!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]$/.test(key)) &&
            this.grid.SELECTED_CELL_RANGE != null &&
            input) {
            this.keyboardKeyHandler.handleCharacterKeyOperation(key, input);
            shouldRender = true;
        }
        else if (key === "Backspace" && this.grid.SELECTED_CELL_RANGE != null) {
            this.keyboardKeyHandler.handleBackspaceKeyOperation(input);
            shouldRender = true;
        }
        else if (key === "Delete" && this.grid.SELECTED_CELL_RANGE != null) {
            this.keyboardKeyHandler.handleDeleteKeyOperation();
            shouldRender = true;
        }
        if (shouldRender) {
            this.grid.render();
        }
    }
}
