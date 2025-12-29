import { test, expect } from '@playwright/test';

test('contact — visual regression', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/contact`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot({ fullPage: true, animations: 'disabled', maxDiffPixels: 100 });
});