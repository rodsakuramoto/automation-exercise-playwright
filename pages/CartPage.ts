import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartTable: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly registerLoginModalLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTable = page.locator('#cart_info_table');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
    this.registerLoginModalLink = page.getByRole('link', { name: 'Register / Login' });
  }

  async verifyCartPageLoaded() {
    await expect(this.page).toHaveURL(/.*view_cart/);
    await expect(this.cartTable).toBeVisible();
  }

  async verifyProductInCart(productName: string, price: string, quantity: string, total: string) {
    const row = this.page.locator('tr', { hasText: productName });
    await expect(row).toBeVisible();
    await expect(row.locator('.cart_price')).toHaveText(price);
    await expect(row.locator('.cart_quantity button')).toHaveText(quantity);
    await expect(row.locator('.cart_total')).toHaveText(total);
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async clickRegisterLoginModal() {
    await this.registerLoginModalLink.click();
  }

  async removeProduct(productName: string) {
    const row = this.page.locator('tr', { hasText: productName });
    await row.locator('.cart_quantity_delete').click();
  }

  async verifyProductRemoved(productName: string) {
    const row = this.page.locator('tr', { hasText: productName });
    await expect(row).toBeHidden();
  }
}