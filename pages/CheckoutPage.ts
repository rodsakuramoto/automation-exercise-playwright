import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly addressDetails: Locator;
  readonly reviewOrder: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderButton: Locator;
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addressDetails = page.locator('#address_delivery');
    this.reviewOrder = page.locator('#cart_info');
    this.commentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    this.deliveryAddress = page.locator('#address_delivery');
    this.billingAddress = page.locator('#address_invoice');
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

  async verifyDeliveryAddress(firstName: string, lastName: string, address: string, city: string, state: string, zipcode: string, mobile: string) {
    await expect(this.deliveryAddress).toContainText(firstName);
    await expect(this.deliveryAddress).toContainText(lastName);
    await expect(this.deliveryAddress).toContainText(address);
    await expect(this.deliveryAddress).toContainText(city);
    await expect(this.deliveryAddress).toContainText(state);
    await expect(this.deliveryAddress).toContainText(zipcode);
    await expect(this.deliveryAddress).toContainText(mobile);
  }

  async verifyBillingAddress(firstName: string, lastName: string, address: string, city: string, state: string, zipcode: string, mobile: string) {
    await expect(this.billingAddress).toContainText(firstName);
    await expect(this.billingAddress).toContainText(lastName);
    await expect(this.billingAddress).toContainText(address);
    await expect(this.billingAddress).toContainText(city);
    await expect(this.billingAddress).toContainText(state);
    await expect(this.billingAddress).toContainText(zipcode);
    await expect(this.billingAddress).toContainText(mobile);
  }
}