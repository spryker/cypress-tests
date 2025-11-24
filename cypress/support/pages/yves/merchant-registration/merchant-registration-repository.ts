export interface MerchantRegistrationRepository {
  getCompanyNameInput(): Cypress.Chainable;
  getStreetInput(): Cypress.Chainable;
  getHouseNumberInput(): Cypress.Chainable;
  getZipCodeInput(): Cypress.Chainable;
  getCityInput(): Cypress.Chainable;
  getRegistrationNumberInput(): Cypress.Chainable;
  getFirstNameInput(): Cypress.Chainable;
  getLastNameInput(): Cypress.Chainable;
  getRoleInput(): Cypress.Chainable;
  getEmailInput(): Cypress.Chainable;
  getPhoneInput(): Cypress.Chainable;
  getAcceptTermsCheckbox(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;

  // Select interactions (implementation differs per repository)
  selectCountry(country: string): void;
  selectTitle(title: string): void;
}
