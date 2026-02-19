import { Page, expect, Locator } from '@playwright/test';

/**
 * LoginPage - Page Object Model
 * Feature: Super Admin Login (EAEU-2)
 * 
 * Selectors based on accessible roles, labels, and standard login form patterns.
 * NOTE: Update selectors after verifying with live application if needed.
 */
export class LoginPage {
    readonly page: Page;
    readonly baseURL: string;

    // --- Locators ---
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly forgotPasswordLink: Locator;
    readonly passwordToggle: Locator;
    readonly errorMessage: Locator;
    readonly logoImage: Locator;

    constructor(page: Page, baseURL: string = 'https://qa.admin.eu.eamata.com') {
        this.page = page;
        this.baseURL = baseURL;

        // Selectors using getByRole / getByLabel / getByTestId priority
        this.emailInput = page.getByLabel(/email/i);
        this.passwordInput = page.getByLabel(/password/i);
        this.loginButton = page.getByRole('button', { name: /log\s*in/i });
        this.forgotPasswordLink = page.getByRole('link', { name: /forgot/i });
        this.passwordToggle = page.locator('button:near(:text("Password"))').or(
            page.getByRole('button', { name: /show|hide|toggle/i })
        );
        this.errorMessage = page.locator('[role="alert"]').or(
            page.locator('.error-message, .toast-error, .Toastify__toast--error')
        );
        this.logoImage = page.getByRole('img', { name: /eamata|logo/i });
    }

    // --- Actions ---

    /** Navigate to login page */
    async goto(): Promise<void> {
        await this.page.goto(`${this.baseURL}/auth/login`);
        await this.page.waitForLoadState('networkidle');
    }

    /** Fill email field */
    async fillEmail(email: string): Promise<void> {
        await this.emailInput.clear();
        await this.emailInput.fill(email);
    }

    /** Fill password field */
    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.clear();
        await this.passwordInput.fill(password);
    }

    /** Click login button */
    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }

    /** Perform full login flow */
    async login(email: string, password: string): Promise<void> {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickLogin();
        await this.page.waitForLoadState('networkidle');
    }

    /** Toggle password visibility */
    async togglePasswordVisibility(): Promise<void> {
        await this.passwordToggle.click();
    }

    /** Click forgot password link */
    async clickForgotPassword(): Promise<void> {
        await this.forgotPasswordLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    // --- Assertions ---

    /** Verify login page is displayed */
    async verifyPageLoaded(): Promise<void> {
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    /** Verify page URL is login */
    async verifyOnLoginPage(): Promise<void> {
        await expect(this.page).toHaveURL(/\/auth\/login/);
    }

    /** Verify login page is served over HTTPS */
    async verifyHTTPS(): Promise<void> {
        const url = this.page.url();
        expect(url).toMatch(/^https:\/\//);
    }

    /** Verify password field is masked */
    async verifyPasswordMasked(): Promise<void> {
        await expect(this.passwordInput).toHaveAttribute('type', 'password');
    }

    /** Verify password field is unmasked (text) */
    async verifyPasswordVisible(): Promise<void> {
        await expect(this.passwordInput).toHaveAttribute('type', 'text');
    }

    /** Verify error message is displayed */
    async verifyErrorMessage(expectedText?: string): Promise<void> {
        if (expectedText) {
            await expect(this.page.getByText(expectedText, { exact: false })).toBeVisible({ timeout: 10000 });
        } else {
            await expect(this.errorMessage.first()).toBeVisible({ timeout: 10000 });
        }
    }

    /** Verify login button state */
    async verifyLoginButtonEnabled(): Promise<void> {
        await expect(this.loginButton).toBeEnabled();
    }

    async verifyLoginButtonDisabled(): Promise<void> {
        await expect(this.loginButton).toBeDisabled();
    }

    /** Verify redirect to dashboard/home after login */
    async verifyLoginSuccess(): Promise<void> {
        await this.page.waitForURL(/(?!.*\/auth\/login).*/, { timeout: 15000 });
        await expect(this.page).not.toHaveURL(/\/auth\/login/);
    }

    /** Verify page title */
    async verifyPageTitle(): Promise<void> {
        await expect(this.page).toHaveTitle(/eAmata/i);
    }

    /** Get email input value */
    async getEmailValue(): Promise<string> {
        return await this.emailInput.inputValue();
    }

    /** Get password input value */
    async getPasswordValue(): Promise<string> {
        return await this.passwordInput.inputValue();
    }
}
