import { test, expect } from "@playwright/test";
import { ExcelPage } from "./ExcelPage";

declare global {
  interface Window {
    grid: any;
  }
}

test("json data loader test", async ({ page }) => {
  const excelPage = new ExcelPage(page);
  await excelPage.goto();
  await page.waitForTimeout(2000);
  let jsonFilePath = "D:/Vivek/final/task-final/ExcelClone-v2/data.json";
  await excelPage.uploadJSON(jsonFilePath);
  await page.waitForTimeout(3000);
  const cellValue = await page.evaluate(() => {
    return window.grid.cellDataManager.cellData.get(1)?.get(0)?.value;
  });
  expect(cellValue).toBe(1);
});

test("csv data loader test", async ({ page }) => {
  const excelPage = new ExcelPage(page);
  await excelPage.goto();
  await page.waitForTimeout(2000);
  const csvFilePath =
    "D:/Vivek/final/excel working/task-final/ExcelClone-v2/titanic.csv";
  await excelPage.uploadCSV(csvFilePath);
  await page.waitForTimeout(3000);
    const cellValue = await page.evaluate(() => {
    return window.grid.cellDataManager.cellData.get(1)?.get(0)?.value;
  });
  expect(cellValue).toBe("1");
});
