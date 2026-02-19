import { Page, expect, Locator } from '@playwright/test';

/**
 * Reusable UI Action Helpers
 * Industry-standard helper functions for Playwright UI automation
 */
export class UIActions {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Login to eAmata admin portal */
  async login(email: string, password: string): Promise<void> {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: /log\s*in/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Navigate to a module via sidebar/menu */
  async navigateToModule(moduleName: string): Promise<void> {
    await this.page.getByRole('link', { name: moduleName }).click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Select value from a dropdown */
  async selectDropdown(label: string, value: string): Promise<void> {
    await this.page.getByLabel(label).click();
    await this.page.getByRole('option', { name: value }).click();
  }

  /** Search for a record in list/table */
  async searchRecord(searchTerm: string): Promise<void> {
    const searchInput = this.page.getByPlaceholder(/search/i);
    await searchInput.clear();
    await searchInput.fill(searchTerm);
    await this.page.waitForLoadState('networkidle');
  }

  /** Wait for a toast notification */
  async waitForToast(message?: string): Promise<Locator> {
    const toast = message
      ? this.page.getByText(message)
      : this.page.locator('[role="alert"], .toast, .Toastify__toast');
    await expect(toast.first()).toBeVisible({ timeout: 10000 });
    return toast.first();
  }

  /** Click save and wait for response */
  async saveForm(): Promise<void> {
    await this.page.getByRole('button', { name: /save/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Delete a record with confirmation */
  async deleteRecord(identifier: string): Promise<void> {
    await this.page.getByText(identifier).click();
    await this.page.getByRole('button', { name: /delete/i }).click();
    // Confirm delete dialog
    await this.page.getByRole('button', { name: /confirm|yes|ok/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Fill a date field */
  async fillDateField(label: string, date: string): Promise<void> {
    const dateInput = this.page.getByLabel(label);
    await dateInput.clear();
    await dateInput.fill(date);
  }

  /** Upload a file */
  async uploadFile(label: string, filePath: string): Promise<void> {
    const fileInput = this.page.getByLabel(label);
    await fileInput.setInputFiles(filePath);
  }

  /** Assert a row exists in a table */
  async assertTableRowExists(text: string): Promise<void> {
    await expect(this.page.getByRole('row', { name: new RegExp(text, 'i') })).toBeVisible();
  }

  /** Get row count in a table */
  async getTableRowCount(): Promise<number> {
    const rows = this.page.getByRole('row');
    return await rows.count() - 1; // subtract header row
  }

  /** Clear a field and type new value */
  async clearAndType(locator: Locator, text: string): Promise<void> {
    await locator.clear();
    await locator.fill(text);
  }

  /** Wait for page URL to contain expected path */
  async waitForNavigation(urlPath: string): Promise<void> {
    await this.page.waitForURL(`**/${urlPath}**`, { timeout: 15000 });
  }

  /** Assert error message is visible */
  async assertErrorMessage(message: string): Promise<void> {
    await expect(this.page.getByText(message, { exact: false })).toBeVisible({ timeout: 5000 });
  }

  /** Assert current URL contains path */
  async assertUrl(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  /** Generic click with logging */
  async click(locator: Locator, description: string): Promise<void> {
    console.log(`Clicking ${description}`);
    await locator.click();
  }
}
