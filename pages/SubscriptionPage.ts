import { Page, Locator, expect } from '@playwright/test';

export class SubscriptionPage {
  readonly page: Page;
  readonly subscriptionHeading: Locator;
  readonly emailInput: Locator;
  readonly subscribeButton: Locator;
  readonly successMessage: Locator;
  readonly cartLink: Locator;
  readonly testEmail: string;

  constructor(page: Page) {
    this.page = page;
    this.subscriptionHeading = page.getByRole('heading', { name: 'Subscription' });
    this.emailInput = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.successMessage = page.getByText('You have been successfully subscribed!');
    this.cartLink = page.locator('.navbar-nav a[href*="view_cart"]').first();
    this.testEmail = 'test_sub@example.com';
  }

  async verifySubscriptionVisible() {
    await this.subscriptionHeading.scrollIntoViewIfNeeded();
    await expect(this.subscriptionHeading).toBeVisible();
  }

  async subscribe(email: string) {
    await this.emailInput.fill(email);
    await this.subscribeButton.click();
  }

  async verifySuccessMessageVisible() {
    await expect(this.successMessage).toBeVisible();
  }

  async navigateToCart() {
    await this.cartLink.click();
  }
}