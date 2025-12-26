import {test, expect} from '@playwright/test';
import * as contact from './pages/Contact.ts';
require('dotenv').config();

test.beforeEach(async ({page}) => {
    await page.goto('/contact');
});

test('Submit fully filled out contact form', async ({page}) => {
    await contact.fillOutContactForm(page);
    await contact.submitContactForm(page);
    await contact.checkSubmissionText(page);
});

test('Submit empty contact form', async ({page, baseURL}) => {
    await contact.submitContactForm(page);
    await contact.checkValidationErrors(page, ['first-name', 'last-name', 'email', 'subject', 'message']);
    await expect(page).toHaveURL(`${baseURL}/contact`);
});

test('Submit contact form with invalid email', async ({page}) => {
    await page.locator('[data-test="first-name"]').fill('John');
    await page.locator('[data-test="last-name"]').fill('Doe');
    await page.locator('[data-test="email"]').fill('invalid-email');
    await page.locator('[data-test="subject"]').selectOption('status-of-order');
    await page.locator('[data-test="message"]').fill('I would like to know more about your product range.');
    await page.locator('[data-test="contact-submit"]').click();
    await contact.checkValidationErrors(page, ['email']);
});

test('Submit contact form with valid attachment', async ({page}) => {
    await contact.fillOutContactForm(page);
    await contact.addAttachment(page, process.env.GOOD_FILE_PATH!);
    await contact.submitContactForm(page);
    await contact.checkSubmissionText(page);
});

test('Submit contact form with invalid attachment', async ({page}) => {
    await contact.fillOutContactForm(page);
    await contact.addAttachment(page, process.env.BAD_FILE_PATH!);
    await contact.submitContactForm(page);
    await contact.checkValidationErrors(page, ['attachment']);
});