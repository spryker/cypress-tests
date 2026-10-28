export interface CheckoutSummaryRepository {
  getApproverSelect(): Cypress.Chainable;
  getSendApprovalRequestButton(): Cypress.Chainable;
  getCancelApprovalRequestButton(): Cypress.Chainable;
  getApproveButton(): Cypress.Chainable;
  getApprovalStatus(): Cypress.Chainable;
  getaAcceptTermsAndConditionsCheckbox(): Cypress.Chainable;
  getSummaryForm(): Cypress.Chainable;
}
