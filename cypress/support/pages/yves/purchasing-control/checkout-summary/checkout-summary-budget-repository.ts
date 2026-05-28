export interface CheckoutSummaryBudgetRepository {
  getCheckoutErrorMessage(): Cypress.Chainable;
  getWarnFlashMessage(): Cypress.Chainable;
  getCostCenterSelectorValue(): Cypress.Chainable;
  getBudgetRemainingAmount(): Cypress.Chainable;
  getApproveButton(): Cypress.Chainable;
  getDeclineButton(): Cypress.Chainable;
}
