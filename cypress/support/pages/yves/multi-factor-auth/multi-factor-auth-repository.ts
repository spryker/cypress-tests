export interface MultiFactorAuthRepository {
  getVerificationCodeInput(): Cypress.Chainable;
  getVerifyButton(): Cypress.Chainable;
  getMfaTypeSection(type: string): Cypress.Chainable;
  getActivateForm(): Cypress.Chainable;
  getDeactivateForm(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getVerificationPopup(): Cypress.Chainable;
}
