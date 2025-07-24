import { test, expect } from "@playwright/test";
import { ExcelPage } from "./ExcelPage";

test("scroll test", async ({ page }) => {
  const excel = new ExcelPage(page);
  await excel.goto();
  await excel.waitForCanvas();

  await excel.moveMouseToCanvasCenter();
  await excel.scrollVertically(400);
  await page.waitForTimeout(1000);

  await excel.scrollHorizontally(400);
  await page.waitForTimeout(1000);
});
