import { test, expect } from '../support/fixtures';
import { generateRandomUser } from '../support/helpers';
import { ContactPage } from '../pages/ContactPage';

test.describe('Contact Us', () => {

  test('Test Case 6: Contact Us Form', async ({ page, homePage }) => {
    const contactPage = new ContactPage(page);
    const user = generateRandomUser();

    await homePage.navigate();
    await expect(page).toHaveTitle(/Automation Exercise/);

    await contactPage.navigateToContact();
    await contactPage.verifyContactPageLoaded();

    await contactPage.fillContactForm(user.firstName, user.email, 'Test Subject', 'Test Message', {
      name: 'test_file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is a test file for upload.')
    });

    await contactPage.submitContactForm();
    await contactPage.verifySuccessMessage();

    await contactPage.navigateHome();
    await expect(page).toHaveTitle(/Automation Exercise/);
  });

});