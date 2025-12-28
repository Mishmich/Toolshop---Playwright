import { Page, expect } from "@playwright/test";
import path from 'path';

export const testValues = {
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@gmail.com",
  subject: "status-of-order",
  message: "I would like to know more about your product range.",
};

export async function fillOutContactForm(page: Page) {
  await page.locator('[data-test="first-name"]').click();
  await page.locator('[data-test="first-name"]').fill(testValues.first_name);
  await page.locator('[data-test="last-name"]').click();
  await page.locator('[data-test="last-name"]').fill(testValues.last_name);
  await page.locator('[data-test="email"]').click();
  await page.locator('[data-test="email"]').fill(testValues.email);

  await page.locator('[data-test="subject"]').selectOption(testValues.subject);

  await page.locator('[data-test="message"]').click();
  await page.locator('[data-test="message"]').fill(testValues.message);
}

export async function submitContactForm(page: Page) {
  await page.locator('[data-test="contact-submit"]').click();
}

export async function checkSubmissionText(page: Page) {
  await expect(page.getByRole("heading")).toContainText("Contact");
  await expect(page.getByRole("alert")).toContainText(
    "Thanks for your message! We will contact you shortly."
  );
}

export async function checkValidationErrors(page: Page, arg1: string[]) {
    for (const field of arg1) {
        const errorLocator = page.locator(`[data-test="${field}-error"]`);
        await expect(errorLocator).toBeVisible();
    }
}

export async function addAttachment(page: Page, attachmentPath: string) {
  // Resolve relative path from project root
  const resolvedPath = path.resolve(__dirname, '../../', attachmentPath);
  await page.locator('[data-test="attachment"]').click();
  await page.locator('[data-test="attachment"]').setInputFiles(resolvedPath);
}

export async function checkUrl(page: Page, baseURL: string) {
  await expect(page).toHaveURL(`${baseURL}/contact`);
}