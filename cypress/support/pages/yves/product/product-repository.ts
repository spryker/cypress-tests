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

  // The price block on the detail page itself. The related-products carousel prints prices too,
  // so this must stay narrowed to the product being viewed.
  getProductDetailPrice(): Cypress.Chainable;

  // Product option groups are only offered once a concrete variant is resolved. The field name is
  // built in PHP, so it is the one selector that does not differ between the storefront themes.
  getProductOptionSelects(): Cypress.Chainable;

  // Rendered only when an ORIGINAL price above the default exists, which is what makes it the
  // assertion for a strike-through price rather than a second copy of the default one.
  getProductDetailOriginalPrice(): Cypress.Chainable;

  // Rendered next to its own heading, not in the related-products slot — both are the same carousel
  // component in some themes, so the heading is what tells them apart.
  getAlternativeProductsSlider(): Cypress.Chainable;

  // The quantity control renders as a select for some products and as a formatted-number-input for
  // others, and the volume-price component only recalculates on a real change event — so setting the
  // quantity is an interaction, not a selector.
  setQuantity(quantity: number): void;

  // The measurement-unit widget's own controls: which sales unit the quantity is counted in, and the
  // block it reveals when the quantity does not land on a whole base unit.
  selectSalesUnit(salesUnitName: string): void;
  getMeasurementUnitChoice(): Cypress.Chainable;

  // A packaging unit is ordered by amount rather than by quantity, and it has its own choice block
  // for the min / max / interval rules that amount has to satisfy.
  setAmount(amount: number): void;
  getPackagingUnitChoice(): Cypress.Chainable;

  // What a bundle product lists on its detail page. The data-qa is the same in every theme.
  getBundleItems(): Cypress.Chainable;

  // Availability state and the back-in-stock notification form. The form ids come from the Symfony
  // form types, so they are the same wherever the widget is rendered.
  getAvailabilityStatus(): Cypress.Chainable;
  getAvailabilityNotificationEmailField(): Cypress.Chainable;
  getAvailabilityNotificationSubscribeForm(): Cypress.Chainable;
  getAvailabilityNotificationUnsubscribeForm(): Cypress.Chainable;
  getFlashMessages(): Cypress.Chainable;
}
