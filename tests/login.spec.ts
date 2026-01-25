import {test} from '@playwright/test';
import * as login from './pages/Login.ts';

test.beforeEach(async ({page, baseURL}) => {
    await page.goto(`${baseURL}/auth/login`);
});

test('Sign in with valid credentials', { tag: '@positive'}, async ({page}) => {
    await login.fillOutSignInForm(page, login.user1);
    await login.submitSignInForm(page);
    await login.checkSignInProfileName(page, login.user1);
});

test('Sign in with invalid credentials', { tag: '@negative'}, async ({page}) => {
    await login.fillOutSignInForm(page, login.user2);
    await login.submitSignInForm(page);
    await login.checkInvalidSignInError(page);
});

test('Sign in with empty credentials', { tag: '@negative'}, async ({page}) => {
    await login.submitSignInForm(page);
    await login.checkValidationErrors(page, ['email', 'password']);
});

test('Sign out after signing in', { tag: '@positive'}, async ({page, baseURL}) => {
    await login.loginUser(page, baseURL!);
    await login.logOutUser(page);
    await login.checkUrlAfterLogOut(page, baseURL!);
});