import { test, expect } from "@playwright/test";
import { ExcelPage } from "./ExcelPage";

test("basic input test", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();

  await excel.pressArrowsDownRight(4, 2); // Should land at (4, 2)
  await excel.typeText("Hey hello this is a test", 400);
  await excel.pressKeys("Enter", "Enter");

  const value = await excel.getCellValue(4, 2);
  expect(value).toBe("Hey hello this is a test");
});

test("basic input test with escape", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();

  await excel.pressArrowsDownRight(4, 2);
  await excel.typeText("Hey hello this is a test", 100);
  await excel.pressKeys("Escape", "ArrowRight");

  const value = await excel.getCellValue(4, 2);
  expect(value).toBeUndefined(); // or .toBe("") if you clear on escape
});


test("basic input test with double click", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();

  await excel.uploadJSON("D:/Vivek/final/task-final/ExcelClone-v2/data.json");
  await excel.doubleClickAt(300, 500);

  await page.waitForTimeout(4000);
  await excel.typeText("continuing some text", 100);
  await excel.pressKeys("Enter");

  await page.waitForTimeout(4000);

  const cellValue=await excel.getCellValue(15,2);
  expect(cellValue).toBe("Mongercontinuing some text");
});