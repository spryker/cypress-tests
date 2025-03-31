export interface CustomerProfileRepository {
  getCurrentPasswordInput(): Cypress.Chainable;
  getNewPasswordInput(): Cypress.Chainable;
  getConfirmPasswordInput(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
}
