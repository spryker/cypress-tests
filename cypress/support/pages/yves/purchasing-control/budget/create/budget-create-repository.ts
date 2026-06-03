export interface BudgetCreateRepository {
  getNameInput(): Cypress.Chainable;
  getAmountInput(): Cypress.Chainable;
  getCurrencySelect(): Cypress.Chainable;
  getEnforcementRuleSelect(): Cypress.Chainable;
  getStartsAtInput(): Cypress.Chainable;
  getEndsAtInput(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getSuccessFlashMessage(): Cypress.Chainable;
}
