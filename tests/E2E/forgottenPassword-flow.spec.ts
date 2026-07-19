import { test } from "@playwright/test";
import { selectors } from '../selectors';
import { registerUserwithTestmail } from "../pages/Registration";
import { getTestEmailAddress, waitForEmail } from "../utils/EmailUtils";

/**
 * E2E test for the forgotten password flow
 * This test covers the entire flow from requesting a password reset to receiving the email
 * Note: test not finished because no email is sent by the app
 */

test.skip("Forgotten password flow", async ({ page, baseURL }) => {
    const emailTag = `forgot-password-${Date.now()}`;
    const testEmail = getTestEmailAddress(emailTag);
    //Register a new user to ensure we have a valid email in the system
    await page.goto(`${baseURL}/auth/register`);
   // await registerUserwithTestmail(page, testEmail);
    await page.goto(`${baseURL}/auth/forgot-password`);
    await page.locator(selectors.auth.emailInput).click();
    await page.locator(selectors.auth.emailInput).fill(getTestEmailAddress(emailTag));
    await page.locator(selectors.auth.forgotPasswordSubmit).click();

    await waitForEmail(emailTag).then(email => {
        if (email) {
            console.log("Email received:", email);
            // Here you would typically extract the reset link from the email and continue the flow
        } else {
            console.warn("No email received within the timeout period.");
        }
    });
});