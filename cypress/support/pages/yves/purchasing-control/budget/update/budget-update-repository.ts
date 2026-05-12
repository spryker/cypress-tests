export interface BudgetUpdateRepository {
  getNameInput(): Cypress.Chainable;
  getAmountInput(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getSuccessFlashMessage(): Cypress.Chainable;
}
