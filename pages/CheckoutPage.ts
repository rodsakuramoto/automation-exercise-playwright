import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly addressDetails: Locator;
  readonly reviewOrder: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addressDetails = page.locator('#address_delivery');
    this.reviewOrder = page.locator('#cart_info');
    this.commentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
  }

  async verifyAddressDetails() {
    await expect(this.addressDetails).toBeVisible();
  }

  async verifyReviewOrder() {
    await expect(this.reviewOrder).toBeVisible();
  }

  async enterComment(comment: string) {
    await this.commentTextarea.fill(comment);
  }

  async clickPlaceOrder() {
    await this.placeOrderButton.click();
  }
}