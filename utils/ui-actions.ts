import { Page, expect, Locator } from '@playwright/test';

/**
 * Reusable UI Action Helpers
 * Industry-standard helper functions for Playwright UI automation
 */

/** Login to eAmata admin portal */
export async function login(page: Page, email: string, password: string): Promise<void> {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /log\s*in/i }).click();
  await page.waitForLoadState('networkidle');
}

/** Navigate to a module via sidebar/menu */
export async function navigateToModule(page: Page, moduleName: string): Promise<void> {
  await page.getByRole('link', { name: moduleName }).click();
  await page.waitForLoadState('networkidle');
}

/** Select value from a dropdown */
export async function selectDropdown(page: Page, label: string, value: string): Promise<void> {
  await page.getByLabel(label).click();
  await page.getByRole('option', { name: value }).click();
}

/** Search for a record in list/table */
export async function searchRecord(page: Page, searchTerm: string): Promise<void> {
  const searchInput = page.getByPlaceholder(/search/i);
  await searchInput.clear();
  await searchInput.fill(searchTerm);
  await page.waitForLoadState('networkidle');
}

/** Wait for a toast notification */
export async function waitForToast(page: Page, message?: string): Promise<Locator> {
  const toast = message
    ? page.getByText(message)
    : page.locator('[role="alert"], .toast, .Toastify__toast');
  await expect(toast.first()).toBeVisible({ timeout: 10000 });
  return toast.first();
}

/** Click save and wait for response */
export async function saveForm(page: Page): Promise<void> {
  await page.getByRole('button', { name: /save/i }).click();
  await page.waitForLoadState('networkidle');
}

/** Delete a record with confirmation */
export async function deleteRecord(page: Page, identifier: string): Promise<void> {
  await page.getByText(identifier).click();
  await page.getByRole('button', { name: /delete/i }).click();
  // Confirm delete dialog
  await page.getByRole('button', { name: /confirm|yes|ok/i }).click();
  await page.waitForLoadState('networkidle');
}

/** Fill a date field */
export async function fillDateField(page: Page, label: string, date: string): Promise<void> {
  const dateInput = page.getByLabel(label);
  await dateInput.clear();
  await dateInput.fill(date);
}

/** Upload a file */
export async function uploadFile(page: Page, label: string, filePath: string): Promise<void> {
  const fileInput = page.getByLabel(label);
  await fileInput.setInputFiles(filePath);
}

/** Assert a row exists in a table */
export async function assertTableRowExists(page: Page, text: string): Promise<void> {
  await expect(page.getByRole('row', { name: new RegExp(text, 'i') })).toBeVisible();
}

/** Get row count in a table */
export async function getTableRowCount(page: Page): Promise<number> {
  const rows = page.getByRole('row');
  return await rows.count() - 1; // subtract header row
}

/** Clear a field and type new value */
export async function clearAndType(page: Page, locator: Locator, text: string): Promise<void> {
  await locator.clear();
  await locator.fill(text);
}

/** Wait for page URL to contain expected path */
export async function waitForNavigation(page: Page, urlPath: string): Promise<void> {
  await page.waitForURL(`**/${urlPath}**`, { timeout: 15000 });
}

/** Assert error message is visible */
export async function assertErrorMessage(page: Page, message: string): Promise<void> {
  await expect(page.getByText(message, { exact: false })).toBeVisible({ timeout: 5000 });
}

/** Assert current URL contains path */
export async function assertUrl(page: Page, path: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(path));
}
