import { test, expect } from "@playwright/test";
import { selectors } from './selectors';
import * as registration from "./pages/Registration";
import { user1 } from "./pages/Login";

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/auth/register`);
});

test(
  "Register a client with valid data",
  { tag: ["@positive", "@smoke"] },
  async ({ page, baseURL }) => {
    await registration.fillRegistrationForm(page, baseURL!);
    await registration.clickOnSubmitButton(page);
    await page.waitForURL(`${baseURL}/auth/login`);
  },
);

test(
  "Submit empty registration form",
  { tag: "@negative" },
  async ({ page }) => {
    await registration.clickOnSubmitButton(page);
    await expect(page.locator(selectors.common.alert)).toHaveCount(11);
  },
);

test(
  "Register with already used email",
  { tag: "@negative" },
  async ({ page, baseURL }) => {
    await registration.fillRegistrationForm(page, baseURL!);
    await page.locator(selectors.registration.email).click();
    await page.locator(selectors.registration.email).fill(user1.email);
    await registration.clickOnSubmitButton(page);
    await expect(page.locator(selectors.common.alert)).toHaveText("Email already exists");
  },
);
test(
  "Register with invalid password",
  { tag: "@negative" },
  async ({ page, baseURL }) => {
    await registration.fillRegistrationForm(page, baseURL!);
    await page.locator(selectors.registration.password).click();
    await page.locator(selectors.registration.password).fill("pass123");
    await registration.clickOnSubmitButton(page);
    await expect(page.locator(selectors.common.alert)).toHaveText("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
  },
);
test("Make password visible", { tag: "@positive" }, async ({ page, baseURL }) => {
  await registration.fillRegistrationForm(page, baseURL!);
  await page.locator(selectors.registration.password).fill("ValidPass123");
  await page.locator(selectors.registration.passwordRevealButton).click();
  const passwordField = page.locator(selectors.registration.password);
  await expect(passwordField).toHaveAttribute("type", "text");
});
