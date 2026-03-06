import { test, expect } from '../support/fixtures';
import { TestCasesPage } from '../pages/TestCasesPage';
import { SubscriptionPage } from '../pages/SubscriptionPage';

test.describe('UI Navigation', () => {

  test('Test Case 7: Verify Test Cases Page', async ({ page, homePage }) => {
    const testCasesPage = new TestCasesPage(page);

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await testCasesPage.navigateToTestCases();
    await testCasesPage.verifyTestCasesPageLoaded();
  });

  test("Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality", async ({ page, homePage }) => {
    const subscriptionPage = new SubscriptionPage(page);

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.scrollToBottom();
    await subscriptionPage.verifySubscriptionVisible();

    await homePage.clickScrollUpButton();
    await homePage.verifyFullFledgedTextVisible();
  });

  test("Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down functionality", async ({ page, homePage }) => {
    const subscriptionPage = new SubscriptionPage(page);

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.scrollToBottom();
    await subscriptionPage.verifySubscriptionVisible();

    await homePage.scrollToTop();
    await homePage.verifyFullFledgedTextVisible();
  });

});