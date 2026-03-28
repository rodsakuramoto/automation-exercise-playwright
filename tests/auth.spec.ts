import { test, expect } from '../support/fixtures';
import { generateRandomUser } from '../support/helpers';

test.describe('Registration', () => {

  test('Test Case 1: Register User', async ({ page, homePage, loginPage, signupPage }) => {

    const newUser = generateRandomUser();

    await homePage.navigate();
    await homePage.clickSignupLogin();

    await loginPage.initiateSignup(newUser.firstName, newUser.email);

    await signupPage.fillAccountDetails(newUser.password);
    await signupPage.fillAddressDetails(
      newUser.firstName,
      newUser.lastName,
      newUser.company,
      newUser.address,
      newUser.state,
      newUser.city,
      newUser.zipcode,
      newUser.mobileNumber
    );
    await signupPage.submitAccount();

    await expect(page.getByText('Account Created!')).toBeVisible();
    await page.locator('[data-qa="continue-button"]').click();

    await expect(page.getByText(`Logged in as ${newUser.firstName}`)).toBeVisible();

    await homePage.clickDeleteAccount();
    await page.locator('[data-qa="continue-button"]').click();
  });

});

test.describe('Valid Login Scenarios', () => {

  test('Test Case 2: Login User with correct email and password', async ({ page, homePage, loginPage, registeredUser }) => {
    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.clickSignupLogin();
    await expect(page.getByText('Login to your account')).toBeVisible();

    await loginPage.login(registeredUser.email, registeredUser.password);

    await expect(page.getByText(`Logged in as ${registeredUser.firstName}`)).toBeVisible();

    await homePage.clickDeleteAccount();
    await expect(page.getByText('Account Deleted!')).toBeVisible();
    await page.locator('[data-qa="continue-button"]').click();
  });

  test('Test Case 4: Logout User', async ({ page, homePage, loginPage, registeredUser }) => {
    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.clickSignupLogin();
    await expect(page.getByText('Login to your account')).toBeVisible();

    await loginPage.login(registeredUser.email, registeredUser.password);

    await expect(page.getByText(`Logged in as ${registeredUser.firstName}`)).toBeVisible();

    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByText('Login to your account')).toBeVisible();
  });

  test('Test Case 5: Register User with existing email', async ({ page, homePage, loginPage, registeredUser }) => {
    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.clickSignupLogin();
    await expect(page.getByText('New User Signup!')).toBeVisible();

    await loginPage.initiateSignup(registeredUser.firstName, registeredUser.email);

    await expect(loginPage.signupErrorMessage).toBeVisible();
  });

});

test.describe('Invalid Login Scenarios', () => {

  test('Test Case 3: Login User with incorrect email and password', async ({ page, homePage, loginPage }) => {
    const invalidUser = generateRandomUser();

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.clickSignupLogin();
    await expect(page.getByText('Login to your account')).toBeVisible();

    await loginPage.login(invalidUser.email, 'WrongPassword123!');

    await expect(loginPage.loginErrorMessage).toBeVisible();
  });

});