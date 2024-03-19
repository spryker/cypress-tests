export interface MerchantRelationRequestIndexRepository {
  getMerchantRelationRequestButton(): Cypress.Chainable;
  getFilterMerchantSelect(): Cypress.Chainable;
  getFilterBusinessUnitOwnerSelect(): Cypress.Chainable;
  getFilterStatusSelect(): Cypress.Chainable;
  getApplyButton(): Cypress.Chainable;
  getFirstTableRaw(): Cypress.Chainable;
  getViewLinkSelector(): string;
}
