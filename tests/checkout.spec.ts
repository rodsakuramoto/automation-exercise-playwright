import { test, expect } from '../support/fixtures';
import { generateRandomUser } from '../support/helpers';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { AccountPage } from '../pages/AccountPage';

test.describe('Checkout', () => {

  test('Test Case 14: Place Order: Register while Checkout', async ({ page, homePage, loginPage, signupPage }) => {
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

  test('Test Case 16: Place Order: Login before Checkout', async ({ page, homePage, loginPage, signupPage }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);
    const accountPage = new AccountPage(page);
    const user = generateRandomUser();

    // Pre-requisite: Create a user to login with
    await homePage.navigate();
    await homePage.clickSignupLogin();
    await loginPage.initiateSignup(user.firstName, user.email);
    await signupPage.fillAccountDetails(user.password);
    await signupPage.fillAddressDetails(user.firstName, user.lastName, user.company, user.address, user.state, user.city, user.zipcode, user.mobileNumber);
    await signupPage.submitAccount();
    await accountPage.clickContinue();
    await homePage.clickLogout();

    // Actual Test Steps
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

    const downloadPromise = page.waitForEvent('download');
    await page.waitForTimeout(1000);
    await paymentPage.clickDownloadInvoice();
    const download = await downloadPromise;
    await download.path(); // Wait for download to complete

    await paymentPage.clickContinue();
    await homePage.clickDeleteAccount();
    await accountPage.verifyAccountDeleted();
    await accountPage.clickContinue();
  });

});