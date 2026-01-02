import { test } from '@playwright/test';

test.beforeEach(async ({page, baseURL}) => {
    await page.goto(`${baseURL}/checkout`);
});

test('Click on "Continue Shopping"', async ({page, baseURL}) => {
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await page.waitForURL(`${baseURL}/`);
});

test('Remove item from cart', async ({page, baseURL}) => {});

test('Remove the last item from cart', async ({page, baseURL}) => {});

test('Increase item quantity', async ({page, baseURL}) => {});

test('Decrease item quantity', async ({page, baseURL}) => {});

test('Proceed to checkout', async ({page, baseURL}) => {});