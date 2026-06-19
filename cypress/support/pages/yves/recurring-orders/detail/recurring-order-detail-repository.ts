export interface RecurringOrderDetailRepository {
  getScheduleName(): Cypress.Chainable;
  getCadence(): Cypress.Chainable;
  getStatusBadge(): Cypress.Chainable;
  getPauseButton(): Cypress.Chainable;
  getResumeButton(): Cypress.Chainable;
  getCancelButton(): Cypress.Chainable;
  getSkipButton(): Cypress.Chainable;
  getReviewButton(): Cypress.Chainable;
  getSkipConfirmButton(): Cypress.Chainable;
  getCancelConfirmButton(): Cypress.Chainable;
  getPauseConfirmButton(): Cypress.Chainable;
  getResumeConfirmButton(): Cypress.Chainable;
  getResumeDateInput(): Cypress.Chainable;
  getHistoryViewOrderLink(): Cypress.Chainable;
  getDetailItems(): Cypress.Chainable;
}
