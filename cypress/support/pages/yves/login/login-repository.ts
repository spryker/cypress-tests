export interface LoginRepository {
  getLoginEmailInput(): Cypress.Chainable;
  getLoginPasswordInput(): Cypress.Chainable;
  getLoginForm(): Cypress.Chainable;
  getRegisterSalutationSelect(): Cypress.Chainable;
  getRegisterFirstNameInput(): Cypress.Chainable;
  getRegisterLastNameInput(): Cypress.Chainable;
  getRegisterEmailInput(): Cypress.Chainable;
  getRegisterPasswordInput(): Cypress.Chainable;
  getRegisterConfirmPasswordInput(): Cypress.Chainable;
  getRegisterAcceptTermsCheckbox(): Cypress.Chainable;
  getRegisterForm(): Cypress.Chainable;
  getFailedAuthenticationText(): string;
  getRegistrationCompletedMessage(): string;
}
