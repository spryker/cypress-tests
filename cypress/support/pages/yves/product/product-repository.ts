export interface ProductRepository {
  getSoldByProductOffers(): Cypress.Chainable;
  getSoldByProductOfferRadios(): Cypress.Chainable;
  getMerchantRelationRequestLinkAttribute(): string;
  getInputRadioSelector(): string;
  getProductConfigurator(): Cypress.Chainable;
  getAddToCartButton(): Cypress.Chainable;
  getAddToCartSuccessMessage(): string;
  getQuantityInput(): Cypress.Chainable;
  getToggleComparisonListButton(): Cypress.Chainable;
  getAddToComparisonListSuccessMessage(): string;
  getRemoveFromComparisonListSuccessMessage(): string;
  getAddToComparisonListLimitExceededErrorMessage(): string;
}
