import { test, expect } from '../support/fixtures';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { AccountPage } from '../pages/AccountPage';
import { generateRandomUser } from '../support/helpers';

test.describe('Cart', () => {

  test('Test Case 12: Add Products in Cart', async ({ page, homePage }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await productsPage.navigateToProducts();

    // Hover and add first product
    await productsPage.hoverAndAddProduct(0);
    await productsPage.clickContinueShopping();

    // Hover and add second product
    await productsPage.hoverAndAddProduct(1);
    await productsPage.clickViewCart();

    await cartPage.verifyCartPageLoaded();
    // Verifying first two products (Standard demo data: Blue Top & Men Tshirt)
    await cartPage.verifyProductInCart('Blue Top', 'Rs. 500', '1', 'Rs. 500');
    await cartPage.verifyProductInCart('Men Tshirt', 'Rs. 400', '1', 'Rs. 400');
  });

  test('Test Case 13: Verify Product quantity in Cart', async ({ page, homePage }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.viewFirstProduct();

    await productsPage.setQuantity('4');
    await productsPage.addToCart();
    await productsPage.clickViewCart();

    await cartPage.verifyCartPageLoaded();
    await cartPage.verifyProductInCart('Blue Top', 'Rs. 500', '4', 'Rs. 2000');
  });

  test('Test Case 17: Remove Products From Cart', async ({ page, homePage }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await productsPage.hoverAndAddProduct(0);
    await productsPage.clickContinueShopping();

    await homePage.clickCart();
    await cartPage.verifyCartPageLoaded();

    await cartPage.removeProduct('Blue Top');
    await cartPage.verifyProductRemoved('Blue Top');
  });

  test('Test Case 20: Search Products and Verify Cart After Login', async ({ page, homePage, loginPage, signupPage }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const accountPage = new AccountPage(page);
    const user = generateRandomUser();

    // Pre-requisite: Create a user to login with later
    await homePage.navigate();
    await homePage.clickSignupLogin();
    await loginPage.initiateSignup(user.firstName, user.email);
    await signupPage.fillAccountDetails(user.password);
    await signupPage.fillAddressDetails(user.firstName, user.lastName, user.company, user.address, user.state, user.city, user.zipcode, user.mobileNumber);
    await signupPage.submitAccount();
    await accountPage.clickContinue();
    await homePage.clickLogout();

    // Test Steps
    await homePage.navigate();
    await productsPage.navigateToProducts();
    await productsPage.verifyAllProductsPageLoaded();

    await productsPage.searchProduct('Jeans');
    await productsPage.verifySearchedProductsVisible();

    await productsPage.addAllVisibleProductsToCart();

    await homePage.clickCart();
    await cartPage.verifyProductInCart('Soft Stretch Jeans', 'Rs. 799', '1', 'Rs. 799');

    await homePage.clickSignupLogin();
    await loginPage.login(user.email, user.password);

    await homePage.clickCart();
    await cartPage.verifyProductInCart('Soft Stretch Jeans', 'Rs. 799', '1', 'Rs. 799');
  });

  test('Test Case 22: Add to cart from Recommended items', async ({ page, homePage }) => {
    const cartPage = new CartPage(page);
    const productsPage = new ProductsPage(page);

    await homePage.navigate();
    await homePage.verifyRecommendedItemsVisible();
    await homePage.addRecommendedProductToCart();
    await productsPage.clickViewCart();
    await cartPage.verifyProductInCart('Blue Top', 'Rs. 500', '1', 'Rs. 500');
  });

});