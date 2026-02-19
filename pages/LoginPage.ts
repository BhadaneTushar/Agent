import { Page, Locator, expect } from '@playwright/test';
import { UIActions } from '../utils/ui-actions';

export class LoginPage {
    readonly page: Page;
    readonly uiActions: UIActions;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.uiActions = new UIActions(page);
        this.emailInput = page.getByPlaceholder('Enter your email');
        this.passwordInput = page.getByPlaceholder('Enter your password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.locator('.MuiAlert-message'); // Assumption based on Material UI
    }

    async navigate() {
        await this.page.goto('https://qa.admin.eu.eamata.com/auth/login');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }

    async isPasswordMasked() {
        return await this.passwordInput.getAttribute('type') === 'password';
    }
}
