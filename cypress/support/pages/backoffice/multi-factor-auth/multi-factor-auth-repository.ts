export interface MultiFactorAuthRepository {
  getVerificationCodeInput(): Cypress.Chainable;
  getVerifyButton(): Cypress.Chainable;
  getMfaTypeSection(type: string): Cypress.Chainable;
  getVerificationPopup(): Cypress.Chainable;
  getActivationSuccessMessage(): string;
  getDeactivationSuccessMessage(): string;
  getInvalidCodeMessage(): string;
}
