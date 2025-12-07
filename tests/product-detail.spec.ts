import { test, expect } from '@playwright/test';

test('Add item to cart', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="product-01K8VB9PKMARMVTFH8EXQRPNR9"]').click();
  await page.locator('[data-test="add-to-cart"]').click();
  let alertText = await page.getByRole('alert', { name: 'Product added to shopping' }).getAttribute('aria-label');
  await expect(alertText).toContain('Product added to shopping cart.');
});