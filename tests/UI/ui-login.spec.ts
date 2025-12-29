import { test, expect } from '@playwright/test';

test('login — visual regression', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/auth/login`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot({ fullPage: true, animations: 'disabled', maxDiffPixels: 100 });
});

