import { Page } from "@playwright/test";
import { saveRegistration } from "../utils/CSV_append.ts";
import * as faker from "../utils/RandomDataGen.ts"

/**
 * Registers a user on the registration page using test data.
 * email is randomly generated and we have no access to it's inbox,
 * so we cannot verify email confirmation.
 */

export async function registerUser(page: Page) {
  const testValues = await faker.getTestValues();
  await page.goto("https://practicesoftwaretesting.com/auth/register");
  await page.locator('[data-test="first-name"]').click();
  await page.locator('[data-test="first-name"]').fill(testValues.first_name);
  await page.locator('[data-test="last-name"]').click();
  await page.locator('[data-test="last-name"]').fill(testValues.last_name);
  await page.locator('[data-test="dob"]').click();
  await page.locator('[data-test="dob"]').fill(testValues.dob);
  await page.locator('[data-test="street"]').click();
  await page.locator('[data-test="street"]').fill(testValues.street);
  await page.locator('[data-test="postal_code"]').click();
  await page.locator('[data-test="postal_code"]').fill(testValues.postal_code);
  await page.locator('[data-test="city"]').click();
  await page.locator('[data-test="city"]').fill(testValues.city);
  await page.locator('[data-test="state"]').click();
  await page.locator('[data-test="state"]').fill(testValues.state);
  await page.locator('[data-test="country"]').selectOption(testValues.country);
  await page.locator('[data-test="phone"]').click();
  await page.locator('[data-test="phone"]').fill(testValues.phone);
  await page.locator('[data-test="email"]').click();
  await page.locator('[data-test="email"]').fill(testValues.emailAddress);
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill(testValues.password);
  await page.locator('[data-test="register-submit"]').click();
  await page.waitForURL("https://practicesoftwaretesting.com/auth/login");

  saveRegistration({
    first_name: testValues.first_name,
    last_name: testValues.last_name,
    email: testValues.emailAddress,
    createdAt: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
  });
}

export async function registerUserWithInvalidData(page: Page) {

}
