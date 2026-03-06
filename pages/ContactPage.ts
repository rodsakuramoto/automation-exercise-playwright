import { Page, Locator, expect } from '@playwright/test';

export class ContactPage {
  readonly page: Page;
  readonly contactLink: Locator;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly uploadFileInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly homeLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contactLink = page.getByRole('link', { name: 'Contact us' });
    this.heading = page.getByRole('heading', { name: 'Get In Touch' });
    this.nameInput = page.getByPlaceholder('Name');
    this.emailInput = page.getByPlaceholder('Email', { exact: true });
    this.subjectInput = page.getByPlaceholder('Subject');
    this.messageInput = page.getByPlaceholder('Your Message Here');
    this.uploadFileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.successMessage = page.locator('.status.alert.alert-success');
    this.homeLink = page.getByRole('link', { name: ' Home' });
  }

  async navigateToContact() {
    await this.contactLink.click();
  }

  async verifyContactPageLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async fillContactForm(name: string, email: string, subject: string, message: string, file: { name: string, mimeType: string, buffer: Buffer }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageInput.fill(message);
    await this.uploadFileInput.setInputFiles(file);
    await this.page.waitForTimeout(1000);
  }

  async submitContactForm() {
    this.page.once('dialog', dialog => dialog.accept());
    await this.submitButton.click();
  }

  async verifySuccessMessage() {
    await expect(this.successMessage).toHaveText('Success! Your details have been submitted successfully.');
  }

  async navigateHome() {
    await this.homeLink.click();
  }
}