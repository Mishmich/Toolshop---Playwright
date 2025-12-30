import {test, expect} from '@playwright/test';
import * as registration from './pages/Registration.ts';

test.beforeEach(async ({page}) => {
    await page.goto('/auth/registration');
});

test('Register a client with valid data', async ({page}) => {
    await registration.registerUser(page);
});

test('Submit empty registration form', async ({page}) => {

});

test('Register with already used email', async ({page}) => {});

test('Register with invalid password', async ({page}) => {});

test('Make password visible', async ({page}) => {});