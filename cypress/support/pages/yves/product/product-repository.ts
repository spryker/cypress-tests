export interface ProductRepository {
  getSoldByProductOffers(): Cypress.Chainable;
  getSoldByProductOfferRadios(): Cypress.Chainable;
  getMerchantRelationRequestLinkAttribute(): string;
  getInputRadioSelector(): string;
  getProductConfigurator(): Cypress.Chainable;
}
