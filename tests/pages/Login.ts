import { Page, expect } from "@playwright/test";
import { selectors } from '../selectors';

export const user1 = {
    firstName: process.env.TEST_USER1_FIRST_NAME!,
    lastName: process.env.TEST_USER1_LAST_NAME!,
    email: process.env.TEST_USER1_EMAIL!,
    password: process.env.TEST_USER1_PASSWORD!,
};


export const user2 = {
    email: process.env.TEST_USER2_EMAIL!,
    password: process.env.TEST_USER2_PASSWORD!
};

export async function fillOutSignInForm(page: Page, user: {email: string, password: string}) {
    await page.locator(selectors.auth.emailInput).fill(user.email);
    await page.locator(selectors.auth.passwordInput).fill(user.password);
}

export async function submitSignInForm(page: Page) {
    await page.locator(selectors.auth.loginSubmit).click();
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

    while (await page.locator(selectors.auth.deleteButton).count() > 0) {
        await page.locator(selectors.auth.deleteButton).first().click();
        await page.waitForLoadState("networkidle");
    }
}

export async function checkValidationErrors(page: Page, arg1: string[]) {
    for (const field of arg1) {
        const errorLocator = page.locator(selectors.dynamic.fieldError(field));
        await expect(errorLocator).toBeVisible();
        await expect(errorLocator).toHaveText(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
    }
}

export async function checkSignInProfileName(page: Page, user: {firstName: string, lastName: string})
{
    const userProfile = await page.locator(selectors.nav.menu).textContent();
    await expect(userProfile).toContain(` ${user.firstName} ${user.lastName} `);
}

export async function checkInvalidSignInError(page: Page) {
    const errorMessage = page.locator(selectors.auth.loginError);
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid email or password');
}

export async function logOutUser(page: Page) {
    await page.locator(selectors.nav.menu).click();
    await page.locator(selectors.nav.signOut).click();
}

export async function checkUrlAfterLogOut(page: Page, baseURL: string) {
    await page.goto(`${baseURL}/auth/login`);
}