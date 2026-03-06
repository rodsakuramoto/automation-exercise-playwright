import { test, expect } from '../support/fixtures';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Products', () => {

  test('Test Case 8: Verify All Products and product detail page', async ({ page, homePage }) => {
    const productsPage = new ProductsPage(page);

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await productsPage.navigateToProducts();
    await productsPage.verifyAllProductsPageLoaded();

    await productsPage.viewFirstProduct();
    await expect(page).toHaveURL(/.*product_details/);

    await productsPage.verifyProductDetailsVisible();
  });

  test('Test Case 9: Search Product', async ({ page, homePage }) => {
    const productsPage = new ProductsPage(page);

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await productsPage.navigateToProducts();
    await productsPage.verifyAllProductsPageLoaded();

    await productsPage.searchProduct('Tshirt');
    await productsPage.verifySearchedProductsVisible();
  });

  test('Test Case 18: View Category Products', async ({ page }) => {
    // TODO: Implement test
  });

  test('Test Case 19: View & Cart Brand Products', async ({ page }) => {
    // TODO: Implement test
  });

  test('Test Case 21: Add review on product', async ({ page }) => {
    // TODO: Implement test
  });

});