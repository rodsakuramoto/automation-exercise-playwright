import { test, expect } from '../support/fixtures';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

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
    await expect(page).toHaveURL(/.*product_details/);

    await productsPage.setQuantity('4');
    await productsPage.addToCart();
    await productsPage.clickViewCart();

    await cartPage.verifyCartPageLoaded();
    await cartPage.verifyProductInCart('Blue Top', 'Rs. 500', '4', 'Rs. 2000');
  });

  test('Test Case 17: Remove Products From Cart', async ({ page }) => {
    // TODO: Implement test
  });

  test('Test Case 20: Search Products and Verify Cart After Login', async ({ page }) => {
    // TODO: Implement test
  });

  test('Test Case 22: Add to cart from Recommended items', async ({ page }) => {
    // TODO: Implement test
  });

});