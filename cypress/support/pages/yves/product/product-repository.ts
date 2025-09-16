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
  getShipmentTypeRadioButton(shipmentTypeName: string): Cypress.Chainable;
  getSelectServicePointButton(): Cypress.Chainable;
  getServicePointSearchInput(): Cypress.Chainable;
  getServicePointListItem(servicePointName: string): Cypress.Chainable;
  getSelectedServicePointName(): Cypress.Chainable;
  getCloseServicePointPopupButton(): Cypress.Chainable;
  getSspAssetNameBlock(): Cypress.Chainable;
}
