# OrangeHRM Playwright Automation Framework

A Playwright-native TypeScript framework covering authentication, employee lifecycle, RBAC validation, API verification, cleanup, reporting, linting, and CI sharding.

## Why Playwright

The original project used Java/TestNG with Selenium-style driver, waits, listeners and screenshot utilities. This version intentionally uses Playwright's native fixtures, auto-waiting, browser contexts, APIRequestContext, traces, screenshots, videos, reporters and sharding rather than reproducing Selenium abstractions.

## Framework structure

```text
orangehrm-playwright/
├── .github/workflows/ci.yml
├── src/
│   ├── api/EmployeeApiService.ts
│   ├── fixtures/testFixtures.ts
│   ├── pages/
│   │   ├── DashboardPage.ts
│   │   ├── LoginPage.ts
│   │   └── PimPage.ts
│   └── utils/
│       ├── env.ts
│       └── testData.ts
├── tests/
│   ├── authentication.spec.ts
│   ├── employee-lifecycle.spec.ts
│   └── rbac.spec.ts
├── .env.example
├── eslint.config.mjs
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

## Setup

```bash
npm install
npx playwright install
cp .env.example .env
npm test
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm install
npx playwright install
npm test
```

## Common commands

```bash
npm run test:smoke
npm run test:regression
npm run test:headed
npm run test:ui
npm run typecheck
npm run lint
npm run report
```

## Functional coverage

- Admin authentication and logout
- Invalid-login negative validation
- Employee creation
- API-level employee verification using the same authenticated browser context
- Employee update
- Employee search
- Employee deletion and cleanup
- Admin PIM access validation
- Optional real negative RBAC validation using a restricted/ESS user

## CI/CD

GitHub Actions runs:

1. TypeScript type-check
2. ESLint static-analysis gate
3. Three true Playwright shards using `--shard=1/3`, `2/3`, and `3/3`
4. Failure evidence via screenshots, traces, and videos
5. Test result artifacts

This fixes the prior matrix problem where multiple jobs were created but each executed the same suite.

## AI-assisted changes you should be able to explain

### 1. DriverManager removed
Playwright creates isolated browser contexts and pages through fixtures. A Selenium-style singleton/thread-local driver manager is unnecessary and can fight Playwright's lifecycle.

### 2. WaitUtils removed
Playwright locators automatically wait for actionability. Assertions such as `expect(locator).toBeVisible()` are web-first and retry until the configured timeout.

### 3. Page Object Model retained but simplified
Pages expose business actions (`login`, `addEmployee`, `deleteEmployeeFromResults`) rather than exposing raw locators to tests.

### 4. TestNG BaseTest replaced by fixtures
`testFixtures.ts` composes reusable page objects and optional authenticated setup. This gives dependency injection with strong typing and avoids inheritance-heavy test code.

### 5. REST API verification integrated with browser session
`page.request` shares the browser context's cookie state, so an employee created in the UI can be checked through OrangeHRM's API without duplicating login logic.

### 6. Cleanup made part of the lifecycle
The lifecycle test deletes the employee it creates, preventing orphaned records from accumulating.

### 7. Real negative RBAC path added
Admin access is validated directly. A restricted-user test is also provided and runs when `RESTRICTED_USERNAME` and `RESTRICTED_PASSWORD` are supplied.

### 8. Failure diagnostics use Playwright-native evidence
Trace, screenshot and video capture are configured in `playwright.config.ts`, which provides richer debugging than custom screenshot listeners alone.

### 9. Static-analysis quality gate added
CI fails early on TypeScript errors or ESLint violations before browser tests execute.

### 10. CI parallelization is genuine sharding
Each GitHub Actions matrix job receives a different Playwright shard, so jobs execute distinct portions of the test set instead of redundantly executing the same suite.

## Discussion points for client review

Be prepared to explain:

- Why Playwright fixtures are preferred over a Selenium DriverManager/BaseTest design
- How auto-waiting reduces flaky explicit waits
- Why locators are kept inside page objects
- How `page.request` enables UI + API verification in one authenticated context
- How cleanup prevents test-data pollution
- Difference between Playwright workers and CI sharding
- Why trace/video/screenshots are retained only on failure
- Why restricted-user credentials are externalized rather than hard-coded
- Why secrets should be stored in GitHub Actions Secrets for non-demo environments

## Note on demo environment

OrangeHRM's public demo is shared and can change. For a client-controlled environment, store credentials in secrets, use stable seeded test accounts, and execute destructive lifecycle tests against isolated test data.

OrangeHRM's public demo is shared and can change. For a client-controlled environment, store credentials in secrets, use stable seeded test accounts, and execute destructive lifecycle tests against isolated test data.
