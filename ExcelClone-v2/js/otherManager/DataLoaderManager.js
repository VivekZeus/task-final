export class DataLoaderManager {
    constructor(grid) {
        this.grid = grid;
        this.initEvents();
    }
    loadJSONData(jsonArray) {
        const cellData = new Map();
        if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
            console.warn("Empty or invalid JSON");
            return;
        }
        // Get column headers from first row keys
        const headers = Object.keys(jsonArray[0]);
        const headerRow = new Map();
        headers.forEach((key, colIdx) => {
            headerRow.set(colIdx, { value: key });
        });
        cellData.set(0, headerRow); // header row at row 0
        // Fill data rows
        jsonArray.forEach((rowObj, rowIndex) => {
            const rowMap = new Map();
            headers.forEach((key, colIdx) => {
                var _a;
                rowMap.set(colIdx, { value: (_a = rowObj[key]) !== null && _a !== void 0 ? _a : "" });
            });
            cellData.set(rowIndex + 1, rowMap);
        });
        this.grid.cellDataManager.cellData = cellData;
        this.grid.render();
    }
    loadCSVData(csvText) {
        const cellData = new Map();
        const rows = csvText.trim().split("\n").map((line) => line.split(","));
        if (rows.length === 0 || rows[0].length === 0) {
            console.warn("Empty or invalid CSV");
            return;
        }
        // Process each row
        rows.forEach((cols, rowIndex) => {
            const rowMap = new Map();
            cols.forEach((cell, colIndex) => {
                rowMap.set(colIndex, { value: cell.trim() });
            });
            cellData.set(rowIndex, rowMap);
        });
        this.grid.cellDataManager.cellData = cellData;
        this.grid.render();
    }
    jsonLoaderListener(event) {
        var _a;
        const target = event.target;
        const file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            try {
                const result = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                this.loadJSONData(JSON.parse(result));
            }
            catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };
        reader.onerror = () => {
            console.error("Error reading file:", reader.error);
        };
        reader.readAsText(file);
    }
    csvLoaderListener(event) {
        var _a;
        const target = event.target;
        const file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            const result = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            this.loadCSVData(result);
        };
        reader.onerror = () => {
            console.error("Error reading CSV file:", reader.error);
        };
        reader.readAsText(file);
    }
    initEvents() {
        const jsonInput = document.getElementById("jsonInput");
        jsonInput.addEventListener("change", (event) => this.jsonLoaderListener(event));
        const csvInput = document.getElementById("csvInput");
        csvInput.addEventListener("change", (event) => this.csvLoaderListener(event));
    }
}
