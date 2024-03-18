export interface CatalogRepository {
  getSearchInput(): Cypress.Chainable;
  getFirstSuggestedProduct(): Cypress.Chainable;
  getSoldByProductOffers(): Cypress.Chainable;
  getSoldByProductOfferRadios(): Cypress.Chainable;
  getMerchantRelationRequestLinkAttribute(): string;
}
