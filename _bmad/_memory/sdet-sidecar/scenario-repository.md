# Scenario Repository
*A persistent store of scenarios generated during [L2] AC Analysis. Grouped by Feature -> Jira Story -> AC.*

## Login Feature

### Story: EAEU-2 (Super Admin Login)

#### AC1: Login Page Accessibility
*   **SCENARIO-EAEU-2-01 (Positive):** Verify Super Admin can access the login page via the secure UI URL (`/auth/login`).
*   **SCENARIO-EAEU-2-02 (Positive):** Verify the login page contains Email and Password input fields.
*   **SCENARIO-EAEU-2-03 (Positive):** Verify the "Login" button is initially disabled when fields are empty.
*   **SCENARIO-EAEU-2-04 (Positive):** Verify the "Login" button becomes enabled *only* when both Email and Password fields contain text.
*   **SCENARIO-EAEU-2-05 (Negative):** Verify the "Login" button remains disabled if only the Email field is filled.
*   **SCENARIO-EAEU-2-06 (Negative):** Verify the "Login" button remains disabled if only the Password field is filled.

#### AC2: Credentials Validation
*   **SCENARIO-EAEU-2-07 (Negative):** Verify login fails when an unregistered email is provided.
*   **SCENARIO-EAEU-2-08 (Negative):** Verify login fails when a valid email is provided with an incorrect password.
*   **SCENARIO-EAEU-2-09 (Negative - Edge):** Verify login fails when the account is explicitly marked as "Disabled".
*   **SCENARIO-EAEU-2-10 (Negative - Edge):** Verify login fails when the account is explicitly marked as "Archived".

#### AC3: Successful Login
*   **SCENARIO-EAEU-2-11 (Positive - Critical):** Verify successful login with valid Super Admin credentials.
*   **SCENARIO-EAEU-2-12 (Positive):** Verify redirection to the admin home screen immediately after a successful login.
*   **SCENARIO-EAEU-2-13 (Positive):** Verify a success message or welcome banner is displayed upon landing on the home screen.
*   **SCENARIO-EAEU-2-14 (Security):** Verify a secure authentication token/session cookie is created in the browser upon successful login.

#### AC4: Error Handling
*   **SCENARIO-EAEU-2-15 (Negative):** Verify a clear error message (e.g., "Invalid email or password") is displayed for incorrect credentials.
*   **SCENARIO-EAEU-2-16 (Negative):** Verify a specific message indicating restricted access is shown for disabled/archived accounts.
*   **SCENARIO-EAEU-2-17 (Localization):** Verify error messages are correctly localized based on the selected language (e.g., test with French locale if applicable).

#### AC5: Security Measures
*   **SCENARIO-EAEU-2-18 (Security):** Verify the login form is served strictly over HTTPS.
*   **SCENARIO-EAEU-2-19 (Security):** Verify the password field input type is `password` (masked as ●●●●●●).
*   **SCENARIO-EAEU-2-20 (Security):** Verify the authentication token has an appropriate expiration timeout attribute set.

#### AC7: Session Management
*   **SCENARIO-EAEU-2-21 (Positive):** Verify the Super Admin remains logged in and can navigate across pages without re-authenticating (session persistence).
*   **SCENARIO-EAEU-2-22 (Security - Edge):** Verify the system automatically logs out the user after the configured period of inactivity.
*   **SCENARIO-EAEU-2-23 (Positive):** Verify the Super Admin can manually log out, effectively destroying the session.
