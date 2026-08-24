export interface CheckoutCustomerRepository {
  getGuestRadioButton(): Cypress.Chainable;
  getGuestFirstNameField(): Cypress.Chainable;
  getGuestLastNameField(): Cypress.Chainable;
  getGuestEmailField(): Cypress.Chainable;
  getGuestTermsCheckbox(): Cypress.Chainable;
  getGuestSubmitButton(): Cypress.Chainable;
  getLoginRadioButton(): Cypress.Chainable;
  getLoginEmailField(): Cypress.Chainable;
  getLoginPasswordField(): Cypress.Chainable;
  getLoginSubmitButton(): Cypress.Chainable;
  getRegisterSalutationField(): Cypress.Chainable;
  getRegisterFirstNameField(): Cypress.Chainable;
  getRegisterLastNameField(): Cypress.Chainable;
  getRegisterEmailField(): Cypress.Chainable;
  getRegisterPasswordField(): Cypress.Chainable;
  getRegisterConfirmPasswordField(): Cypress.Chainable;
  getRegisterTermsCheckbox(): Cypress.Chainable;
  getRegisterSubmitButton(): Cypress.Chainable;
}
