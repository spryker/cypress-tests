export interface CheckoutSummaryRecurringOrderRepository {
  getRecurringOrderToggle(): Cypress.Chainable;
  getScheduleNameInput(): Cypress.Chainable;
  getCadenceTypeSelect(): Cypress.Chainable;
  getCadenceValueInput(): Cypress.Chainable;
  getConfirmButton(): Cypress.Chainable;
}
