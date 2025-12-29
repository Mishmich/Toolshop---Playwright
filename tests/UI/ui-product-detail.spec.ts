import { test, expect } from '@playwright/test';
import { getProductId } from '../pages/Home';

test('product-detail — visual regression', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`);
  const productId = await getProductId(page, baseURL!, 0);
  await page.goto(`${baseURL}/product/${productId}`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot({ fullPage: true, animations: 'disabled', maxDiffPixels: 100 });
});