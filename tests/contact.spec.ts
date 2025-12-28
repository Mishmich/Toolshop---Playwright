import {test, expect} from '@playwright/test';
import * as contact from './pages/Contact.ts';
import path from 'path';


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
    await contact.fillOutContactForm(page);
    await page.locator('[data-test="email"]').fill('invalid-email');
    await contact.submitContactForm(page);
    await contact.checkValidationErrors(page, ['email']);
});

test('Submit contact form with valid attachment', async ({page}) => {
    await contact.fillOutContactForm(page);
    await contact.addAttachment(page, path.join(__dirname, '/data/attachments/validAttachmentFile.txt'));
    await contact.submitContactForm(page);
    await contact.checkSubmissionText(page);
});

test('Submit contact form with invalid attachment', async ({page}) => {
    await contact.fillOutContactForm(page);
    await contact.addAttachment(page, path.join(__dirname, '/data/attachments/invalidAttachmentFile.txt'));
    await contact.submitContactForm(page);
    await contact.checkValidationErrors(page, ['attachment']);
});