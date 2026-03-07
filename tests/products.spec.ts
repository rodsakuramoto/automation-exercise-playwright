import { test, expect } from '../support/fixtures';
import { ProductsPage } from '../pages/ProductsPage';
import { generateRandomUser } from '../support/helpers';

test.describe('Products', () => {

  test('Test Case 8: Verify All Products and product detail page', async ({ page, homePage }) => {
    const productsPage = new ProductsPage(page);

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await productsPage.navigateToProducts();
    await productsPage.verifyAllProductsPageLoaded();

    await productsPage.viewFirstProduct();

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

  test('Test Case 18: View Category Products', async ({ page, homePage }) => {
    const productsPage = new ProductsPage(page);

    await homePage.navigate();
    await productsPage.verifyCategoriesSidebarVisible();

    await productsPage.clickCategory('Women');
    await productsPage.clickSubCategory('Dress');
    await productsPage.verifyCategoryTitle('WOMEN - DRESS PRODUCTS');

    await productsPage.clickCategory('Men');
    await productsPage.clickSubCategory('Tshirts');
    await productsPage.verifyCategoryTitle('MEN - TSHIRTS PRODUCTS');
  });

  test('Test Case 19: View & Cart Brand Products', async ({ page, homePage }) => {
    const productsPage = new ProductsPage(page);

    await homePage.navigate();
    await productsPage.navigateToProducts();
    await productsPage.verifyBrandsSidebarVisible();

    await productsPage.clickBrand('Polo');
    await productsPage.verifyCategoryTitle('BRAND - POLO PRODUCTS');

    await productsPage.clickBrand('H&M');
    await productsPage.verifyCategoryTitle('BRAND - H&M PRODUCTS');
  });

  test('Test Case 21: Add review on product', async ({ page, homePage }) => {
    const productsPage = new ProductsPage(page);
    const user = generateRandomUser();

    await homePage.navigate();
    await productsPage.navigateToProducts();
    await productsPage.verifyAllProductsPageLoaded();

    await productsPage.viewFirstProduct();
    await productsPage.verifyReviewSectionVisible();

    await productsPage.submitReview(user.firstName, user.email, 'This is a test review for automation.');
    await productsPage.verifyReviewSuccessMessage();
  });

});