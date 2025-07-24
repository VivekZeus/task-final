import { test, expect } from "@playwright/test";
import { ExcelPage } from "./ExcelPage";

test("mouse cell range select test", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();
  await excel.uploadJSON("D:/Vivek/final/task-final/ExcelClone-v2/data.json");

  const box = await excel.canvas.boundingBox();
  if (!box) throw new Error("Canvas bounding box not found");

  await page.mouse.move(box.x + 300, box.y + 200);
  await page.mouse.down();
  await page.mouse.move(box.x + 300 + 100, box.y + 200 + 100);
  await page.waitForTimeout(2000);
  await page.mouse.move(box.x + 300 + 300, box.y + 200 + 300);
  await page.waitForTimeout(2000);
  await page.mouse.move(box.x + 300 + 500, box.y + 200 + 500);
  await excel.testCellRange(5, 22, 2, 7);
});

test("col header selection", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();
  await excel.uploadJSON("D:/Vivek/final/task-final/ExcelClone-v2/data.json");

  const box = await excel.canvas.boundingBox();
  if (!box) throw new Error("Canvas bounding box not found");

  await page.mouse.move(box.x + 100, box.y + 10);
  await page.mouse.down();

  await page.mouse.move(box.x + 100 + 100, box.y + 10);
  await page.waitForTimeout(1000);
  await page.mouse.move(box.x + 100 + 200, box.y + 10);
  await page.waitForTimeout(1000);
  await page.mouse.move(box.x + 100 + 400, box.y + 10);
  await page.waitForTimeout(1000);
  await page.mouse.move(box.x + 100 + 500, box.y + 10);

  await page.mouse.up();
  await excel.testColHeaderSelection(0, 5);
});

test("row header selection", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();
  await excel.uploadJSON("D:/Vivek/final/task-final/ExcelClone-v2/data.json");

  const box = await excel.canvas.boundingBox();
  if (!box) throw new Error("Canvas bounding box not found");

  await page.mouse.move(box.x + 10, box.y + 60);
  await page.mouse.down();

  await page.mouse.move(box.x + 10, box.y + 100);
  // await page.waitForTimeout(1000);
  await page.mouse.move(box.x + 10, box.y + 100 + 200);
  // await page.waitForTimeout(1000);
  await page.mouse.move(box.x + 10, box.y + 100 + 300);
  // await page.waitForTimeout(1000);
  await page.mouse.move(box.x + 10, box.y + 100 + 400);

  await page.mouse.up();
  await page.waitForTimeout(4000);
  await excel.testRowHeaderSelection(0, 15);
});

test("col resizing", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();
  await excel.uploadJSON("D:/Vivek/final/task-final/ExcelClone-v2/data.json");

  const box = await excel.canvas.boundingBox();
  if (!box) throw new Error("Canvas bounding box not found");

  await page.mouse.move(box.x + 270, box.y + 10);
  await page.mouse.down();
  await page.waitForTimeout(2000);
  let boxX = box.x + 270;
  let boxY = box.y + 40;
  for (let i = 0; i < 5; i++) {
    boxX += 80;
    await page.mouse.move(boxX, boxY);
    await page.waitForTimeout(200);
  }
  await page.mouse.up();

  await page.waitForTimeout(2000);

  await excel.testColResizing(1, 100 + 5 * 80);
});

test("row resizing", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();
  await excel.uploadJSON("D:/Vivek/final/task-final/ExcelClone-v2/data.json");

  const box = await excel.canvas.boundingBox();
  if (!box) throw new Error("Canvas bounding box not found");

  await page.mouse.move(box.x + 20, box.y + 70);
  await page.mouse.down();
  await page.waitForTimeout(2000);
  let boxX = box.x + 20;
  let boxY = box.y + 70;
  for (let i = 0; i < 5; i++) {
    boxY += 80;
    await page.mouse.move(boxX, boxY);
    await page.waitForTimeout(200);
  }
  await page.mouse.up();

  await page.waitForTimeout(2000);

  await excel.testRowResizing(0, 30 + 5 * 80);
});
