import { test, expect } from '../support/fixtures';
import { TestCasesPage } from '../pages/TestCasesPage';

test.describe('UI Navigation', () => {

  test('Test Case 7: Verify Test Cases Page', async ({ page, homePage }) => {
    const testCasesPage = new TestCasesPage(page);

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await testCasesPage.navigateToTestCases();
    await testCasesPage.verifyTestCasesPageLoaded();
  });

  test("Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality", async ({ page }) => {
    // TODO: Implement test
  });

  test("Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down functionality", async ({ page }) => {
    // TODO: Implement test
  });

});