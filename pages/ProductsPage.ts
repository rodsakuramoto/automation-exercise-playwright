import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productsLink: Locator;
  readonly allProductsHeading: Locator;
  readonly productsList: Locator;
  readonly viewFirstProductButton: Locator;
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly categoriesSidebar: Locator;
  readonly brandsSidebar: Locator;
  readonly categoryTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.allProductsHeading = page.getByRole('heading', { name: 'All Products' });
    this.productsList = page.locator('.features_items');
    this.viewFirstProductButton = page.locator('.choose a').first();
    this.productName = page.locator('.product-information h2');
    this.productCategory = page.getByText('Category:');
    this.productPrice = page.getByText('Rs.');
    this.productAvailability = page.getByText('Availability:');
    this.productCondition = page.getByText('Condition:');
    this.productBrand = page.getByText('Brand:');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.categoriesSidebar = page.locator('#accordian');
    this.brandsSidebar = page.locator('.brands_products');
    this.categoryTitle = page.locator('.features_items .title');
  }

  async navigateToProducts() {
    await this.productsLink.click();
  }

  async verifyAllProductsPageLoaded() {
    await expect(this.page).toHaveURL(/.*products/);
    await expect(this.allProductsHeading).toBeVisible();
    await expect(this.productsList).toBeVisible();
  }

  async viewFirstProduct() {
    await this.viewFirstProductButton.click();
  }

  async verifyProductDetailsVisible() {
    await expect(this.productName).toBeVisible();
    await expect(this.productCategory).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productAvailability).toBeVisible();
    await expect(this.productCondition).toBeVisible();
    await expect(this.productBrand).toBeVisible();
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async verifySearchedProductsVisible() {
    await expect(this.searchedProductsHeading).toBeVisible();
    await expect(this.productsList).toBeVisible();
  }

  async hoverAndAddProduct(index: number) {
    const productCard = this.productsList.locator('.col-sm-4').nth(index);
    await productCard.hover();
    await productCard.locator('.product-overlay .add-to-cart').click();
  }

  async clickContinueShopping() {
    await this.continueShoppingButton.click();
  }

  async clickViewCart() {
    await this.viewCartLink.click();
  }

  async setQuantity(quantity: string) {
    await this.quantityInput.fill(quantity);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async verifyCategoriesSidebarVisible() {
    await expect(this.categoriesSidebar).toBeVisible();
  }

  async clickCategory(category: string) {
    await this.categoriesSidebar.getByText(category, { exact: true }).click();
  }

  async clickSubCategory(subCategory: string) {
    await this.categoriesSidebar.getByRole('link', { name: subCategory }).click();
  }

  async verifyCategoryTitle(title: string) {
    await expect(this.categoryTitle).toHaveText(title, { ignoreCase: true });
  }

  async verifyBrandsSidebarVisible() {
    await expect(this.brandsSidebar).toBeVisible();
  }

  async clickBrand(brandName: string) {
    await this.brandsSidebar.getByRole('link', { name: brandName }).click();
  }

  async addAllVisibleProductsToCart() {
    const count = await this.productsList.locator('.col-sm-4').count();
    for (let i = 0; i < count; i++) {
      await this.hoverAndAddProduct(i);
      await this.clickContinueShopping();
    }
  }
}