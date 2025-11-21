export interface MerchantRegistrationRepository {
  getCompanyNameInput(): Cypress.Chainable;
  getCountrySelectContainer(): Cypress.Chainable;
  getCountrySelectOption(): Cypress.Chainable;
  getStreetInput(): Cypress.Chainable;
  getHouseNumberInput(): Cypress.Chainable;
  getZipCodeInput(): Cypress.Chainable;
  getCityInput(): Cypress.Chainable;
  getRegistrationNumberInput(): Cypress.Chainable;
  getTitleSelectContainer(): Cypress.Chainable;
  getTitleSelectOption(): Cypress.Chainable;
  getFirstNameInput(): Cypress.Chainable;
  getLastNameInput(): Cypress.Chainable;
  getRoleInput(): Cypress.Chainable;
  getEmailInput(): Cypress.Chainable;
  getPhoneInput(): Cypress.Chainable;
  getAcceptTermsCheckbox(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
}
