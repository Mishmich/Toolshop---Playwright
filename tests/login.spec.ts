import { test } from "@playwright/test";
import * as login from "./pages/Login.ts";
import { slowTest } from "./fixtures/slowTest.ts";

slowTest.describe("Slow login tests", () => {
  slowTest.beforeEach(async ({ slowPage, baseURL }) => {
    await slowPage.goto(`${baseURL}/auth/login`);
  });
  slowTest(
    "Sign in with valid credentials",
    { tag: ["@positive", "@smoke"] },
    async ({ slowPage }) => {
      await login.fillOutSignInForm(slowPage, login.user1);
      await login.submitSignInForm(slowPage);
      await slowPage.waitForLoadState("networkidle");
      await slowPage.waitForLoadState("domcontentloaded");
      await login.checkSignInProfileName(slowPage, login.user1);
    },
  );

  slowTest(
    "Sign out after signing in",
    { tag: "@positive" },
    async ({ slowPage, baseURL }) => {
      await login.loginUser(slowPage, baseURL!);
      await login.logOutUser(slowPage);
      await login.checkUrlAfterLogOut(slowPage, baseURL!);
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
