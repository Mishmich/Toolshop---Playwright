# Toolshop — Playwright Test Automation

A comprehensive Playwright-based test automation suite for https://practicesoftwaretesting.com/ covering functional testing, E2E workflows, API testing, and visual regression.

## Project Structure

```
c:\Data\pst_PW_test\
├── tests/
│   ├── pages/                  # Page Object Models
│   │   ├── Home.ts
│   │   ├── Login.ts
│   │   ├── Registration.ts
│   │   ├── Contact.ts
│   │   └── Checkout.ts
│   ├── utils/
│   │   ├── CSV_append.ts       # CSV data persistence
│   │   └── EmailUtils.ts       # Email utilities
│   ├── data/
│   │   └── registrations.csv   # Generated test user records
│   ├── E2E/
│   │   └── product-flow.spec.ts       # End-to-end user journey
│   ├── API/                    # API test suite
│   ├── UI/
│   │   ├── __screenshots__/    # Visual regression baselines
│   │   ├── playwright.config.ts
│   │   ├── home.spec.ts
│   │   ├── login.spec.ts
│   │   └── about.spec.ts
│   ├── check-out.spec.ts
│   ├── contact.spec.ts
│   ├── homepage.spec.ts
│   ├── login.spec.ts
│   ├── product-detail.spec.ts
│   └── registration.spec.ts
├── scripts/
│   └── create-files-from-json.js   # File generation utility
├── playwright.config.ts        # Main Playwright configuration
├── playwright-report/          # HTML test reports
├── test-results/               # Test artifacts
├── package.json
└── README.md
```

## Features

- **Page Object Model (POM)**: Organized page classes for maintainability and reusability.
- **Functional Tests**: Coverage for login, registration, product browsing, checkout, and contact forms.
- **E2E Tests**: Complete user journeys (e.g., product flow from browsing to checkout).
- **API Tests**: Backend endpoint validation.
- **Visual Regression**: Full-page screenshot comparisons to detect unintended UI changes.
- **Data Persistence**: Test user registration logged to CSV for auditing and reuse.
- **Email Utilities**: Support for email-based workflows and verification.

## Installation

1. Clone or download the project.
2. Install dependencies:
   ```
   npm install
   ```
3. Install Playwright browsers (one-time):
   ```
   npx playwright install
   ```

## Running Tests

### Run all tests
```
npx playwright test
```

### Run specific test file
```
npx playwright test tests/login.spec.ts
```

### Run tests by folder
```
npx playwright test tests/E2E/
npx playwright test tests/UI/
npx playwright test tests/API/
```

### Run UI visual regression tests
```
npx playwright test --config=tests/UI/playwright.config.ts
```

### Update visual baselines (after intentional design changes)
```
npx playwright test --config=tests/UI/playwright.config.ts --update-snapshots
```

### Run in debug mode (interactive)
```
npx playwright test --debug
```

### View HTML test report
```
npx playwright show-report
```

## Test Data & CSV Logging

When you run registration or sign-up tests, credentials are automatically saved to `tests/data/registrations.csv` with columns:
- email
- firstName
- lastName
- createdAt (Central European Time)

**Example workflow:**
```typescript
import { saveRegistration } from './utils/CSV_append';
import { generateEmail } from './utils/EmailUtils';

test('register new user', async ({ page }) => {
  const email = generateEmail();
  
  // ... fill registration form ...
  
  const cetDate = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
  
  saveRegistration({
    email: email,
    firstName: 'Test',
    lastName: 'User',
    createdAt: cetDate
  });
});
```

**Add to .gitignore to avoid committing real test data:**
```
tests/data/
```

## Page Object Models

Located in `tests/pages/`, these classes encapsulate selectors and actions for each page:

```typescript
import { Home } from './pages/Home';
import { Login } from './pages/Login';

test('user flow', async ({ page }) => {
  const home = new Home(page);
  const login = new Login(page);
  
  await home.navigate();
  await home.clickLoginButton();
  await login.fillEmail('user@example.com');
  await login.fillPassword('password');
  await login.submit();
});
```

## Key Utilities

### saveRegistration() (CSV_append.ts)
Logs test user data to CSV for auditing:
```typescript
saveRegistration({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
});
```

### EmailUtils (EmailUtils.ts)
Utilities for email-based workflows, including generating unique test emails:
```typescript
import { generateEmail } from './utils/EmailUtils';

const email = generateEmail(); // Generates a unique email for testing
```

## Visual Regression Testing (UI/)

The `tests/UI/` folder contains visual regression tests with full-page screenshots.

1. **Generate or update baselines** (run once per design change):
   ```
   npx playwright test --config=tests/UI/playwright.config.ts --update-snapshots
   ```

2. **Commit baseline images** (so CI/team see expected state):
   ```
   git add tests/UI/__screenshots__/
   ```

3. **Run tests in CI** to catch visual regressions automatically:
   ```
   npx playwright test --config=tests/UI/playwright.config.ts
   ```

## CI/CD Integration

Example GitHub Actions workflow:
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx playwright install
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Configuration

### playwright.config.ts (Main)
- Base URL: https://practicesoftwaretesting.com/
- Timeout: 30s per action
- Retries: 2 (on failure)
- Parallel execution: 4 workers
- Screenshot on failure: enabled

### tests/UI/playwright.config.ts (UI Tests)
- Test directory: ./UI
- Viewport: 1280x720
- Headless: true
- Snapshot directory: __screenshots__

## Troubleshooting

### Tests timeout
- Increase `actionTimeout` or `navigationTimeout` in playwright.config.ts
- Check if the website is slow or down
- Run with `--headed` to see what's happening: `npx playwright test --headed`

### CSV file not being created
- Ensure `tests/utils/CSV_append.ts` is imported correctly
- Verify `tests/data/` directory exists and is writable
- Check that the test calls `saveRegistration()` after user creation

### Visual regression snapshots fail
- **Expected**: Design changes are intentional → update baselines: `--update-snapshots`
- **Unexpected**: Run in headed mode to see visual differences: `npx playwright test --headed --config=tests/UI/playwright.config.ts`
- Hide dynamic elements (timestamps, ads) before screenshots to avoid flaky tests

### Tests fail with "Element not found"
- Selectors may have changed in the website
- Update selectors in the corresponding Page Object Model
- Run in debug mode to inspect: `npx playwright test --debug`

## Best Practices

- ✅ Use Page Object Models to organize selectors and actions
- ✅ Log test users to CSV for audit trails
- ✅ Hide dynamic elements before visual regression snapshots
- ✅ Commit visual baselines so CI catches regressions
- ✅ Run tests in parallel (default: 4 workers)
- ✅ Use meaningful test names and descriptions
- ❌ Avoid committing CSV files with real user data
- ❌ Avoid hardcoding credentials or test data
- ❌ Avoid relying on test execution order (keep tests independent)

## Next Steps

- Configure a test environment URL via environment variables
- Add pre-commit hooks to run tests before pushing
- Expand API test coverage
- Set up CI/CD pipeline with GitHub Actions or similar
- Add performance testing (Lighthouse, etc.)
- Document test scenarios and expected outcomes

## Support

For issues or questions, refer to:
- [Playwright Documentation](https://playwright.dev)
- [Practice Software Testing](https://practicesoftwaretesting.com/)
- Project repository: https://github.com/Mishmich/Toolshop---Playwright
