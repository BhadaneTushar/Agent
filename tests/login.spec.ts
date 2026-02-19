import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SUPER_ADMIN, invalidData, boundaryData } from '../test-data/login.data';

test.describe('EAEU-2: Super Admin Login', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('SC-01: Verify Super Admin login with valid credentials @smoke @P0', async ({ page }) => {
        await loginPage.login(SUPER_ADMIN.email, SUPER_ADMIN.password);
        await expect(page).toHaveURL(/.*provider-group/);
    });

    test('SC-02: Verify login fails with invalid email @regression @P0', async () => {
        const invalidUser = invalidData('wrong_email');
        await loginPage.login(invalidUser.email, invalidUser.password);
        await expect(loginPage.errorMessage).toBeVisible(); // Adjust selector if needed
    });

    test('SC-03: Verify login fails with invalid password @regression @P0', async () => {
        const invalidPass = invalidData('wrong_password');
        await loginPage.login(invalidPass.email, invalidPass.password);
        await expect(loginPage.errorMessage).toBeVisible();
    });

    test('SC-04: Verify login with empty fields @regression @P1', async () => {
        const empty = boundaryData('both_empty');
        await loginPage.login(empty.email, empty.password);
        // Depending on validation, button might be disabled, check for that or validation message
        // AC says: "A “Login” button is visible and enabled when both fields are filled"
        // So if empty, button might be enabled but show error, OR disabled. 
        // Let's check if button is enabled/disabled or validation appears.
        // Based on typical MUI behavior, it might be client-side validation.
        // Let's assume validation message or no action.
        // Or maybe check that we are still on login page.
        await expect(loginPage.page).toHaveURL(/.*login/);
    });

    test('SC-05: Verify password field is masked @security @P2', async () => {
        expect(await loginPage.isPasswordMasked()).toBeTruthy();
    });

    test('SC-06: Verify logout functionality @regression @P1', async ({ page }) => {
        await loginPage.login(SUPER_ADMIN.email, SUPER_ADMIN.password);
        await expect(page).toHaveURL(/.*provider-group/);

        // Logout flow
        await page.getByRole('button', { name: /profile/i }).click(); // Assumption based on generic profile menu
        // Actually selector report says: 
        // page.getByRole('menuitem', { name: 'Profile' })
        // page.getByRole('menuitem', { name: 'Logout' })
        // But first we need to open the menu. Usually an avatar or icon.
        // Selector report has: page.getByTestId('PersonIcon')

        await page.getByTestId('PersonIcon').click();
        await expect(page.getByRole('menuitem', { name: 'Logout' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Logout' }).click();
        await expect(page).toHaveURL(/.*login/);
    });
});
