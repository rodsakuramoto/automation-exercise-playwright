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
}