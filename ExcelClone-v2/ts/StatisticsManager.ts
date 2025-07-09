import { Grid } from "./Grid.js";

export class StatisticsManager {
  grid: Grid;

  constructor(gridObj: Grid) {
    this.grid = gridObj;
  }

  updateStatisticsUI(stats: {
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
    sd: number;
    variance: number;
  }): void {
    const { count, sum, avg, min, max, sd, variance } = stats;

    const format = (num: number) =>
      Number.isFinite(num) ? num.toFixed(2) : "N/A";

    const setText = (id: string, label: string, value: string) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = `${label}: ${value}`;
      }
    };

    setText("count", "Count", count.toString());
    setText("sum", "Sum", format(sum));
    setText("avg", "Average", format(avg));
    setText("min", "Min", format(min));
    setText("max", "Max", format(max));
    setText("sd", "SD", format(sd));
    setText("var", "Var", format(variance));
  }

  updateStatistics() {
    const { startRow, endRow, startCol, endCol } =
      this.grid.SELECTED_CELL_RANGE_STAT;
    const statsContainer = document.querySelector(
      ".statistics"
    ) as HTMLDivElement;

    if (startRow === endRow && startCol === endCol) {
      statsContainer.style.display = "none";
      return;
    }

    const numericValues = [];
    const allValues = [];

    for (let row = startRow; row <= endRow; row++) {
      const rowData: Map<number, any> =
        this.grid.cellDataManager.cellData.get(row);
      if (!rowData) continue;
      for (let col = startCol; col <= endCol; col++) {
        const cell = rowData.get(col) ?? null;
        if (cell && cell.value !== "") {
          // Count all cells with any data (including text)
          allValues.push(cell.value);

          const num = parseFloat(cell.value);
          if (!isNaN(num)) {
            numericValues.push(num);
          }
        }
      }
    }

    if (allValues.length === 0) {
      statsContainer.style.display = "none";
      return;
    }

    // Calculate statistics
    const count = allValues.length;
    const numericCount = numericValues.length;
    let sum = 0;
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for (const num of numericValues) {
      sum += num;
      if (num < min) min = num;
      if (num > max) max = num;
    }

    const avgRaw = sum / numericCount;
    const avg = Math.round(avgRaw * 10) / 10;
    const varianceRaw =
      numericValues.reduce((acc, val) => acc + Math.pow(val - avgRaw, 2), 0) /
      numericCount;
    const variance = Math.round(varianceRaw * 10) / 10;

    const sd = Math.round(Math.sqrt(varianceRaw) * 10) / 10;
    statsContainer.style.display = "flex";

    this.updateStatisticsUI({ count, sum, avg, min, max, sd, variance });
  }
}
