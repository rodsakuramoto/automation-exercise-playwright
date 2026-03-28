import { Page, Locator, expect } from '@playwright/test';
import { escapeRegExp } from '../support/helpers';

export class HomePage {
  readonly page: Page;
  readonly signupLoginLink: Locator;
  readonly viewProductButtons: Locator;
  readonly cartLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly logoutLink: Locator;
  readonly recommendedItemsHeading: Locator;
  readonly firstRecommendedAddToCartButton: Locator;
  readonly scrollUpButton: Locator;
  readonly fullFledgedText: Locator;

  constructor(page: Page) {
    this.page = page;
    // Mapeamento dos elementos
    // Prefer href / regex: nav links embed Font Awesome glyphs in the accessible name, which varies by browser/OS.
    this.signupLoginLink = page.locator('.navbar-nav a[href*="/login"]').first();
    this.viewProductButtons = page.locator('.choose a');
    this.cartLink = page.locator('.navbar-nav a[href*="view_cart"]').first();
    this.deleteAccountLink = page.getByRole('link', { name: /Delete Account/ });
    this.logoutLink = page.locator('.navbar-nav a[href*="logout"]').first();
    this.recommendedItemsHeading = page.getByRole('heading', { name: 'recommended items' });
    this.firstRecommendedAddToCartButton = page.locator('.recommended_items .add-to-cart').first();
    this.scrollUpButton = page.locator('#scrollUp');
    this.fullFledgedText = page.getByRole('heading', { name: 'Full-Fledged practice website' });
  }

  // Ações (Steps)
  async navigate() {
    await this.page.goto('https://automationexercise.com/', {
      waitUntil: 'load',
      timeout: 60_000,
    });
    // CI and slow networks sometimes leave the title empty until the document settles.
    await expect(this.page).toHaveTitle(/Automation Exercise/, { timeout: 45_000 });
    await expect(this.page.locator('#header, header').first()).toBeVisible({ timeout: 30_000 });
  }

  async clickSignupLogin() {
    await expect(this.signupLoginLink).toBeVisible({ timeout: 45_000 });
    await this.signupLoginLink.scrollIntoViewIfNeeded();
    await this.signupLoginLink.click();
  }

  async viewFirstProduct() {
    const first = this.viewProductButtons.first();
    await expect(first).toBeVisible({ timeout: 45_000 });
    await first.scrollIntoViewIfNeeded();
    await first.click();
  }

  async clickCart() {
    await expect(this.cartLink).toBeVisible({ timeout: 45_000 });
    await this.cartLink.scrollIntoViewIfNeeded();
    await this.cartLink.click();
  }

  async clickDeleteAccount() {
    await this.deleteAccountLink.click();
  }

  async clickLogout() {
    await expect(this.logoutLink).toBeVisible({ timeout: 45_000 });
    await this.logoutLink.scrollIntoViewIfNeeded();
    await this.logoutLink.click();
  }

  async verifyLoggedInAs(username: string) {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(
      this.page.getByText(new RegExp(`Logged in as\\s+${escapeRegExp(username)}`, 'i'))
    ).toBeVisible({ timeout: 45_000 });
  }

  async verifyRecommendedItemsVisible() {
    await this.recommendedItemsHeading.scrollIntoViewIfNeeded();
    await expect(this.recommendedItemsHeading).toBeVisible();
  }

  async addRecommendedProductToCart() {
    await this.firstRecommendedAddToCartButton.click();
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async clickScrollUpButton() {
    await this.scrollUpButton.click();
  }

  async verifyFullFledgedTextVisible() {
    await expect(this.fullFledgedText).toBeVisible();
  }
}