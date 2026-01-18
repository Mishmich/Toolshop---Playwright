import { expect, test } from "@playwright/test";
import * as checkout from "./pages/Checkout.ts";
import { loginUser, user1 } from "./pages/Login.ts";

test.describe("Unauthorized user tests", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await checkout.addProductToCart(page, baseURL!, 0, 2);
    await checkout.clickOnCartIcon(page);
  });

  test('Click on "Continue Shopping"', async ({ page, baseURL }) => {
    await page.getByRole("button", { name: "Continue Shopping" }).click();
    await expect(page).toHaveURL(`${baseURL}/`);
  });

  test("Remove the last item from cart", async ({ page }) => {
    await page.locator(".btn.btn-danger").click();
    await expect(page.locator("app-cart")).toContainText(
      "The cart is empty. Nothing to display.",
    );
  });

  test("Increase item quantity", async ({ page }) => {
    const quantity = 5;
    const itemId = 0;
    await checkout.setItemQuantity(page, quantity, itemId);
    await checkout.checkTotalPrice(page);
  });

  test("Decrease item quantity", async ({ page }) => {
    const quantity = 1;
    const itemId = 0;
    await checkout.setItemQuantity(page, quantity, itemId);
    await checkout.checkTotalPrice(page);
  });

  test("Proceed to checkout - unauthenticated", {tag: "@smoke"}, async ({ page }) => {
    await page.getByRole("button", { name: "Proceed to checkout" }).click();
    expect(page.locator("#signin-tab")).toBeVisible();
    expect(page.getByRole("tab", { name: "Continue as Guest" })).toBeVisible();
  });
});

test.describe("Authorized user tests", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginUser(page, baseURL!);
    await checkout.addProductToCart(page, baseURL!, 0, 2);
    await checkout.clickOnCartIcon(page);
  });

  test("Proceed to checkout - authenticated", {tag: "@smoke"}, async ({ page }) => {
    await page.getByRole("button", { name: "Proceed to checkout" }).click();
    await expect(page.locator("p.ng-star-inserted")).toContainText(`Hello ${user1.firstName} ${user1.lastName}, you are already logged in. You can proceed to checkout.`);
  });
});
