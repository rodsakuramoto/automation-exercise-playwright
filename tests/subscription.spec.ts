import { test } from '../support/fixtures';
import { SubscriptionPage } from '../pages/SubscriptionPage';

test.describe('Subscription', () => {

  test('Test Case 10: Verify Subscription in home page', async ({ page, homePage }) => {
    const subscriptionPage = new SubscriptionPage(page);

    await homePage.navigate();

    await subscriptionPage.verifySubscriptionVisible();
    await subscriptionPage.subscribe(subscriptionPage.testEmail);
    await subscriptionPage.verifySuccessMessageVisible();
  });

  test('Test Case 11: Verify Subscription in Cart page', async ({ page, homePage }) => {
    const subscriptionPage = new SubscriptionPage(page);

    await homePage.navigate();

    await subscriptionPage.navigateToCart();

    await subscriptionPage.verifySubscriptionVisible();
    await subscriptionPage.subscribe(subscriptionPage.testEmail);
    await subscriptionPage.verifySuccessMessageVisible();
  });

});