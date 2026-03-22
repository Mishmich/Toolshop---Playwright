import { test as base, type Page } from '@playwright/test';

export const slowTest = base.extend<{ slowPage: Page }>({
  slowPage: async ({ playwright, browserName }, use) => {
    // get the BrowserType from playwright using the current project browserName
    const browserType = playwright[browserName];
    const browser = await browserType.launch({ slowMo: 1500 });
    const page = await browser.newPage();
    await use(page);
    await browser.close();
  },
});

// add slowPage fixture