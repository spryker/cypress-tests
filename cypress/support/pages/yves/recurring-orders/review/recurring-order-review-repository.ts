export interface RecurringOrderReviewRepository {
  getSummaryBanner(): Cypress.Chainable;
  getBackToDetailLink(): Cypress.Chainable;
  getFooterTotal(): Cypress.Chainable;
  getAcceptCta(): Cypress.Chainable;
  getApproveSubmitButton(): Cypress.Chainable;
  getFlaggedItems(): Cypress.Chainable;
  getScopeOption(scope: string): Cypress.Chainable;

  getCostCenterSelect(): Cypress.Chainable;
  getBudgetSelect(): Cypress.Chainable;
  getBudgetSummaryUsed(): Cypress.Chainable;
  getBudgetSummaryTotal(): Cypress.Chainable;
  getBudgetSummaryRemaining(): Cypress.Chainable;

  getLineQuantityInput(): Cypress.Chainable;
  getLineRemoveToggle(): Cypress.Chainable;

  getSubstituteChangeButton(): Cypress.Chainable;
  getSubstituteRemoveButton(): Cypress.Chainable;
  getSubstituteOption(): Cypress.Chainable;
  getSubstituteQuantityInput(): Cypress.Chainable;
  getSubstituteConfirmButton(): Cypress.Chainable;

  getAddProductOpenModalButton(): Cypress.Chainable;
  getAddProductSearchInput(): Cypress.Chainable;
  getAddProductSuggestion(): Cypress.Chainable;
  getAddProductPickerPrice(): Cypress.Chainable;
  getAddProductOfferSelect(): Cypress.Chainable;
  getAddProductPickerQuantityInput(): Cypress.Chainable;
  getAddProductPickerSubmitButton(): Cypress.Chainable;
  getAddProductLine(): Cypress.Chainable;

  getShipmentAddressSelect(): Cypress.Chainable;
  getShipmentMethodSelect(): Cypress.Chainable;
}
