export class CommandManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }
    execute(command) {
        command.execute();
        this.undoStack.push(command);
        // Clear redo stack when a new command is executed
        this.redoStack = [];
    }
    undo() {
        const command = this.undoStack.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }
    redo() {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.undoStack.push(command);
        }
    }
    canUndo() {
        return this.undoStack.length > 0;
    }
    canRedo() {
        return this.redoStack.length > 0;
    }
}
