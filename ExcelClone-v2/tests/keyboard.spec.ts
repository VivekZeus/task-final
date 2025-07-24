import { test, expect } from "@playwright/test";
import { ExcelPage } from "./ExcelPage";
declare global {
  interface Window {
    grid: any;
  }
}
test("arrow key operations test", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();

  await excel.testArrowKeyOperations();

  const cellRange = await page.evaluate(() => {
    return window.grid?.SELECTED_CELL_RANGE;
  });

  expect(cellRange).toEqual({ startRow: 0, endRow: 0, startCol: 0, endCol: 0 });
});

test("shift and arrow key operations test", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();
  await page.keyboard.down("Shift");
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
  }
  await page.keyboard.up("Shift");
  const cellRange = await page.evaluate(() => {
    return window.grid?.SELECTED_CELL_RANGE;
  });

  expect(cellRange).toEqual({
    startRow: 0,
    endRow: 10,
    startCol: 0,
    endCol: 10,
  });
});

test("enter and tab key operations test", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();
  for (let i = 0; i < 5; i++) await page.keyboard.press("Enter");
  await page.waitForTimeout(3000);
  for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
  await page.waitForTimeout(3000);
  const cellRange = await page.evaluate(() => {
    return window.grid?.SELECTED_CELL_RANGE;
  });
  expect(cellRange).toEqual({
    startRow: 5,
    endRow: 5,
    startCol: 5,
    endCol: 5,
  });
});

test("enter and tab with shift key operations test", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();

  for (let i = 0; i < 5; i++) await page.keyboard.press("Enter");
  // await page.waitForTimeout(3000);
  for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
  // await page.waitForTimeout(3000);

  await page.keyboard.down("Shift");
  for (let i = 0; i < 5; i++) await page.keyboard.press("Enter");
  // await page.waitForTimeout(3000);
  for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
  // await page.waitForTimeout(3000);
  await page.keyboard.up("Shift");
  // await page.waitForTimeout(10000);
  const cellRange = await page.evaluate(() => {
    return window.grid?.SELECTED_CELL_RANGE;
  });

  expect(cellRange).toEqual({ startRow: 0, endRow: 0, startCol: 0, endCol: 0 });
});

test("copy paste data test", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();
  await excel.uploadJSON("D:/Vivek/final/task-final/ExcelClone-v2/data.json");

  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("ArrowDown");
  }
  for (let i = 0; i < 2; i++) {
    await page.keyboard.press("ArrowRight");
  }

  await page.keyboard.down("Shift");
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("ArrowDown");
  }
  for (let i = 0; i < 2; i++) {
    await page.keyboard.press("ArrowRight");
  }
  await page.keyboard.up("Shift");

  await page.keyboard.down("Control");
  await page.keyboard.press("c");
  await page.keyboard.up("Control");

  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("ArrowRight");
  }

  await page.keyboard.down("Control");
  await page.keyboard.press("v");
  await page.keyboard.up("Control");
  // await page.waitForTimeout(10000);
  const cellValue = await excel.getCellValue(4, 6);
  expect(cellValue).toBe("Jankin");
});

test("cut paste data test", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();
  await excel.uploadJSON("D:/Vivek/final/task-final/ExcelClone-v2/data.json");

  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("ArrowDown");
  }
  for (let i = 0; i < 2; i++) {
    await page.keyboard.press("ArrowRight");
  }

  await page.keyboard.down("Shift");
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("ArrowDown");
  }
  for (let i = 0; i < 2; i++) {
    await page.keyboard.press("ArrowRight");
  }
  await page.keyboard.up("Shift");

  await page.keyboard.down("Control");
  await page.keyboard.press("x");
  await page.keyboard.up("Control");

  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("ArrowRight");
  }

  await page.keyboard.down("Control");
  await page.keyboard.press("v");
  await page.keyboard.up("Control");

  const oldCellValue = await excel.getCellValue(4, 2);
  const shiftedCellValue = await excel.getCellValue(4, 6);
  console.log(oldCellValue);
  expect(shiftedCellValue == "Jankin" && oldCellValue == "").toBeTruthy();
});
