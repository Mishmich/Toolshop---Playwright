import {test, expect} from '@playwright/test';
import * as registration from './pages/Registration.ts';
import {user1} from './pages/Login.ts';

test.beforeEach(async ({page, baseURL}) => {
    await page.goto(`${baseURL}/auth/register`);
});

test('Register a client with valid data', { tag: '@positive'}, async ({page}) => {
    await registration.fillRegistrationForm(page);
    await registration.clickOnSubmitButton(page);
    await expect(page).toHaveURL('https://practicesoftwaretesting.com/auth/login');
});

test('Submit empty registration form', { tag: '@negative'}, async ({page}) => {
    await registration.clickOnSubmitButton(page);
    await expect(page.locator('.alert')).toHaveCount(11);
});

test('Register with already used email', { tag: '@negative'}, async ({page}) => {
    await registration.fillRegistrationForm(page);
    await page.locator('[data-test="email"]').click();
    await page.locator('[data-test="email"]').fill(user1.email);
    await registration.clickOnSubmitButton(page);
    await expect(page.locator('.alert')).toHaveText('A customer with this email address already exists.');
});

test('Register with invalid password', { tag: '@negative'}, async ({page}) => {
    await registration.fillRegistrationForm(page);
    await page.locator('[data-test="password"]').click();
    await page.locator('[data-test="password"]').fill('pass123');
    await registration.clickOnSubmitButton(page);
    await expect(page.locator('.alert')).toHaveText(' Password must be minimal 6 characters long.  Password must include invalid characters. ');
});

test('Make password visible', { tag: '@positive'}, async ({page}) => {
    await page.locator('[data-test="password"]').fill('ValidPass123');
    await page.locator('button.btn.btn-outline-secondary').click();
    const passwordField = page.locator('[data-test="password"]');
    await expect(passwordField).toHaveAttribute('type', 'text');
});
