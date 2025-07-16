export class CopyCommand {
    constructor(grid, range) {
        this.grid = grid;
        this.range = range;
    }
    execute() {
        this.grid.clipboardManager.copy(this.range);
    }
    undo() {
        // Copy operations don't need to be undone
        this.grid.clipboardManager.clearClipboard();
    }
}
