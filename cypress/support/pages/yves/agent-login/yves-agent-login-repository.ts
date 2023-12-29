export interface YvesAgentLoginRepository {
  getLoginEmailInput(): Cypress.Chainable;

  getLoginPasswordInput(): Cypress.Chainable;

  getLoginForm(): Cypress.Chainable;

  getFailedAuthenticationText(): string;
}
