# Toolshop Test — Playwright Test Automation

A comprehensive Playwright-based test automation suite for https://practicesoftwaretesting.com/ covering functional testing, E2E workflows, API testing, and visual regression.

## Project Structure

```
c:\Data\pst_PW_test\
├── tests/
│   ├── pages/                      # Page Object Models
│   │   ├── Home.ts
│   │   ├── Login.ts
│   │   ├── Registration.ts
│   │   ├── Contact.ts
│   │   ├── ProductDetail.ts
│   │   └── Checkout.ts
│   ├── utils/
│   │   ├── CSV_append.ts           # CSV data persistence
│   │   ├── EmailUtils.ts           # Email utilities (testmail.app integration)
│   │   └── RandomDataGen.ts        # Faker-based test data generation
│   ├── data/
│   │   ├── registrations.csv       # Generated test user records
│   │   └── attachments/            # Test files for upload testing
│   ├── E2E/
│   │   ├── product-flow.spec.ts    # End-to-end product purchase journey
│   │   └── forgottenPassword-flow.spec.ts
│   ├── API/
│   │   ├── products.api.spec.ts    # Product endpoint tests
│   │   ├── cart.api.spec.ts        # Cart endpoint tests
│   │   └── users.api.spec.ts       # User endpoint tests
│   ├── UI/
│   │   ├── ui-home.spec.ts         # Visual regression tests
│   │   ├── ui-login.spec.ts
│   │   ├── ui-registration.spec.ts
│   │   ├── ui-contact.spec.ts
│   │   ├── ui-product-detail.spec.ts
│   │   ├── ui-check-out.spec.ts
│   │   └── *-snapshots/            # Visual regression baselines
│   ├── check-out.spec.ts           # Checkout functional tests
│   ├── contact.spec.ts             # Contact form functional tests
│   ├── homepage.spec.ts            # Homepage functional tests
│   ├── login.spec.ts               # Login functional tests
│   ├── product-detail.spec.ts      # Product detail functional tests
│   └── registration.spec.ts        # Registration functional tests
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline (runs on push & schedule)
├── playwright.config.ts            # Main Playwright configuration
├── playwright-report/              # HTML test reports
├── test-results/
│   └── junit.xml                   # JUnit format results
├── package.json
└── README.md
```

## Features

- **Page Object Model (POM)**: Organized page classes with reusable selectors and actions for maintainability
- **Functional Tests**: Coverage for login, registration, product browsing, checkout, and contact forms
- **E2E Tests**: Complete user journeys (product-flow, forgotten-password flows)
- **API Tests**: Backend endpoint validation (products, cart, users)
- **Visual Regression**: Full-page screenshot comparisons using UI tests
- **Email Integration**: testmail.app support for email-based workflows with code extraction
- **Test Data Generation**: Faker.js for realistic random test data
- **CSV Logging**: Automatic registration data persistence for audit trails
- **CI/CD Ready**: GitHub Actions workflow with JUnit and HTML reporting

## Installation

1. Clone or download the project
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (create `.env` file):
   ```
   TESTMAIL_API_KEY=your_testmail_api_key_here
   TESTMAIL_NAMESPACE=your_namespace_here
   ```
4. Install Playwright browsers:
   ```
   npx playwright install
   ```

## Running Tests

### Run all tests
```
npm test
```

### Run specific test file
```
npx playwright test tests/login.spec.ts
```

### Run tests by category
```
npx playwright test tests/E2E/           # E2E tests
npx playwright test tests/API/           # API tests
npx playwright test tests/UI/            # Visual regression tests
npx playwright test --grep @positive     # By tag
```

### Run with specific browser project
```
npx playwright test --project=chromium-production
npx playwright test --project=chromium-buggy
```

### Debug mode (interactive)
```
npx playwright test --debug
```

### View HTML test report
```
npx playwright show-report
```

## Test Data & CSV Logging

When registration tests run, credentials are automatically saved to `tests/data/registrations.csv` with columns:
- `first_name`
- `last_name`
- `email`
- `createdAt`

### Usage:
```typescript
import { saveToCsv, saveRegistration } from './utils/CSV_append';
import { getTestValues } from './utils/RandomDataGen';

test('register new user', async ({ page }) => {
  const testData = await getTestValues();
  
  // ... fill registration form with testData ...
  
  saveRegistration({
    first_name: testData.first_name,
    last_name: testData.last_name,
    email: testData.emailAddress,
    createdAt: new Date().toISOString()
  });
});
```

## Page Object Models

Located in `tests/pages/`, these classes encapsulate selectors and actions:

- **Home.ts** - Homepage navigation and interactions
- **Login.ts** - Login form and authentication
- **Registration.ts** - Registration form and user creation
- **Contact.ts** - Contact form handling
- **ProductDetail.ts** - Product page interactions
- **Checkout.ts** - Checkout flow and payment

### Usage Example:
```typescript
import { test } from '@playwright/test';
import * as registration from './pages/Registration';

test('register user', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/auth/register`);
  await registration.fillRegistrationForm(page);
  await registration.clickOnSubmitButton(page);
});
```

## Key Utilities

### RandomDataGen.ts - Faker.js Integration
Generate realistic test data using Faker.js:
```typescript
import { getTestValues } from './utils/RandomDataGen';

const testData = await getTestValues();
// Returns: first_name, last_name, dob, street, postal_code, city, state, country, phone, emailAddress, password
```

### CSV_append.ts - Data Persistence
Save test data to CSV files:
```typescript
import { saveToCsv, saveRegistration } from './utils/CSV_append';

saveRegistration({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  createdAt: new Date().toISOString()
});
```

### EmailUtils.ts - testmail.app Integration
Handle email-based test workflows:
```typescript
import {
  generateTag,
  getTestEmailAddress,
  waitForEmail,
  waitForEmailAndExtractCode,
  extractCodeFromEmail
} from './utils/EmailUtils';

const tag = generateTag();
const emailAddress = getTestEmailAddress(tag); // namespace.tag@inbox.testmail.app

// Send signup to emailAddress...

// Wait for email and extract 6-digit code
const code = await waitForEmailAndExtractCode(tag);
if (code) {
  // Use code in verification step
} else {
  console.log('Email timeout - handle gracefully');
}
```

## Visual Regression Testing (UI/)

The `tests/UI/` folder contains visual regression tests with full-page screenshot baselines.

### Workflow:

1. **Generate or update baselines** (run once per design change):
   ```
   npx playwright test tests/UI/ --update-snapshots
   ```

2. **Commit baseline images**:
   ```
   git add tests/UI/*-snapshots/
   ```

3. **Run tests in CI** to catch visual regressions:
   ```
   npx playwright test tests/UI/
   ```

Visual regression tests are stored in:
- `ui-home.spec.ts-snapshots/`
- `ui-login.spec.ts-snapshots/`
- `ui-registration.spec.ts-snapshots/`
- `ui-contact.spec.ts-snapshots/`
- `ui-product-detail.spec.ts-snapshots/`
- `ui-check-out.spec.ts-snapshots/`

## CI/CD Integration

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs tests on:
- **Push** (every commit)
- **Schedule** (Sunday at midnight UTC)
- **Manual trigger** (workflow_dispatch)

### Features:
- Runs on Windows latest
- Parallel execution (4 workers locally, 1 on CI)
- Automatic retry on CI (2 retries)
- HTML, GitHub, and JUnit reports
- Deployed to GitHub Pages

### Configuration:
```yaml
name: Playwright Tests
on:
  schedule:
    - cron: '0 0 * * 0'  # Sunday midnight UTC
  workflow_dispatch:
  push:                   # On every commit
```

## Configuration

### playwright.config.ts

**Test Projects:**
- `chromium-production` - Tests against production environment
- `chromium-buggy` - Tests against buggy version for practice

**Base URL:** https://practicesoftwaretesting.com

**Reporters:**
- HTML (default)
- GitHub (for CI)
- JUnit (test-results/junit.xml)

**Parallel Execution:**
- Local: 4 workers (fullyParallel: true)
- CI: 1 worker (sequential)

**Retry Policy:**
- Local: No retries
- CI: 2 retries on failure

**Tracing:**
- Enabled on first retry for debugging

## Troubleshooting

### Tests timeout
- Increase timeout in playwright.config.ts
- Check if https://practicesoftwaretesting.com is accessible
- Run with `--headed` to see what's happening: `npx playwright test --headed`

### CSV file not created
- Ensure `tests/data/` directory exists and is writable
- Verify `saveRegistration()` is called in the test
- Check for file system permissions

### Email tests timeout
- Verify `TESTMAIL_API_KEY` and `TESTMAIL_NAMESPACE` are set in `.env`
- Check testmail.app account for active inboxes
- Allow up to 5 minutes for email delivery

### Visual regression snapshots fail
- **Intentional UI changes**: Update baselines with `--update-snapshots`
- **Unexpected**: Run `--headed` to visually inspect differences
- Hide timestamps/dynamic content before snapshots to avoid flakiness

### Element not found errors
- Selectors may have changed in the target website
- Update selectors in the corresponding Page Object Model
- Use `--debug` mode to inspect selectors

## Best Practices

✅ **Do:**
- Use Page Object Models to organize selectors and actions
- Generate random test data with Faker.js for realistic scenarios
- Log test users to CSV for audit trails and reuse
- Use meaningful test names and descriptions
- Run tests in parallel for speed (default: 4 workers)
- Tag tests for easy filtering (`@positive`, `@negative`, etc.)
- Use email utilities for email-based verification flows
- Commit visual baselines so CI catches regressions

❌ **Don't:**
- Hardcode test data or credentials
- Rely on test execution order (keep tests independent)
- Commit CSV files with sensitive test data
- Use dynamic content (timestamps) in visual regression tests
- Ignore timeout errors in CI/CD pipelines

## Next Steps

- Set up environment file with testmail.app credentials
- Configure email code extraction pattern once email format is known
- Expand E2E test coverage (product-flow and forgottenPassword-flow are templates)
- Add data cleanup/archival for old CSV registrations
- Integrate pre-commit hooks to run tests before pushing
- Document additional test scenarios and expected outcomes
- Monitor CI/CD pipeline performance and optimize worker count

## Dependencies

- **@playwright/test** (^1.56.1) - Test framework
- **@faker-js/faker** (^10.1.0) - Random test data generation
- **axios** (^1.13.6) - HTTP client for email API
- **mailslurp-client** (^16.0.0) - MailSlurp integration (not currently in use)
- **dotenv** (^17.2.3) - Environment variable management
