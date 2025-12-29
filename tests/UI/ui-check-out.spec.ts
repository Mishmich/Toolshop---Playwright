import { test, expect } from '@playwright/test';
import { addItemToCart, getProductId } from '../pages/Home';

test('check-out — visual regression', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`);
  const productId = await getProductId(page, baseURL!, 0);
  await addItemToCart(page, baseURL!, productId!);
  await page.locator('[data-test="nav-cart"]').click();
  await page.waitForSelector('text=Item'); //waiting for the page to load itmes section
  await expect(page.locator("id=toast-container")).not.toBeVisible(); //ensuring no toast messages are visible
  await expect(page).toHaveScreenshot({ fullPage: true, animations: 'disabled', maxDiffPixels: 100 });
});