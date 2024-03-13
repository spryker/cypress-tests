export interface CheckoutSummaryRepository {
  getaAcceptTermsAndConditionsCheckbox(): Cypress.Chainable;
  getSummaryForm(): Cypress.Chainable;
}
