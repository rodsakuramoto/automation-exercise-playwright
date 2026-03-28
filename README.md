# Automation Exercise - Playwright TypeScript

This project contains automated test scripts for [Automation Exercise](https://automationexercise.com) using [Playwright](https://playwright.dev/) with TypeScript. The project follows the Page Object Model (POM) design pattern to keep selectors and navigation logic out of specs and easier to maintain.

## Prerequisites

-   [Node.js](https://nodejs.org/) (LTS recommended; matches CI)
-   npm (comes with Node.js)

## Installation

1.  Navigate to the project directory.
2.  Install the dependencies:

    ```bash
    npm install
    ```

3.  Install Playwright browsers:

    ```bash
    npx playwright install
    ```

## Project Structure

-   **`pages/`**: Contains Page Object classes representing different pages of the application (e.g., `HomePage`, `ProductsPage`, `CartPage`).
-   **`tests/`**: Contains the test specifications (`.spec.ts` files).
-   **`support/`**: Contains custom fixtures and helper functions.
-   **`.github/workflows/`**: CI definitions (Playwright workflow).
-   **`scripts/`**: Helper scripts used by CI (e.g. GitHub job summaries from JSON reports).

## Running Tests

### Run all tests

Runs every spec against **Chromium, Firefox, and WebKit** (see `playwright.config.ts` projects).

```bash
npx playwright test
```

### Parallel execution

Playwright is configured for parallel runs at two levels:

-   **Within a run:** `fullyParallel` is enabled, and **workers** control how many tests run at once. Locally the config uses **4 workers** to limit load on automationexercise.com (the site can show a “queue full” page under heavy traffic). On **CI** (`CI=true`), workers are set to **100%** of available CPUs so the job finishes sooner on GitHub-hosted runners.
-   **Across browsers:** Each project (chromium, firefox, webkit) is a separate browser target; `npx playwright test` runs all of them unless you narrow with `--project`.

Useful flags:

```bash
# Single browser
npx playwright test --project=chromium

# Control worker count explicitly (overrides config for this run)
npx playwright test --workers=2

# Disable parallelism (debugging)
npx playwright test --workers=1
```

### Run tests in UI mode (interactive)

```bash
npx playwright test --ui
```

### Run tests in headed mode (visible browser)

```bash
npx playwright test --headed
```

### Run a specific test file

```bash
npx playwright test tests/products.spec.ts
```

### View the HTML Test Report

```bash
npx playwright show-report
```

## GitHub Actions

The workflow [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs on **push** and **pull_request** to `main` and `master`.

-   **Matrix:** Jobs are split by **browser** (chromium, firefox, webkit) and **spec file** (e.g. `auth.spec.ts`, `cart.spec.ts`). Each cell runs `npx playwright test "<path>" --project=<browser>`, so many jobs run **in parallel** at the GitHub Actions level, in addition to Playwright’s own workers inside each job.
-   **Retries:** On CI, failed tests are retried (see `retries` in `playwright.config.ts`). `test.only` is forbidden when `CI` is set.
-   **Reporters:** On CI the config uses HTML, GitHub (annotations in the run UI), and JSON written to `test-results/report.json`.
-   **Artifacts:** Each matrix job uploads intermediate HTML and JSON reports. A follow-up **bundle** job per browser merges those into a single artifact (`playwright-chromium`, `playwright-firefox`, `playwright-webkit`) for easier download. Intermediate artifacts use a short retention; bundles are kept longer (see the workflow for `retention-days`).
-   **Re-running failures:** In the Actions run summary you can use “Re-run failed jobs” to retry only failed matrix cells.

**Adding a new spec file:** Extend the workflow `matrix.suite` list with a new `path` and `name` entry so CI runs the file across all browsers.

## Configuration highlights

| Setting | Local | CI (`CI=true`) |
|--------|-------|----------------|
| Workers | 4 | 100% of CPUs |
| Retries | 0 | 2 |
| `forbidOnly` | off | on |

Traces are collected **on first retry** (`trace: 'on-first-retry'`), which helps debug flakes without storing traces for every test.

## Implemented Test Cases

Specs live under `tests/`. The following Automation Exercise scenarios are covered (grouped by area):

### Authentication & account

Registration, login, and related flows are in `tests/auth.spec.ts` (e.g. Test Cases 1–5 as named in that file).

### Products
-   **Test Case 8:** Verify All Products and product detail page
-   **Test Case 9:** Search Product
-   **Test Case 18:** View Category Products
-   **Test Case 19:** View & Cart Brand Products
-   **Test Case 21:** Add review on product

### Cart
-   **Test Case 12:** Add Products in Cart
-   **Test Case 13:** Verify Product quantity in Cart
-   **Test Case 17:** Remove Products From Cart
-   **Test Case 20:** Search Products and Verify Cart After Login
-   **Test Case 22:** Add to cart from Recommended items

### Checkout
-   **Test Case 14:** Place Order: Register while Checkout
-   **Test Case 15:** Place Order: Register before Checkout
-   **Test Case 16:** Place Order: Login before Checkout
-   **Test Case 23:** Verify address details in checkout page
-   **Test Case 24:** Download Invoice after purchase order

### UI Navigation
-   **Test Case 7:** Verify Test Cases Page
-   **Test Case 25:** Verify Scroll Up using 'Arrow' button and Scroll Down functionality
-   **Test Case 26:** Verify Scroll Up without 'Arrow' button and Scroll Down functionality