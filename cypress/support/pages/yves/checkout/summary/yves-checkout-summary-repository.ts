export interface YvesCheckoutSummaryRepository {
  getaAcceptTermsAndConditionsCheckbox(): Cypress.Chainable;
  getSummaryForm(): Cypress.Chainable;
}
