export interface ProductRepository {
  getSoldByProductOffers(): Cypress.Chainable;
  getSoldByProductOfferRadios(): Cypress.Chainable;
  getMerchantRelationRequestLinkAttribute(): string;
  getInputRadioSelector(): string;
  getProductConfigurator(): Cypress.Chainable;

  // ProductConfigurationWidget prints whether the product is configured yet, and the form whose
  // button hands over to the external configurator.
  getProductConfigurationStatus(): Cypress.Chainable;
  getConfigureButton(): Cypress.Chainable;
  getAddToCartButton(): Cypress.Chainable;
  getAddToCartSuccessMessage(): string;
  getQuantityInput(): Cypress.Chainable;
  getToggleComparisonListButton(): Cypress.Chainable;
  getAddToComparisonListSuccessMessage(): string;
  getRemoveFromComparisonListSuccessMessage(): string;
  getAddToComparisonListLimitExceededErrorMessage(): string;
  getShipmentTypeRadioButton(shipmentTypeName: string): Cypress.Chainable;
  getServicePointBlockLoader(): Cypress.Chainable;
  getSelectServicePointButton(): Cypress.Chainable;
  getSelectAssetButton(): Cypress.Chainable;
  getSelectAssetPopup(): Cypress.Chainable;
  getAssetOptions(): Cypress.Chainable;
  getServicePointSearchInput(): Cypress.Chainable;
  getServicePointFinderResults?(): Cypress.Chainable;
  getServicePointListItem(servicePointName: string): Cypress.Chainable;
  getSelectedServicePointName(): Cypress.Chainable;
  getCloseServicePointPopupButton(): Cypress.Chainable;
  getSspAssetNameBlock(): Cypress.Chainable;
  getAttachmentsListSelector(): string;
  getAttachmentsList(): Cypress.Chainable;
  getAttachmentItems(): Cypress.Chainable;
  getVariantAttributeSelect(attributeKey: string): Cypress.Chainable;
  getVariantAttributeOptions(attributeKey: string): Cypress.Chainable;
  getSelectedVariantAttributeInput(attributeKey: string): Cypress.Chainable;
  getProductLabels(): Cypress.Chainable;
  getRelatedProductsCarousel(): Cypress.Chainable;
  getRelatedProductsSectionSelector(): string;
}
