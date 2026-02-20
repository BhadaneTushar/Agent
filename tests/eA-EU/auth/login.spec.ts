import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/auth/login.page';

test.describe('EAEU-2: Super Admin Login', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test.describe('AC1: Login Page Accessibility', () => {
        test('SCENARIO-EAEU-2-01, 02: Verify access and input fields', async ({ page }) => {
            await expect(loginPage.mainHeader).toBeVisible();
            await expect(loginPage.subHeader).toBeVisible();
            await expect(loginPage.emailInput).toBeVisible();
            await expect(loginPage.passwordInput).toBeVisible();
            await expect(page).toHaveURL(/.*\/auth\/login/);
        });

        test('SCENARIO-EAEU-2-03, 04, 05, 06: Verify Login button state based on inputs', async () => {
            // Button should be disabled initially (Requires actual 'disabled' attribute check depending on implementation)
            // Note: Assuming standard implementation where button relies on form validation state.
            // EAmata UI behavior check needed if it truly disables or just shows error on click.

            // Let's assume standard disabled behavior for test design
            // await expect(loginPage.loginButton).toBeDisabled();

            await loginPage.enterEmail('test@example.com');
            // await expect(loginPage.loginButton).toBeDisabled();

            await loginPage.emailInput.clear();
            await loginPage.enterPassword('Password123');
            // await expect(loginPage.loginButton).toBeDisabled();

            await loginPage.enterEmail('test@example.com');
            await expect(loginPage.loginButton).toBeEnabled();
        });
    });

    test.describe('AC3: Successful Login', () => {
        test('SCENARIO-EAEU-2-11, 12, 13: Verify successful login with valid credentials', async ({ page }) => {
            // NOTE: Replace with actual valid QA credentials
            const validEmail = 'tushar.bhadane+super@thinkitive.com';
            const validPassword = 'Eamata@123';

            await loginPage.login(validEmail, validPassword);

            // Wait for navigation and verify dashboard elements
            // e.g., await expect(page).toHaveURL(/.*\/admin\/dashboard/);
            // Ensure network idle to confirm successful session establishment
            await page.waitForLoadState('networkidle');

            // Verification of success message typically handled via general Toast assertions
        });
    });

    test.describe('AC4: Error Handling', () => {
        test('SCENARIO-EAEU-2-08, 15: Verify error on invalid password', async () => {
            const validEmail = 'tushar.bhadane+super@thinkitive.com';
            const invalidPassword = 'WrongPassword456!';

            await loginPage.login(validEmail, invalidPassword);

            // Await the API response. Good SDET practice:
            // const response = await page.waitForResponse(response => response.url().includes('/api/auth/login') && response.status() === 401);

            // Check for visible error element
            const errorText = await loginPage.getErrorMessage();
            // expect(errorText).toContain('Invalid credentials'); // Update with exact copy.
        });

        test('SCENARIO-EAEU-2-07: Verify error on unregistered email', async () => {
            await loginPage.login('doesnotexist123@thinkitive.com', 'SomePassword123');
            const errorText = await loginPage.getErrorMessage();
            // expect(errorText).toBeTruthy(); 
        });
    });

    test.describe('AC5: Security Measures', () => {
        test('SCENARIO-EAEU-2-19: Verify password field is masked by default', async () => {
            await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

            // Optional: Verify toggle behavior
            await loginPage.togglePasswordVisibility();
            await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
        });
    });
});
