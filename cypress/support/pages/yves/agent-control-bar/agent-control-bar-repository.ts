export interface AgentControlBarRepository {
  getCustomerSearchInput(): Cypress.Chainable;
  getSuggestion(email: string): Cypress.Chainable;
  getConfirmButtonSelector(): string;
  getActiveAssistanceIndicator(): Cypress.Chainable;
  getEndAssistanceLink(): Cypress.Chainable;
  getCustomerAutocompleteUrl(): string;
}
