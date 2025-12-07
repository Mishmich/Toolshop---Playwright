import {test, expect} from '@playwright/test';
import * as contact from './pages/Contact.ts';

test('Fill out the contact form', async ({page}) => {
    await page.goto('/contact');
    await contact.fillOutContactForm(page);
    await contact.checkSubmissionText(page);
});