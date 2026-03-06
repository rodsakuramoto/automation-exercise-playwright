import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signupLoginLink: Locator;
  readonly viewProductButtons: Locator;
  readonly cartLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Mapeamento dos elementos
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.viewProductButtons = page.locator('.choose a');
    this.cartLink = page.getByRole('link', { name: ' Cart', exact: true });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  // Ações (Steps)
  async navigate() {
    await this.page.goto('https://automationexercise.com/');
  }

  async clickSignupLogin() {
    await this.signupLoginLink.click();
  }

  async viewFirstProduct() {
    await this.viewProductButtons.first().click();
  }

  async clickCart() {
    await this.cartLink.click();
  }

  async clickDeleteAccount() {
    await this.deleteAccountLink.click();
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async verifyLoggedInAs(username: string) {
    await expect(this.page.getByText(`Logged in as ${username}`)).toBeVisible();
  }
}