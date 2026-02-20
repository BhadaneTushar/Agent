# Reusable Locators Repository
*A central manifest of stable locators discovered and verified by Tushar across sessions.*

## Global Nav
- (No locators stored yet)

## Feature: Login (EAEU-2)
- **Email Input Field:** `page.getByPlaceholder('Enter your email')`
- **Password Input Field:** `page.getByPlaceholder('Enter your password')`
- **Password Visibility Toggle:** `page.locator('button').filter({ has: page.getByTestId('VisibilityIcon') })`
- **Forgot Password Link:** `page.getByRole('link', { name: 'Forgot Password?' })`
- **Login Button:** `page.getByRole('button', { name: 'Login' })`
- **Language EN Button:** `page.getByRole('button', { name: 'EN' })`
- **Language FR Button:** `page.getByRole('button', { name: 'FR' })`
- **Main Header:** `page.getByText('Log in to your account')`
- **Sub-Header:** `page.getByText('Welcome! Please enter your details.')`
