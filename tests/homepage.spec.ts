import { test, expect } from "@playwright/test";
import { describe } from "node:test";
import { checkLanguageChange } from "./pages/Home.ts";

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
    await checkLanguageChange(page);
  });
});

describe.skip("Sorting Tests", () => {
    test("Sort by name A-Z", async ({ page }) => {});
    test("Sort by name Z-A", async ({ page }) => {});
    test("Sort by price low to high", async ({ page }) => {});
    test("Sort by price high to low", async ({ page }) => {});
});

describe.skip("Filtering Tests", () => {
    test("Filter by price range 0-50", async ({ page }) => {});
    test("Filter by price range 100-200", async ({ page }) => {});
    test("Search by text - 'saw'", async ({ page }) => {});
    test("Filter by category - check Hand Tools", async ({ page }) => {});
    test("Filter by category - check Dril", async ({ page }) => {});
    test("Combination of filtering - Safety Gear, A-Z, range 0-30, 'ggl'", async ({ page }) => {});
});

describe.skip("Paging Tests", () => {
    
    test("Navigate to page 2", async ({ page, request }) => {
        //get all ids of products on page 1
        const productIdsPage1 = await page.locator('[data-test^="product-"]').all;
        //click on page 2
        await page.getByRole("button", {name: "2"}).click();
        //get all ids of products on page 2
        const productIdsPage2 = await page.locator('[data-test^="product-"]').all;
        //compare that the two pages have different products
        expect(productIdsPage1).not.toEqual(productIdsPage2);
    });
});