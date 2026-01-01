import { test, expect } from "@playwright/test";
import { describe } from "node:test";
import * as home from "./pages/Home.ts";

test.beforeEach(async ({page}) => {
    await page.goto('/');
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
      await home.sortByOption(page, 'name,asc');
      const products = await home.getProductDetails(page);
      const sortedProducts = [...products];
      sortedProducts.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
      await expect(sortedProducts).toEqual(products);
    });

    test("Sort by name Z-A", async ({ page }) => {
      await home.sortByOption(page, 'name,desc');
      const products = await home.getProductDetails(page);
      const sortedProducts = [...products];
      sortedProducts.sort((a, b) => (a.name! < b.name!) ? 1 : -1);
      await expect(sortedProducts).toEqual(products);
    });

    test("Sort by price low to high", async ({ page }) => {
      await home.sortByOption(page, 'price,asc');
      const products = await home.getProductDetails(page);
      const sortedProducts = [...products];
      sortedProducts.sort((a, b) => (a.price! > b.price!) ? 1 : -1);
      await expect(sortedProducts).toEqual(products);
    });

    test("Sort by price high to low", async ({ page }) => {
      await home.sortByOption(page, 'price,desc');
       const products = await home.getProductDetails(page);
      const sortedProducts = [...products];
      sortedProducts.sort((a, b) => (a.price! < b.price!) ? 1 : -1);
      expect(sortedProducts).toEqual(products);
    });
});

describe.skip("Filtering Tests", () => {
    test("Filter by price range 0-50", async ({ page }) => {});
    test("Filter by price range 100-200", async ({ page }) => {});
    test("Search by text - 'saw'", async ({ page }) => {});
    test("Filter by category - check Hand Tools", async ({ page }) => {});
    test("Filter by category - check Dril", async ({ page }) => {});
    test("Combination of filtering - Safety Gear, A-Z, range 0-30, 'ggl'", async ({ page }) => {});
});

describe("Paging Tests", () => {
    
    test("Page 2 shows different products than page 1", async ({ page }) => {
        // Get products on page 1
        const page1Products = await home.getProductDetails(page);
        const page1Ids = page1Products.map(p => p.id);
        
        await expect(page1Ids.length).toBeGreaterThan(0);
        
        // Navigate to page 2
        await home.clickOnNthPageNumber(page, 2);
        
        // Get products on page 2
        const page2Products = await home.getProductDetails(page);
        const page2Ids = page2Products.map(p => p.id);
        
        await expect(page2Ids.length).toBeGreaterThan(0);
        
        // Products should be completely different
        await expect(page1Ids).not.toEqual(page2Ids);
        
        // No overlap between pages
        const overlap = page1Ids.filter(id => page2Ids.includes(id));
        await expect(overlap.length).toBe(0);
    });
});