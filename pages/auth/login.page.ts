import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    // Elements
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly passwordVisibilityToggle: Locator;
    readonly forgotPasswordLink: Locator;
    readonly loginButton: Locator;
    readonly languageENButton: Locator;
    readonly languageFRButton: Locator;
    readonly mainHeader: Locator;
    readonly subHeader: Locator;
    // Dynamic error locators
    readonly errorMessage: Locator; // Generalized toast/text error indicator

    constructor(page: Page) {
        this.page = page;

        // Element Locators (From Reusable Locators Repository)
        this.emailInput = page.getByPlaceholder('Enter your email');
        this.passwordInput = page.getByPlaceholder('Enter your password');
        this.passwordVisibilityToggle = page.locator('button').filter({ has: page.getByTestId('VisibilityIcon') });
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.languageENButton = page.getByRole('button', { name: 'EN' });
        this.languageFRButton = page.getByRole('button', { name: 'FR' });
        this.mainHeader = page.getByText('Log in to your account');
        this.subHeader = page.getByText('Welcome! Please enter your details.');
        // Fallback locator for toast messages or inline errors (adjust based on actual app behavior)
        this.errorMessage = page.locator('.error-message, [role="alert"]');
    }

    /**
     * Navigate to the login page.
     */
    async goto() {
        await this.page.goto('https://qa.admin.eu.eamata.com/auth/login');
        // Ensure the page has loaded before attempting actions
        await this.mainHeader.waitFor({ state: 'visible' });
    }

    /**
     * Enter email address.
     */
    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    /**
     * Enter password.
     */
    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    /**
     * Toggle password visibility.
     */
    async togglePasswordVisibility() {
        await this.passwordVisibilityToggle.click();
    }

    /**
     * Click the login button and optionally wait for navigation.
     */
    async submit() {
        await this.loginButton.click();
        // In a real scenario, you'd want to wait for a network response or a specific element on the dashboard
        // e.g., await this.page.waitForNavigation(); or await this.page.waitForSelector('.dashboard-header');
    }

    /**
     * Perform a complete login action.
     */
    async login(email: string, pass: string) {
        await this.enterEmail(email);
        await this.enterPassword(pass);
        await this.submit();
    }

    /**
     * Click Forgot Password.
     */
    async clickForgotPassword() {
        await this.forgotPasswordLink.click();
    }

    /**
   * Select Language (EN or FR)
   * @param language 'EN' or 'FR'
   */
    async selectLanguage(language: 'EN' | 'FR') {
        if (language === 'EN') {
            await this.languageENButton.click();
        } else {
            await this.languageFRButton.click();
        }
    }

    /**
     * Wait for and return the text of an error message.
     */
    async getErrorMessage(): Promise<string | null> {
        try {
            await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
            return await this.errorMessage.textContent();
        } catch (e) {
            return null; // Return null if no error message appears within timeout
        }
    }
}
