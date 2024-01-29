export interface YvesCheckoutCustomerRepository {
  getGuestRadioButton(): Cypress.Chainable;
  getGuestFirstNameField(): Cypress.Chainable;
  getGuestLastNameField(): Cypress.Chainable;
  getGuestEmailField(): Cypress.Chainable;
  getGuestTermsCheckbox(): Cypress.Chainable;
  getGuestSubmitButton(): Cypress.Chainable;
}
