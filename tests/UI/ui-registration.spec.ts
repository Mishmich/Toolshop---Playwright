import { test, expect } from '@playwright/test';

test('registration — visual regression', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/auth/register`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot({ fullPage: true, animations: 'disabled', maxDiffPixels: 100 });
});