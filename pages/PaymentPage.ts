import { Page, Locator, expect } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expirationMonthInput: Locator;
  readonly expirationYearInput: Locator;
  readonly payButton: Locator;
  readonly successMessage: Locator;
  readonly downloadInvoiceButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expirationMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expirationYearInput = page.locator('[data-qa="expiry-year"]');
    this.payButton = page.locator('[data-qa="pay-button"]');
    this.successMessage = page.getByText('Congratulations! Your order has been confirmed!', { exact: true });
    this.downloadInvoiceButton = page.getByRole('link', { name: 'Download Invoice' });
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  async fillPaymentDetails(name: string, number: string, cvc: string, month: string, year: string) {
    await this.nameOnCardInput.fill(name);
    await this.cardNumberInput.fill(number);
    await this.cvcInput.fill(cvc);
    await this.expirationMonthInput.fill(month);
    await this.expirationYearInput.fill(year);
  }

  async clickPayAndConfirm() {
    await this.payButton.click();
  }

  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  async clickDownloadInvoice() {
    await this.page.waitForTimeout(1000);
    await this.downloadInvoiceButton.click();
  }

  async clickContinue() {
    await this.continueButton.click();
  }
}