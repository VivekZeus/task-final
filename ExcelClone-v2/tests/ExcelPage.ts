import { test, expect, Locator, Page } from "@playwright/test";

declare global {
  interface Window {
    grid: any;
  }
}

export class ExcelPage {
  page: Page;

  jsonInput: Locator;
  csvInput: Locator;

  canvas: Locator;

  addRowAboveButton: Locator;
  addRowBelowButton: Locator;
  addColRightButton: Locator;
  addColLeftButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.canvas = page.locator("#excelCanvas");
    this.jsonInput = page.locator("#jsonInput");
    this.csvInput = page.locator("#csvInput");
    this.addRowBelowButton = page.locator("#addRowBelow");
    this.addRowAboveButton = page.locator("#addRowAbove");
    this.addColLeftButton = page.locator("#addColLeft");
    this.addColRightButton = page.locator("#addColRight");
  }

  async goto() {
    await this.page.goto("http://127.0.0.1:5500/");
  }

  async waitForCanvas() {
    await this.canvas.waitFor({ state: "visible" });
  }

  async moveMouseToCanvasCenter() {
    const box = await this.canvas.boundingBox();
    if (!box) throw new Error("Canvas bounding box not found");

    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  }

  async scrollVertically(pixels: number) {
    await this.page.mouse.wheel(0, pixels);
  }

  async scrollHorizontally(pixels: number) {
    await this.page.mouse.wheel(pixels, 0);
  }

  async uploadJSON(filePath: string) {
    await this.jsonInput.setInputFiles(filePath);
  }

  async uploadCSV(filePath: string) {
    await this.csvInput.setInputFiles(filePath);
  }

  async doubleClickAt(x: number, y: number) {
    const box = await this.canvas.boundingBox();
    if (!box) throw new Error("Canvas bounding box not found");

    await this.page.mouse.dblclick(box.x + x, box.y + y);
  }

  async clickAddRowAbove() {
    this.addRowAboveButton.click();
  }
  async clickAddRowBelow() {
    this.addRowBelowButton.click();
  }
  async clickAddColLeft() {
    this.addColLeftButton.click();
  }
  async clickAddColRight() {
    this.addColRightButton.click();
  }

  async pressArrowsDownRight(down: number, right: number) {
    for (let i = 0; i < down; i++) await this.page.keyboard.press("ArrowDown");
    for (let i = 0; i < right; i++)
      await this.page.keyboard.press("ArrowRight");
  }

  async typeText(text: string, delay = 100) {
    await this.page.keyboard.type(text, { delay });
  }

  async pressKeys(...keys: string[]) {
    for (const key of keys) {
      await this.page.keyboard.press(key);
    }
  }

  async getCellValue(row: number, col: number) {
    return await this.page.evaluate(
      ([r, c]) => {
        return window.grid?.cellDataManager?.cellData.get(r)?.get(c)?.value;
      },
      [row, col]
    );
  }

  async testArrowKeyOperations() {
    await this.page.keyboard.press("ArrowRight");
    await this.page.keyboard.press("ArrowDown");
    // await this.page.waitForTimeout(2000);
    await this.page.keyboard.press("ArrowLeft");
    // await this.page.waitForTimeout(2000);
    await this.page.keyboard.press("ArrowUp");
  }

  async testCellRange(
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number
  ) {
    const cellRange = await this.page.evaluate(() => {
      return window.grid?.SELECTED_CELL_RANGE;
    });

    expect(cellRange).toEqual({
      startRow: startRow,
      endRow: endRow,
      startCol: startCol,
      endCol: endCol,
    });
  }

  async testColHeaderSelection(startCol: number, endCol: number) {
    const startColHeader = await this.page.evaluate(() => {
      return window.grid?.HEADER_SELECTION_START_COL;
    });
    const endColHeader = await this.page.evaluate(() => {
      return window.grid?.HEADER_SELECTION_END_COL;
    });
    expect(startCol == startColHeader && endCol == endColHeader).toBeTruthy();
  }

  async testRowHeaderSelection(startRow: number, endRow: number) {
    const startColHeader = await this.page.evaluate(() => {
      return window.grid?.HEADER_SELECTION_START_ROW;
    });
    const endColHeader = await this.page.evaluate(() => {
      return window.grid?.HEADER_SELECTION_END_ROW;
    });
    expect(startRow == startColHeader && endRow == endColHeader).toBeTruthy();
  }

  async testColResizing(col: number, sizeExpected: number) {
    const colWidth = await this.page.evaluate((colInBrowser) => {
      return window.grid.COL_WIDTHS.get(colInBrowser);
    }, col);
    expect(colWidth === sizeExpected).toBeTruthy();
  }

  async testRowResizing(row: number, sizeExpected: number) {
    const rowHeight = await this.page.evaluate((rowBrowser) => {
      return window.grid?.ROW_HEIGHTS.get(rowBrowser);
    }, row);
    expect(rowHeight == sizeExpected).toBeTruthy();
  }
}
