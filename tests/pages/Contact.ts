import { Page, expect } from "@playwright/test";
import { selectors } from '../selectors';

export const testValues = {
  first_name: process.env.TEST_CONTACT_FIRST_NAME!,
  last_name: process.env.TEST_CONTACT_LAST_NAME!,
  email: process.env.TEST_CONTACT_EMAIL!,
  subject: process.env.TEST_CONTACT_SUBJECT!,
  message: process.env.TEST_CONTACT_MESSAGE!,
};

export async function fillOutContactForm(page: Page) {
  await page.locator(selectors.contact.firstName).click();
  await page.locator(selectors.contact.firstName).fill(testValues.first_name);
  await page.locator(selectors.contact.lastName).click();
  await page.locator(selectors.contact.lastName).fill(testValues.last_name);
  await page.locator(selectors.contact.email).click();
  await page.locator(selectors.contact.email).fill(testValues.email);

  await page.locator(selectors.contact.subject).selectOption(testValues.subject);

  await page.locator(selectors.contact.message).click();
  await page.locator(selectors.contact.message).fill(testValues.message);
}

export async function submitContactForm(page: Page) {
  await page.locator(selectors.contact.submit).click();
}

export async function checkSubmissionText(page: Page) {
  await expect(page.getByRole("heading")).toContainText("Contact");
  await expect(page.getByRole("alert")).toContainText(
    "Thanks for your message! We will contact you shortly."
  );
}

export async function checkValidationErrors(page: Page, arg1: string[]) {
    for (const field of arg1) {
        const errorLocator = page.locator(selectors.dynamic.fieldError(field));
        await expect(errorLocator).toBeVisible();
    }
}

export async function addAttachment(page: Page, attachmentPath: string) {
  await page.locator(selectors.contact.attachment).click();
  await page.locator(selectors.contact.attachment).setInputFiles(attachmentPath);
}

export async function checkUrl(page: Page, baseURL: string) {
  await expect(page).toHaveURL(`${baseURL}/contact`);
}