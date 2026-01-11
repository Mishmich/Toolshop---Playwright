import {test, expect} from '@playwright/test';
import * as login from './pages/Login.ts';

test.beforeEach(async ({page}) => {
    await page.goto('/auth/login');
});

test('Sign in with valid credentials', async ({page}) => {
    await login.fillOutSignInForm(page);
    await login.submitSignInForm(page);
    const userProfile = page.locator('[data-test="nav-menu"]');
    await expect(userProfile).toBeVisible();
});

test('Sign in with invalid credentials', async ({page}) => {

});

test('Sign in with empty credentials', async ({page}) => {

});

test('Sign out after signing in', async ({page}) => {

});