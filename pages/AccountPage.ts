import { Page, Locator, expect } from '@playwright/test';

export class AccountPage {
  readonly page: Page;
  readonly accountCreatedHeading: Locator;
  readonly accountDeletedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountCreatedHeading = page.getByText('Account Created!');
    this.accountDeletedHeading = page.getByText('Account Deleted!');
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async verifyAccountCreated() {
    await expect(this.accountCreatedHeading).toBeVisible();
  }

  async verifyAccountDeleted() {
    await expect(this.accountDeletedHeading).toBeVisible();
  }

  async clickContinue() {
    await this.continueButton.scrollIntoViewIfNeeded();
    await this.continueButton.click({ force: true });
  }
}