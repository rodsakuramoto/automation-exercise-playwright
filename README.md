# Automation Exercise - Playwright TypeScript

This project contains automated test scripts for [Automation Exercise](http://automationexercise.com) using [Playwright](https://playwright.dev/) with TypeScript. The project follows the Page Object Model (POM) design pattern to ensure maintainability and scalability.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   npm (Node Package Manager)

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

## Running Tests

### Run all tests

```bash
npx playwright test
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

## Implemented Test Cases

The following test cases from Automation Exercise have been implemented:

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