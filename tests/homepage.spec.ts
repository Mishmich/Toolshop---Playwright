import { test, expect } from "@playwright/test";
import { describe } from "node:test";
import * as home from "./pages/Home.ts";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

describe("Navbar Tests", () => {
  test("Click on the logo", async ({ page, baseURL }) => {
    await page.getByTitle("Practice Software Testing - Toolshop").click();
    await expect(page).toHaveURL(`${baseURL}/`);
  });

  test("Click on Home", async ({ page, baseURL }) => {
    await page.locator('[data-test="nav-home"]').click();
    await expect(page).toHaveURL(`${baseURL}/`);
  });

  test("Click on Categories - Hand Tools", async ({ page, baseURL }) => {
    await page.locator('[data-test="nav-categories"]').click();
    await page.locator('[data-test="nav-hand-tools"]').click();
    await expect(page).toHaveURL(`${baseURL}/category/hand-tools`);
  });

  test("Click on Contact", async ({ page, baseURL }) => {
    await page.locator('[data-test="nav-contact"]').click();
    await expect(page).toHaveURL(`${baseURL}/contact`);
  });

  test("Click on Sign in", async ({ page, baseURL }) => {
    await page.locator('[data-test="nav-sign-in"]').click();
    await expect(page).toHaveURL(`${baseURL}/auth/login`);
  });

  test("Click on Language - DE", async ({ page }) => {
    await page.locator('[data-test="language-select"]').click();
    await page.locator('[data-test="lang-de"]').click();
    await home.checkLanguageChange(page);
  });
});

describe("Sorting Tests", () => {
  test("Sort by name A-Z", async ({ page }) => {
    await home.sortByOption(page, "name,asc");
    const products = await home.getProductDetails(page);
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => (a.name! > b.name! ? 1 : -1));
    await expect(sortedProducts).toEqual(products);
  });

  test("Sort by name Z-A", async ({ page }) => {
    await home.sortByOption(page, "name,desc");
    const products = await home.getProductDetails(page);
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => (a.name! < b.name! ? 1 : -1));
    await expect(sortedProducts).toEqual(products);
  });

  test("Sort by price low to high", async ({ page }) => {
    await home.sortByOption(page, "price,asc");
    const products = await home.getProductDetails(page);
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => (a.price! > b.price! ? 1 : -1));
    await expect(sortedProducts).toEqual(products);
  });

  test("Sort by price high to low", async ({ page }) => {
    await home.sortByOption(page, "price,desc");
    const products = await home.getProductDetails(page);
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => (a.price! < b.price! ? 1 : -1));
    expect(sortedProducts).toEqual(products);
  });
});

describe("Filtering Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Filter by price range 0-50", async ({ page }) => {
    await home.moveSliderTo(page, "right", 50);
    await home.sortByOption(page, "price,desc");
    const products = await home.getProductDetails(page);
    console.log(products[0].price!.slice(1));
    expect(products[0].price!.slice(1) <= "50").toBeTruthy();
  });

  test("Filter by price range 100-200", async ({ page }) => {
    await home.moveSliderTo(page, "left", 100);
    await home.moveSliderTo(page, "right", 200);
    await home.sortByOption(page, "price,asc");
    const products = await home.getProductDetails(page);
    expect(products[0].price!.slice(1) >= "100" && products[products.length - 1].price!.slice(1) <= "200").toBeTruthy();
  });

  test("Search by text - 'saw'", async ({ page }) => {
    await page.locator('[data-test="search-query"]').fill("saw");
    await page.locator('[data-test="search-submit"]').click();
    const products = await home.getProductDetails(page);
    for (const product of products) {
      expect(product.name!.toLowerCase().includes("saw")).toBeTruthy();
    }
  });

  test("Combination of filtering - Hammer, range 0-30, 'our'", async ({page}) => {
    await page.getByRole('checkbox', { name: 'Hammer' }).check();
    await home.moveSliderTo(page, "right", 30);
    await page.locator('[data-test="search-query"]').fill("our");
    await home.submitSearch(page);
    const products = await home.getProductDetails(page);
    for (const product of products) {
      expect(product.name!.toLowerCase().includes("our")).toBeTruthy();
      expect(product.price!.slice(1) <= "30").toBeTruthy();
    }
  });
});

describe("Paging Tests", () => {
  test("Page 2 shows different products than page 1", async ({ page }) => {
    // Get products on page 1
    const page1Products = await home.getProductDetails(page);
    const page1Ids = page1Products.map((p) => p.id);

    await expect(page1Ids.length).toBeGreaterThan(0);

    // Navigate to page 2
    await home.clickOnNthPageNumber(page, 2);

    // Get products on page 2
    const page2Products = await home.getProductDetails(page);
    const page2Ids = page2Products.map((p) => p.id);

    await expect(page2Ids.length).toBeGreaterThan(0);

    // Products should be completely different
    await expect(page1Ids).not.toEqual(page2Ids);

    // No overlap between pages
    const overlap = page1Ids.filter((id) => page2Ids.includes(id));
    await expect(overlap.length).toBe(0);
  });
});


