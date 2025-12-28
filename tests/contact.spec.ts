import { test } from '@playwright/test';
import * as contact from './pages/Contact.ts';


test.beforeEach(async ({page, baseURL}) => {
    await page.goto(`${baseURL}/contact`);
});

test('Submit fully filled out contact form', { tag: '@positive'} , async ({page}) => {
    await contact.fillOutContactForm(page);
    await contact.submitContactForm(page);
    await contact.checkSubmissionText(page);
});

test('Submit empty contact form', { tag: '@negative'}, async ({page, baseURL}) => {
    await contact.submitContactForm(page);
    await contact.checkValidationErrors(page, ['first-name', 'last-name', 'email', 'subject', 'message']);
    await contact.checkUrl(page, baseURL!);
});

test('Submit contact form with invalid email', { tag: '@negative'}, async ({page}) => {
    await contact.fillOutContactForm(page);
    await page.locator('[data-test="email"]').fill('invalid-email');
    await contact.submitContactForm(page);
    await contact.checkValidationErrors(page, ['email']);
});

test('Submit contact form with valid attachment', { tag: '@positive'}, async ({page}) => {
    await contact.fillOutContactForm(page);
    await contact.addAttachment(page, 'tests/data/attachments/validAttachmentFile.txt');
    await contact.submitContactForm(page);
    await contact.checkSubmissionText(page);
});

test('Submit contact form with invalid attachment', { tag: '@negative'}, async ({page}) => {
    await contact.fillOutContactForm(page);
    await contact.addAttachment(page, 'tests/data/attachments/invalidAttachmentFile.txt');
    await contact.submitContactForm(page);
    await contact.checkValidationErrors(page, ['attachment']);
});