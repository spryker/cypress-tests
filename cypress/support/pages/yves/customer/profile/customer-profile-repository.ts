export interface CustomerProfileRepository {
  getCurrentPasswordInput(): Cypress.Chainable;
  getNewPasswordInput(): Cypress.Chainable;
  getConfirmPasswordInput(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getPasswordChangedMessage(): string;
  getSalutationSelect(): Cypress.Chainable;
  getFirstNameInput(): Cypress.Chainable;
  getLastNameInput(): Cypress.Chainable;
  getEmailInput(): Cypress.Chainable;
  getProfileSubmitButton(): Cypress.Chainable;
  getProfileSavedMessage(): string;
  getEmailInUseErrorMessage(): string;
  getPasswordsDoNotMatchMessage(): string;
}
