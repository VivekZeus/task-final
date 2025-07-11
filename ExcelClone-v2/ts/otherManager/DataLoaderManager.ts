import { Grid } from "../Grid";

export class DataLoaderManager {
  grid: Grid;

  constructor(grid: Grid) {
    this.grid = grid;
    this.initEvents();
  }

  private loadJSONData(jsonArray: any) {
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
      rowMap.set(colIdx, { value: rowObj[key] ?? "" });
    });
    cellData.set(rowIndex + 1, rowMap);
  });

  this.grid.cellDataManager.cellData = cellData;
  this.grid.render();
}
private loadCSVData(csvText: string) {
  const cellData = new Map<number, Map<number, { value: string }>>();

  const rows = csvText.trim().split("\n").map((line) => line.split(","));

  if (rows.length === 0 || rows[0].length === 0) {
    console.warn("Empty or invalid CSV");
    return;
  }

  // Process each row
  rows.forEach((cols, rowIndex) => {
    const rowMap = new Map<number, { value: string }>();

    cols.forEach((cell, colIndex) => {
      rowMap.set(colIndex, { value: cell.trim() });
    });

    cellData.set(rowIndex, rowMap);
  });

  this.grid.cellDataManager.cellData = cellData;
  this.grid.render();
}



  private jsonLoaderListener(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result as string;
        this.loadJSONData(JSON.parse(result));
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    reader.onerror = () => {
      console.error("Error reading file:", reader.error);
    };

    reader.readAsText(file);
  }

  private csvLoaderListener(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      this.loadCSVData(result);
    };

    reader.onerror = () => {
      console.error("Error reading CSV file:", reader.error);
    };

    reader.readAsText(file);
  }

  private initEvents() {
    const jsonInput = document.getElementById("jsonInput") as HTMLInputElement;
    jsonInput.addEventListener("change", (event) =>
      this.jsonLoaderListener(event)
    );
    const csvInput = document.getElementById("csvInput") as HTMLInputElement;
    csvInput.addEventListener("change", (event: Event) =>
      this.csvLoaderListener(event)
    );
  }
}
