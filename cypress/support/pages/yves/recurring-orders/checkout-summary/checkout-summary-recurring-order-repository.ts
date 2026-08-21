export interface CheckoutSummaryRecurringOrderRepository {
  getRecurringOrderToggle(): Cypress.Chainable;
  getScheduleNameInput(): Cypress.Chainable;
  getCadenceTypeSelect(): Cypress.Chainable;
  getCadenceValueInput(): Cypress.Chainable;
  getStartDateInput(): Cypress.Chainable;
  getStartDateTooltip(): Cypress.Chainable;
  getConfirmButton(): Cypress.Chainable;

  /** Earliest date the widget offers, as `yyyy-mm-dd`. */
  getEarliestSelectableStartDate(): Cypress.Chainable<string>;

  /**
   * Asserts the widget refuses a date before today. A native date input keeps the value and reports it
   * as out of range, while a JS datepicker discards it outright, so the check belongs to the platform.
   */
  assertStartDateRejected(): void;
}
