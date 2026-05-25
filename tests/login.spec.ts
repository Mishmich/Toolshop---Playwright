import { test } from "@playwright/test";
import * as login from "./pages/Login";
import { slowTest } from "./fixtures/slowTest";

slowTest.describe("Slow login tests", () => {
  slowTest.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/auth/login`);
  });
  slowTest(
    "Sign in with valid credentials",
    { tag: ["@positive", "@smoke"] },
    async ({ page }) => {
      await login.fillOutSignInForm(page, login.user1);
      await login.submitSignInForm(page);
      await page.waitForLoadState("networkidle");
      await page.waitForLoadState("domcontentloaded");
      await login.checkSignInProfileName(page, login.user1);
    },
  );

  slowTest(
    "Sign out after signing in",
    { tag: "@positive" },
    async ({ page, baseURL }) => {
      await login.loginUser(page, baseURL!);
      await login.logOutUser(page);
      await login.checkUrlAfterLogOut(page, baseURL!);
    },
  );
});

test.describe("Negative login tests", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/auth/login`);
  });

  test(
    "Sign in with invalid credentials",
    { tag: "@negative" },
    async ({ page }) => {
      await login.fillOutSignInForm(page, login.user2);
      await login.submitSignInForm(page);
      await login.checkInvalidSignInError(page);
    },
  );

  test(
    "Sign in with empty credentials",
    { tag: "@negative" },
    async ({ page }) => {
      await login.submitSignInForm(page);
      await login.checkValidationErrors(page, ["email", "password"]);
    },
  );
});
