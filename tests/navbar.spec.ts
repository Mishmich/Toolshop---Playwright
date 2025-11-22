import {test, expect} from '@playwright/test';

test('Click on the logo', async ({page}) => {
    await page.goto('/');
    await page.getByTitle('Practice Software Testing - Toolshop').click();
    await expect(page).toHaveURL('https://practicesoftwaretesting.com/');
});

test('Click on Home', async ({page}) => {
    await page.goto('/');
    await page.locator('[data-test="nav-home"]').click();
    await expect(page).toHaveURL('https://practicesoftwaretesting.com/');
});

test('Click on Categories - Hand Tools', async ({page}) => {
    await page.goto('/');
    await page.locator('[data-test="nav-categories"]').click();
    await page.locator('[data-test="nav-hand-tools"]').click();
    await expect(page).toHaveURL('https://practicesoftwaretesting.com/category/hand-tools');
});

test('Click on Contact', async ({page}) => {
    await page.goto('/');
    await page.locator('[data-test="nav-contact"]').click();
    await expect(page).toHaveURL('https://practicesoftwaretesting.com/contact');

});

test('Click on Sign in', async ({page}) => {
    await page.goto('/');
    await page.locator('[data-test="nav-sign-in"]').click();
    await expect(page).toHaveURL('https://practicesoftwaretesting.com/auth/login');
});

test.skip('Click on Language - DE', async ({page}) => {
    await page.goto('/');
    await page.locator('[data-test="language-select"]').click();
    await page.locator('[data-test="lang-de"]').click();
});