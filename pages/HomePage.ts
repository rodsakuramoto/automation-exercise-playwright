import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signupLoginLink: Locator;
  readonly viewProductButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    // Mapeamento dos elementos
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.viewProductButtons = page.locator('.choose a');
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
}