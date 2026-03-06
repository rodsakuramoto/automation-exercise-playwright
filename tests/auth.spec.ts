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

    await page.getByRole('link', { name: 'Delete Account' }).click();
    await page.locator('[data-qa="continue-button"]').click();
  });

});

test.describe('Valid Login Scenarios', () => {

  let validUser: ReturnType<typeof generateRandomUser>;

  // SETUP: Create user for this group
  test.beforeEach(async ({ page, homePage, loginPage, signupPage }) => {
    validUser = generateRandomUser();

    await homePage.navigate();
    await homePage.clickSignupLogin();

    await loginPage.initiateSignup(validUser.firstName, validUser.email);
    await signupPage.fillAccountDetails(validUser.password);
    await signupPage.fillAddressDetails(
      validUser.firstName, validUser.lastName, validUser.company,
      validUser.address, validUser.state, validUser.city,
      validUser.zipcode, validUser.mobileNumber
    );
    await signupPage.submitAccount();

    await expect(page.getByText('Account Created!')).toBeVisible();
    await page.locator('[data-qa="continue-button"]').click();

    await expect(page.getByText(`Logged in as ${validUser.firstName}`)).toBeVisible();

    await page.getByRole('link', { name: 'Logout' }).click();
  });

  test('Test Case 2: Login User with correct email and password', async ({ page, homePage, loginPage }) => {
    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.clickSignupLogin();
    await expect(page.getByText('Login to your account')).toBeVisible();

    await loginPage.login(validUser.email, validUser.password);

    await expect(page.getByText(`Logged in as ${validUser.firstName}`)).toBeVisible();

    await page.getByRole('link', { name: ' Delete Account' }).click();
    await expect(page.getByText('Account Deleted!')).toBeVisible();
    await page.locator('[data-qa="continue-button"]').click();
  });

  test('Test Case 4: Logout User', async ({ page, homePage, loginPage }) => {
    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.clickSignupLogin();
    await expect(page.getByText('Login to your account')).toBeVisible();

    await loginPage.login(validUser.email, validUser.password);

    await expect(page.getByText(`Logged in as ${validUser.firstName}`)).toBeVisible();

    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByText('Login to your account')).toBeVisible();
  });

  test('Test Case 5: Register User with existing email', async ({ page, homePage, loginPage }) => {
    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await homePage.clickSignupLogin();
    await expect(page.getByText('New User Signup!')).toBeVisible();

    await loginPage.initiateSignup(validUser.firstName, validUser.email);

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