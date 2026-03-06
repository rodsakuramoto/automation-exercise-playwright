import { Page, Locator, expect } from '@playwright/test';

export class TestCasesPage {
  readonly page: Page;
  readonly testCasesLink: Locator;
  readonly heading: Locator;
  readonly pageDescription: Locator;
  readonly testCasesList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.testCasesLink = page.getByRole('link', { name: ' Test Cases' });
    this.heading = page.getByRole('heading', { name: 'Test Cases', exact: true });
    this.pageDescription = page.getByText('Below is the list of test Cases for you to practice the Automation');
    this.testCasesList = page.getByText('Test Cases Below is the list')
  }

  async navigateToTestCases() {
    await this.testCasesLink.click();
  }

  async verifyTestCasesPageLoaded() {
    await expect(this.page).toHaveURL(/.*test_cases/);
    await expect(this.heading).toBeVisible();
    await expect(this.pageDescription).toBeVisible();
    await expect(this.testCasesList).toBeVisible();
  }
}