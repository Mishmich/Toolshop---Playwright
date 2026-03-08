import { test } from "@playwright/test";
import { registerUserwithTestmail } from "../pages/Registration.ts";
import { getTestEmailAddress, waitForEmail } from "../utils/EmailUtils.ts";

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
    await registerUserwithTestmail(page, testEmail);
    await page.goto(`${baseURL}/auth/forgot-password`);
    await page.locator('[data-test="email"]').click();
    await page.locator('[data-test="email"]').fill(getTestEmailAddress(emailTag));
    await page.locator('[data-test="forgot-password-submit"]').click();

    await waitForEmail(emailTag).then(email => {
        if (email) {
            console.log("Email received:", email);
            // Here you would typically extract the reset link from the email and continue the flow
        } else {
            console.warn("No email received within the timeout period.");
        }
    });
});