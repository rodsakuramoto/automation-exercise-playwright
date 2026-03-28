import { test, expect } from '../support/fixtures';
import { generateRandomUser } from '../support/helpers';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { AccountPage } from '../pages/AccountPage';

test.describe('Checkout', () => {

  test('Test Case 14: Place Order: Register while Checkout', async ({ page, homePage, loginPage, signupPage }) => {
    test.setTimeout(60_000);

    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);
    const accountPage = new AccountPage(page);
    const user = generateRandomUser();

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await productsPage.hoverAndAddProduct(0);
    await productsPage.clickContinueShopping();
    await homePage.clickCart();

    await cartPage.verifyCartPageLoaded();
    await cartPage.proceedToCheckout();

    await cartPage.clickRegisterLoginModal();

    await loginPage.initiateSignup(user.firstName, user.email);
    await signupPage.fillAccountDetails(user.password);
    await signupPage.fillAddressDetails(user.firstName, user.lastName, user.company, user.address, user.state, user.city, user.zipcode, user.mobileNumber);
    await signupPage.submitAccount();

    await accountPage.verifyAccountCreated();
    await accountPage.clickContinue();

    await homePage.verifyLoggedInAs(user.firstName);
    await homePage.clickCart();

    await cartPage.proceedToCheckout();

    await checkoutPage.verifyAddressDetails();
    await checkoutPage.verifyReviewOrder();
    await checkoutPage.enterComment('Order placed via automation');
    await checkoutPage.clickPlaceOrder();

    await paymentPage.fillPaymentDetails('Test Card', '1234567890123456', '123', '01', '2030');
    await paymentPage.clickPayAndConfirm();
    await paymentPage.verifySuccessMessage();

    await homePage.clickDeleteAccount();
    await accountPage.verifyAccountDeleted();
    await accountPage.clickContinue();
  });

  test('Test Case 15: Place Order: Register before Checkout', async ({ page, homePage, loginPage, signupPage }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);
    const accountPage = new AccountPage(page);
    const user = generateRandomUser();

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.clickSignupLogin();
    await loginPage.initiateSignup(user.firstName, user.email);
    await signupPage.fillAccountDetails(user.password);
    await signupPage.fillAddressDetails(user.firstName, user.lastName, user.company, user.address, user.state, user.city, user.zipcode, user.mobileNumber);
    await signupPage.submitAccount();

    await accountPage.verifyAccountCreated();
    await accountPage.clickContinue();
    await homePage.verifyLoggedInAs(user.firstName);

    await productsPage.hoverAndAddProduct(0);
    await productsPage.clickContinueShopping();
    await homePage.clickCart();

    await cartPage.verifyCartPageLoaded();
    await cartPage.proceedToCheckout();

    await checkoutPage.verifyAddressDetails();
    await checkoutPage.verifyReviewOrder();
    await checkoutPage.enterComment('Order placed via automation');
    await checkoutPage.clickPlaceOrder();

    await paymentPage.fillPaymentDetails('Test Card', '1234567890123456', '123', '01', '2030');
    await paymentPage.clickPayAndConfirm();
    await paymentPage.verifySuccessMessage();

    await homePage.clickDeleteAccount();
    await accountPage.verifyAccountDeleted();
    await accountPage.clickContinue();
  });

  test('Test Case 16: Place Order: Login before Checkout', async ({ page, homePage, loginPage, registeredUser }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);
    const accountPage = new AccountPage(page);
    const user = registeredUser;

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);
    await homePage.clickSignupLogin();
    await loginPage.login(user.email, user.password);
    await homePage.verifyLoggedInAs(user.firstName);

    await productsPage.hoverAndAddProduct(0);
    await productsPage.clickContinueShopping();
    await homePage.clickCart();

    await cartPage.verifyCartPageLoaded();
    await cartPage.proceedToCheckout();

    await checkoutPage.verifyAddressDetails();
    await checkoutPage.verifyReviewOrder();
    await checkoutPage.enterComment('Order placed via automation');
    await checkoutPage.clickPlaceOrder();

    await paymentPage.fillPaymentDetails('Test Card', '1234567890123456', '123', '01', '2030');
    await paymentPage.clickPayAndConfirm();
    await paymentPage.verifySuccessMessage();

    await homePage.clickDeleteAccount();
    await accountPage.verifyAccountDeleted();
    await accountPage.clickContinue();
  });

  test('Test Case 23: Verify address details in checkout page', async ({ page, homePage, loginPage, signupPage }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const accountPage = new AccountPage(page);
    const user = generateRandomUser();

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.clickSignupLogin();
    await loginPage.initiateSignup(user.firstName, user.email);
    await signupPage.fillAccountDetails(user.password);
    await signupPage.fillAddressDetails(user.firstName, user.lastName, user.company, user.address, user.state, user.city, user.zipcode, user.mobileNumber);
    await signupPage.submitAccount();

    await accountPage.verifyAccountCreated();
    await accountPage.clickContinue();
    await homePage.verifyLoggedInAs(user.firstName);

    await productsPage.hoverAndAddProduct(0);
    await productsPage.clickContinueShopping();
    await homePage.clickCart();
    await cartPage.verifyCartPageLoaded();
    await cartPage.proceedToCheckout();

    await checkoutPage.verifyDeliveryAddress(user.firstName, user.lastName, user.address, user.city, user.state, user.zipcode, user.mobileNumber);
    await checkoutPage.verifyBillingAddress(user.firstName, user.lastName, user.address, user.city, user.state, user.zipcode, user.mobileNumber);

    await homePage.clickDeleteAccount();
    await accountPage.verifyAccountDeleted();
    await accountPage.clickContinue();
  });

  test('Test Case 24: Download Invoice after purchase order', async ({ page, homePage, loginPage, signupPage }) => {
    // Full checkout + signup + payment + download often runs 25–35s+; CI WebKit can hit the default 30s limit.
    test.setTimeout(60_000);

    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);
    const accountPage = new AccountPage(page);
    const user = generateRandomUser();

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await productsPage.hoverAndAddProduct(0);
    await productsPage.clickContinueShopping();
    await homePage.clickCart();
    await cartPage.verifyCartPageLoaded();
    await cartPage.proceedToCheckout();

    await cartPage.clickRegisterLoginModal();
    await loginPage.initiateSignup(user.firstName, user.email);
    await signupPage.fillAccountDetails(user.password);
    await signupPage.fillAddressDetails(user.firstName, user.lastName, user.company, user.address, user.state, user.city, user.zipcode, user.mobileNumber);
    await signupPage.submitAccount();

    await accountPage.verifyAccountCreated();
    await accountPage.clickContinue();
    await homePage.verifyLoggedInAs(user.firstName);

    await homePage.clickCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.verifyAddressDetails();
    await checkoutPage.verifyReviewOrder();
    await checkoutPage.enterComment('Order placed via automation');
    await checkoutPage.clickPlaceOrder();

    await paymentPage.fillPaymentDetails('Test Card', '1234567890123456', '123', '01', '2030');
    await paymentPage.clickPayAndConfirm();
    await paymentPage.verifySuccessMessage();

    // WebKit often does not emit page.waitForEvent('download') (inline PDF, new tab, or headers). Waiting for a
    // successful invoice response on the browser context covers download, navigation, and popup cases.
    await Promise.all([
      page.context().waitForEvent('response', {
        predicate: (response) =>
          /\/download_invoice\//i.test(response.url()) && response.ok(),
      }),
      paymentPage.clickDownloadInvoice(),
    ]);

    // WebKit may navigate the main tab to the invoice URL or open a PDF tab; restore the order page when needed.
    if (/\/download_invoice\//i.test(page.url())) {
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await paymentPage.verifySuccessMessage();
    }
    await Promise.all(
      page
        .context()
        .pages()
        .filter((p) => p !== page && /\/download_invoice\//i.test(p.url()))
        .map((p) => p.close())
    );

    await paymentPage.clickContinue();
    await homePage.clickDeleteAccount();
    await accountPage.verifyAccountDeleted();
    await accountPage.clickContinue();
  });

});