import { Page, Locator } from '@playwright/test';

export class SignupPage {
  readonly page: Page;

  // Locators do Formulário de Conta
  readonly genderRadio: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly optinCheckbox: Locator;

  // Locators do Endereço
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;

  // Botão Final
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Mapeamento
    this.genderRadio = page.locator('#id_gender1');
    this.passwordInput = page.locator('[data-qa="password"]');
    this.daysSelect = page.locator('[data-qa="days"]');
    this.monthsSelect = page.locator('[data-qa="months"]');
    this.yearsSelect = page.locator('[data-qa="years"]');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.optinCheckbox = page.locator('#optin');

    this.firstNameInput = page.locator('[data-qa="first_name"]');
    this.lastNameInput = page.locator('[data-qa="last_name"]');
    this.companyInput = page.locator('[data-qa="company"]');
    this.addressInput = page.locator('[data-qa="address"]');
    this.countrySelect = page.locator('[data-qa="country"]');
    this.stateInput = page.locator('[data-qa="state"]');
    this.cityInput = page.locator('[data-qa="city"]');
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');
    this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');

    this.createAccountButton = page.locator('[data-qa="create-account"]');
  }

  // Preenche a primeira parte (mantivemos a data de nascimento fixa para simplificar)
  async fillAccountDetails(password: string) {
    await this.genderRadio.check();
    await this.passwordInput.fill(password);
    await this.daysSelect.selectOption('10');
    await this.monthsSelect.selectOption('5');
    await this.yearsSelect.selectOption('1990');
    await this.newsletterCheckbox.check();
    await this.optinCheckbox.check();
  }

  // AGORA SIM: O método recebe todos os dados dinâmicos do Faker
  async fillAddressDetails(
    firstName: string,
    lastName: string,
    company: string,
    address: string,
    state: string,
    city: string,
    zipcode: string,
    mobileNumber: string
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.companyInput.fill(company);
    await this.addressInput.fill(address);

    // O país fica fixo aqui para bater com a opção válida do dropdown do site
    await this.countrySelect.selectOption('United States');

    await this.stateInput.fill(state);
    await this.cityInput.fill(city);
    await this.zipcodeInput.fill(zipcode);
    await this.mobileNumberInput.fill(mobileNumber);
  }

  // Clica no botão final
  async submitAccount() {
    await this.createAccountButton.click();
  }
}