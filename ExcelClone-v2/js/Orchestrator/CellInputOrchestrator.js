export class CellInputOrchestrator {
    constructor(grid) {
        this.grid = grid;
        this.inputElement = document.querySelector(".cellInput");
        if (this.inputElement) {
            this.setupInputEvents();
        }
    }
    setupInputEvents() {
        const input = this.inputElement;
        input.addEventListener("input", (event) => {
            const target = event.target;
            this.grid.CURRENT_INPUT = target.value;
        });
        input.addEventListener("keydown", (event) => {
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
                input.style.display = "none";
            }
            input.style.display = "none";
            this.grid.INPUT_FINALIZED = false;
            this.grid.CURRENT_INPUT = null;
            this.grid.render();
        });
    }
    getInputElement() {
        return this.inputElement;
    }
}
