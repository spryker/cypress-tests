export interface CompanyRegistrationRepository {
  getSalutationSelect(): Cypress.Chainable;
  getFirstNameInput(): Cypress.Chainable;
  getLastNameInput(): Cypress.Chainable;
  getCompanyNameInput(): Cypress.Chainable;
  getEmailInput(): Cypress.Chainable;
  getPasswordInput(): Cypress.Chainable;
  getConfirmPasswordInput(): Cypress.Chainable;
  getAcceptTermsCheckbox(): Cypress.Chainable;
  getRegistrationForm(): Cypress.Chainable;
  getPageTitleText(): string;
  getRegistrationCompletedMessage(): string;
}
