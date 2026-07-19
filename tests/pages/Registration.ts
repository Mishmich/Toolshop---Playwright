import { Page } from "@playwright/test";
import { saveRegistration } from "../utils/CSV_append";
import * as faker from "../utils/RandomDataGen"
import { selectors } from '../selectors';

/**
 * Fills the registration form with valid data.
 * email is randomly generated and we have no access to it's inbox,
 * so we cannot verify email confirmation.
 */

export async function fillRegistrationForm(page: Page, baseURL: string) {
  const testValues = await faker.getTestValues();
  await page.goto(`${baseURL}/auth/register`);
  await page.locator(selectors.registration.firstName).click();
  await page.locator(selectors.registration.firstName).fill(testValues.first_name);
  await page.locator(selectors.registration.lastName).click();
  await page.locator(selectors.registration.lastName).fill(testValues.last_name);
  await page.locator(selectors.registration.dob).click();
  await page.locator(selectors.registration.dob).fill(testValues.dob);
  await page.locator(selectors.registration.street).click();
  await page.locator(selectors.registration.street).fill(testValues.street);
  await page.locator(selectors.registration.postalCode).click();
  await page.locator(selectors.registration.postalCode).fill(testValues.postal_code);
  await page.locator(selectors.registration.city).click();
  await page.locator(selectors.registration.city).fill(testValues.city);
  await page.locator(selectors.registration.state).click();
  await page.locator(selectors.registration.state).fill(testValues.state);
  await page.locator(selectors.registration.country).selectOption(testValues.country);
  await page.locator(selectors.registration.phone).click();
  await page.locator(selectors.registration.phone).fill(testValues.phone);
  await page.locator(selectors.registration.email).click();
  await page.locator(selectors.registration.email).fill(testValues.emailAddress);
  await page.locator(selectors.registration.password).click();
  await page.locator(selectors.registration.password).fill("YOGAmatt555!");
}


export async function clickOnSubmitButton(page: Page) {
  saveRegistration({
    first_name: await page.locator(selectors.registration.firstName).inputValue(),
    last_name: await page.locator(selectors.registration.lastName).inputValue(),
    email: await page.locator(selectors.registration.email).inputValue(),
    createdAt: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
  });
    await page.locator(selectors.registration.submit).click();
    await page.waitForLoadState('networkidle');

}

export async function registerUserwithTestmail(page: Page, email: string, baseURL: string) {
    await fillRegistrationForm(page, baseURL);
    await page.locator(selectors.registration.email).click();
    await page.locator(selectors.registration.email).fill(email);
    await clickOnSubmitButton(page);
}
