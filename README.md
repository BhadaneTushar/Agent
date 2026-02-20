# 🎯 eAmata Playwright Test Automation Framework

A production-grade **Playwright + TypeScript** test automation framework for the **eAmata Healthcare EHR** platform, powered by the **Tushar SDET Agent** — an AI-driven quality engineering workflow.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running Tests](#running-tests)
- [Tushar SDET Agent](#-tushar-sdet-agent)
- [Test Architecture](#test-architecture)
- [Contributing](#contributing)

---

This framework provides end-to-end UI test automation for the **eAmata** healthcare administration platform. It follows industry best practices including:

- ✅ **Page Object Model (POM)** design pattern
- ✅ **Reusable helper utilities** for UI interactions
- ✅ **Faker-based test data generation** with healthcare-specific generators
- ✅ **Risk-based test prioritization** (P0–P3) for healthcare compliance
- ✅ **Full traceability** from acceptance criteria → scenarios → test files
- ✅ **Cross-browser support** — Chromium, Firefox, WebKit

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Playwright](https://playwright.dev/) | Browser automation |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test development |
| [@faker-js/faker](https://fakerjs.dev/) | Dynamic test data generation |
| [BMAD Framework](https://github.com/bmad-method) | AI agent orchestration |

---

## Project Structure

```
eAmataPlaywright/
├── pages/                    # Page Object Models
│   └── LoginPage.ts          # Login page interactions & assertions
├── tests/                    # Test specifications
│   └── login.spec.ts         # Super Admin login tests (23 cases)
├── test-data/                # Test data factories
│   └── login.data.ts         # Login test data (valid, invalid, boundary, malformed)
├── utils/                    # Reusable utilities
│   └── ui-actions.ts         # UI interaction helpers (login, navigate, dropdown, etc.)
├── _bmad/                    # BMAD agent configuration
│   └── bmm/agents/sdet.md    # Tushar SDET Agent definition
├── playwright.config.ts      # Playwright configuration
├── package.json              # Project dependencies
└── .gitignore                # Git ignore rules
```

---

## Setup & Installation

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install

```bash
# Clone the repository
git clone git@github.com:BhadaneTushar/Agent.git
cd Agent

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

---

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test tests/login.spec.ts
```

### Run in headed mode (visible browser)
```bash
npx playwright test --headed
```

### Run on a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run by tag
```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
```

### View HTML report
```bash
npx playwright show-report
```

---

**Tushar** is an AI-powered Senior SDET agent built on the BMAD framework. It follows a **structured 5-step QA workflow** to generate production-ready test automation:

```
Step 1 → Validate Requirements        (flag gaps, assign AC IDs)
Step 2 → Design Test Scenarios         (risk-based priority P0–P3)
Step 3 → Make Automation Decisions     (automate vs manual)
Step 4 → Plan Test Data               (scan existing, generate with Faker)
Step 5 → Generate Playwright UI Tests  (POM + reusable helpers)
```

### Agent Capabilities

| Command | Description |
|---------|-------------|
| `GEN` | Smart Generate — full 6-step workflow |
| `SC` | Scenarios + Automation Decision |
| `UI` | Playwright UI tests only |
| `TD` | Faker-based test data generator |
| `SD` | Selector discovery & recommendation (with **Smart Nav** for feature links) |
| `CG` | Coverage gap analysis |
| `RB` | Regression suite builder |
| `JI` | Jira integration — pull stories → tests |
| `FD` | Flaky test doctor — diagnose & fix |
| `TM` | Traceability matrix generator |
| `KILL` | Process Terminator — kill stuck Node/Playwright processes |

### Healthcare Domain Expertise

Built-in risk awareness for EHR systems:
- 🔴 **Critical**: Patient mapping, permission leaks
- 🟠 **High**: Duplicate submissions, concurrency, status transitions, partial saves
- 🟡 **Medium**: Timezone handling, validation gaps

---

## Test Architecture

### Page Object Model

All page interactions are encapsulated in POM classes under `pages/`:

```typescript
// Example: LoginPage.ts
export class LoginPage {
    constructor(private page: Page, private baseURL: string) {}
    
    async login(email: string, password: string) { ... }
    async verifyLoginSuccess() { ... }
    async verifyErrorMessage() { ... }
}
```

### Reusable Helpers

Common operations are centralized in `utils/`:

- **`ui-actions.ts`** — login, navigate, dropdown, search, toast, save, delete, date picker, file upload

### Test Data Factory

Dynamic test data using `@faker-js/faker`:

```typescript
// test-data/login.data.ts
validData()        // Valid credentials
invalidData(type)  // Wrong email, wrong password, both wrong
boundaryData(type) // Empty fields, SQL injection, XSS, max length
malformedEmails()  // Invalid email formats
```

---

## Test Coverage — Login Module

| Category | Test Cases | Coverage |
|----------|-----------|----------|
| Page Accessibility | TC-01 to TC-05 | Login page loads, URL, HTTPS, password mask |
| Credentials Validation | TC-06 to TC-08 | Wrong email, wrong password, both wrong |
| Successful Login | TC-09 to TC-10 | Valid login, dashboard redirect |
| Error Handling | TC-11 to TC-14 | Error messages, empty fields |
| Security | TC-15 to TC-18 | Password toggle, SQL injection, XSS, whitespace |
| Edge Cases | TC-19 to TC-21 | Malformed emails, max length, special chars |
| Session Management | TC-22 to TC-23 | Page refresh, rapid login attempts |

**Total: 23 test cases** • Priority: P0 (Critical) to P3 (Low)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## Author

**Tushar Bhadane** — SDET  
🔗 [GitHub](https://github.com/BhadaneTushar)

---

## License

ISC
