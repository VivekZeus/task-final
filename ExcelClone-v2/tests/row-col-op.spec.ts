import { test, expect } from "@playwright/test";
import { ExcelPage } from "./ExcelPage";

test("Row add below and col add right test", async ({ page }) => {
  const excelPage = new ExcelPage(page);
  await excelPage.goto();
  await page.waitForTimeout(2000);
  let jsonFilePath = "D:/Vivek/final/task-final/ExcelClone-v2/data.json";
  await excelPage.uploadJSON(jsonFilePath);

  await excelPage.clickAddRowBelow();
  await excelPage.clickAddColRight();
  await page.waitForTimeout(2000);
});

test("Row add above and col add left test", async ({ page }) => {
  const excelPage = new ExcelPage(page);
  await excelPage.goto();
  await page.waitForTimeout(2000);
  let jsonFilePath = "D:/Vivek/final/task-final/ExcelClone-v2/data.json";
  await excelPage.uploadJSON(jsonFilePath);

  await page.focus("#excelCanvas");
  for (let i = 0; i < 2; i++) await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(3000);
  for (let i = 0; i < 2; i++) await page.keyboard.press("ArrowDown");

  await excelPage.clickAddRowAbove();
  await excelPage.clickAddColLeft();
  await page.waitForTimeout(2000);
});
