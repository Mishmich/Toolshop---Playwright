import { Page, expect } from "@playwright/test";

export const user1 = {
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'customer3@practicesoftwaretesting.com',
    password: 'pass123'
};

export const user2 = {
    email: 'customer@practicesoftwaretesting.com',
    password: 'welcome00'
};

export async function fillOutSignInForm(page: Page, user: {email: string, password: string}) {
    await page.locator('[data-test="email"]').fill(user.email);
    await page.locator('[data-test="password"]').fill(user.password);
}

export async function submitSignInForm(page: Page) {
    await page.locator('[data-test="login-submit"]').click();
}

export async function loginUser(page: Page, baseURL: string) {
    await page.goto(`${baseURL}/auth/login`);
    await fillOutSignInForm(page, user1);
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

export async function checkValidationErrors(page: Page, arg1: string[]) {
    for (const field of arg1) {
        const errorLocator = page.locator(`[data-test="${field}-error"]`);
        await expect(errorLocator).toBeVisible();
        await expect(errorLocator).toHaveText(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
    }
}

export async function checkSignInProfileName(page: Page, user: {firstName: string, lastName: string})
{
    const userProfile = await page.locator('[data-test="nav-menu"]').textContent();
    await expect(userProfile).toContain(` ${user.firstName} ${user.lastName} `);
}

export async function checkInvalidSignInError(page: Page) {
    const errorMessage = page.locator('[data-test="login-error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid email or password');
}

export async function logOutUser(page: Page) {
    await page.locator('[data-test="nav-menu"]').click();
    await page.locator('[data-test="nav-sign-out"]').click();
}

export async function checkUrlAfterLogOut(page: Page, baseURL: string) {
    await page.goto(`${baseURL}/auth/login`);
}