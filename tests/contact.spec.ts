import {test, expect} from '@playwright/test';
import * as contact from './pages/Contact.ts';

test('Submit fully filled out contact form', async ({page}) => {
    await page.goto('/contact');
    await contact.fillOutContactForm(page);
    await contact.checkSubmissionText(page);
});

test('Submit empty contact form', async ({page}) => {
    await page.goto('/contact');
    await page.locator('[data-test="contact-submit"]').click();
});

test('Submit contact form with invalid email', async ({page}) => {
    
});

test('Submit contact form with valid attachment', async ({page}) => {
    
});

test('Submit contact form with invalid attachment', async ({page}) => {
    
});