import { Page } from "@playwright/test";
import * as EmailUtils from "../utils/EmailUtils";

let faker: any;

async function initializeFaker() {
  const fakerModule = await import("@faker-js/faker");
  faker = fakerModule.faker;
}

export async function getTestValues() {
  if (!faker) {
    await initializeFaker();
  }
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    dob: "2001-06-15",
    street: faker.location.streetAddress(),
    postal_code: faker.location.zipCode(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: "US",
    phone: '111333222',
    password: "Password123!"
  };
}

export async function registerUser(page: Page) {
  const testValues = await getTestValues();
  const inbox = await EmailUtils.createInbox();
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
  await page.locator('[data-test="email"]').fill(inbox.emailAddress);
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill(testValues.password);
  await page.locator('[data-test="register-submit"]').click();
}
