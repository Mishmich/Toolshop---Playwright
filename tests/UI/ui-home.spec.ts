import { test, expect } from '@playwright/test';

test('home — visual regression', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}`);
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveScreenshot({ fullPage: true, animations: 'disabled', maxDiffPixels: 100 });
});
