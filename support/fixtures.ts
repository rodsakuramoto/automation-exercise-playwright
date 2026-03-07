import { test as baseTest } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';

type MyFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  blockAds: void;
};

export const test = baseTest.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  blockAds: [async ({ page }, use) => {
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (
        url.includes('googleads') ||
        url.includes('googlesyndication') ||
        url.includes('doubleclick') ||
        url.includes('adservice.google')
      ) {
        route.abort();
      } else {
        route.continue();
      }
    });
    await use();
  }, { auto: true }]
});

export { expect } from '@playwright/test';