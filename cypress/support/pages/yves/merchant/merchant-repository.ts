export interface MerchantRepository {
  getMerchantRelationRequestButton(): Cypress.Chainable;
  getInformationItemLabelSelector(): string;
}
