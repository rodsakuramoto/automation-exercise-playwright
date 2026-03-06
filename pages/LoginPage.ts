import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Locators do Signup (Cadastro)
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;

  // Locators do Login
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;

  // NOVO: Locator da mensagem de erro
  readonly loginErrorMessage: Locator;
  readonly signupErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Mapeamento Signup
    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');

    // Mapeamento Login
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');

    // Mapeando a mensagem de erro exata
    this.loginErrorMessage = page.getByText('Your email or password is incorrect!');
    this.signupErrorMessage = page.getByText('Email Address already exist!');
  }

  // Ações Signup
  async initiateSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  // Ações Login
  async login(email: string, password: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }
}