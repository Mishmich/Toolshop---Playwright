import { test, expect } from "@playwright/test";
import * as productDetail from "./pages/ProductDetail.ts";
import { loginUser, removeAllFaves } from "./pages/Login.ts";

test.describe("Unauthorized user tests", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/`);
    await productDetail.goToProductDetail(page, baseURL!, 0); // Navigate to the first product detail page
  });
  test("Add item to cart", async ({ page }) => {
    await productDetail.addItemsToCart(page);
    await productDetail.checkProductAddedAlert(page);
  });

  test("Decrease item quantity", async ({ page }) => {
    await productDetail.increaseItemQuantity(page);
    await productDetail.decreaseItemQuantity(page);
    const quantity = await page.locator('[data-test="quantity"]').inputValue();
    expect(quantity).toBe("1");
    await productDetail.addItemsToCart(page);
    await productDetail.checkProductAddedAlert(page);
  });

  test("Add item to favorites - unauthorized", async ({ page }) => {
    await productDetail.addItemToFavorites(page);
    const alertText = await page
      .getByRole("alert", {
        name: "Unauthorized, can not add product to your favorite list.",
      })
      .innerText();
    expect(alertText).toContain(
      "Unauthorized, can not add product to your favorite list."
    );
  });

  test("Click on related product", async ({ page }) => {
    const { name, href } = await productDetail.getRelatedProductName(page, 0);
    await productDetail.clickOnRelatedProduct(page, 0);
    await productDetail.checkRelatedProductNavigation(page, name!, href!);
  });
});

test.describe("Authorized user tests", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginUser(page, baseURL!);
    await removeAllFaves(page);
    await productDetail.goToProductDetail(page, baseURL!, 0);
  });

  test("Add item to favorites - authorized", async ({ page }) => {
    // User is already logged in from beforeEach
    await productDetail.addItemToFavorites(page);
    await productDetail.checkProductAddedToFavAlert(page);
  });
});
