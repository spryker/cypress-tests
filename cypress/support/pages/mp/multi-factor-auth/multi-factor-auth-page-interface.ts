import VisitOptions = Cypress.VisitOptions;

export interface MultiFactorAuthPageInterface {
  visit(options?: Partial<VisitOptions>): void;
  submitCode(code: string): void;
  verifyCode(code: string): void;
  activateMfa(type: string): void;
  deactivateMfa(type: string): void;
  getVerificationPopup(): Cypress.Chainable;
  getActivationSuccessMessage(): Cypress.Chainable;
  getDeactivationSuccessMessage(): Cypress.Chainable;
  getInvalidCodeMessage(): Cypress.Chainable;
}
