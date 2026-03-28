import { test as baseTest, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { generateRandomUser, escapeRegExp, type TestUser } from './helpers';

type MyFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  /** User registered on the site and then logged out (for login / existing-email flows). */
  registeredUser: TestUser;
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

  registeredUser: async ({ page, homePage, loginPage, signupPage }, use) => {
    const user = generateRandomUser();

    await homePage.navigate();
    await homePage.clickSignupLogin();
    await loginPage.initiateSignup(user.firstName, user.email);
    await signupPage.fillAccountDetails(user.password);
    await signupPage.fillAddressDetails(
      user.firstName,
      user.lastName,
      user.company,
      user.address,
      user.state,
      user.city,
      user.zipcode,
      user.mobileNumber
    );
    await signupPage.submitAccount();

    await expect(page.getByText('Account Created!')).toBeVisible();
    await page.locator('[data-qa="continue-button"]').click();
    await page.waitForLoadState('load');
    await expect(
      page.getByText(new RegExp(`Logged in as\\s+${escapeRegExp(user.firstName)}`, 'i'))
    ).toBeVisible({ timeout: 45_000 });
    await Promise.all([
      page.waitForURL(/login/i, { timeout: 45_000 }),
      homePage.clickLogout(),
    ]);

    await use(user);
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