export interface AgentLoginRepository {
  getLoginEmailInput(): Cypress.Chainable;
  getLoginPasswordInput(): Cypress.Chainable;
  getLoginForm(): Cypress.Chainable;
  getFailedAuthenticationText(): string;
}
