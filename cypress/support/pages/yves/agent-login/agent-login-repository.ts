export interface AgentLoginRepository {
  getLoginEmailInput(): Cypress.Chainable;
  getLoginPasswordInput(): Cypress.Chainable;
  getLoginForm(): Cypress.Chainable;
  getFailedAuthenticationText(): string;
  getCaptchaWidget(): Cypress.Chainable;
  getCaptchaCheckboxLabel(): Cypress.Chainable;
  getCaptchaPayloadInput(): Cypress.Chainable;
  getCaptchaVerifiedStateSelector(): string;
  getCaptchaRequiredText(): string;
  getCaptchaInvalidText(): string;
  getAccountBlockedText(): string;
}
