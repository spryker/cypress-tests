export interface RecurringOrderReviewRepository {
  getSummaryBanner(): Cypress.Chainable;
  getBackToDetailLink(): Cypress.Chainable;
  getFooterTotal(): Cypress.Chainable;
  getAcceptCta(): Cypress.Chainable;
  getApproveSubmitButton(): Cypress.Chainable;
  getFlaggedItems(): Cypress.Chainable;
}
