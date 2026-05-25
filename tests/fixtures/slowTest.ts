import { test as base } from '@playwright/test';

export const slowTest = base.extend({
  page: async ({ browser }, use) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    page.setDefaultTimeout(30000);
    await use(page);
    await ctx.close();
  },
});