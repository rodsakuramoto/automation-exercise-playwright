import { test as baseTest } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';

// 1. Declaramos os tipos das nossas Fixtures
type MyFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
};

// 2. Estendemos o teste base do Playwright ensinando ele a criar as páginas
export const test = baseTest.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    // Instancia a página e entrega (usa) no teste
    await use(new HomePage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  }
});

// Exportamos o expect para usarmos no arquivo de teste
export { expect } from '@playwright/test';