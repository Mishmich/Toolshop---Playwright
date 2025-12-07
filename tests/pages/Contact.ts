import { Page, expect } from "@playwright/test";

export const testValues = {
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@gmail.com",
  subject: "Inquiry about products",
  message: "I would like to know more about your product range.",
};

export async function fillOutContactForm(page: Page)
{
  page.locator('[data-test="first-name"]').fill(testValues.first_name);
  page.locator('[data-test="last-name"]').fill(testValues.last_name);
  page.locator('[data-test="email"]').fill(testValues.email);
  page.locator('[data-test="subject"]').fill(testValues.message);
  page.locator('[data-test="message"]').fill(testValues.message);
  page.locator('[data-test="contact-submit"]').click();
}
