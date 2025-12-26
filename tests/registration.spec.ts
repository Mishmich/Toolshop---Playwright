import {test, expect} from '@playwright/test';
import * as registration from './pages/Registration.ts';

test.beforeEach(async ({page}) => {
    await page.goto('/auth/registration');
});

test('Register a client with valid data', async ({page}) => {
    await registration.registerUser(page);
});

test('Register a client with invalid data', async ({page}) => {

});