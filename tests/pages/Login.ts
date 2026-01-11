import { Page } from "@playwright/test";

export const user1 = {
    email: 'customer3@practicesoftwaretesting.com',
    password: 'pass123'
};

export async function fillOutSignInForm(page: Page) {
    await page.locator('[data-test="email"]').fill(user1.email);
    await page.locator('[data-test="password"]').fill(user1.password);
}

export async function submitSignInForm(page: Page) {
    await page.locator('[data-test="login-submit"]').click();
}

export async function loginUser(page: Page, baseURL: string) {
    await page.goto(`${baseURL}/auth/login`);
    await fillOutSignInForm(page);
    await submitSignInForm(page);
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("domcontentloaded");
}

export async function removeAllFaves(page: Page) {
    await page.goto('/account/favorites');

    while (await page.locator('[data-test="delete"]').count() > 0) {
        await page.locator('[data-test="delete"]').first().click();
        await page.waitForLoadState("networkidle");
    }
}