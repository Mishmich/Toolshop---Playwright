import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/auth/login');
});

test('Sign in with valid credentials', async ({page}) => {

});

test('Sign in with invalid credentials', async ({page}) => {

});

test('Sign in with empty credentials', async ({page}) => {

});

test('Sign out after signing in', async ({page}) => {

});