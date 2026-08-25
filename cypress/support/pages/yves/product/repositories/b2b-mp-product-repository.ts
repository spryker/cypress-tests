import { injectable } from 'inversify';
import { ProductRepository } from '../product-repository';

@injectable()
export class B2bMpProductRepository implements ProductRepository {
  getSoldByProductOffers = (): Cypress.Chainable =>
    cy.get('[data-qa="component seller-list"] .seller-list__items').first();
  // using old and new locators. remove old one after June release
  getSoldByProductOfferRadios = (): Cypress.Chainable =>
    cy.get(
      '[data-qa="component buy-box-item"] input[type="radio"], [data-qa="component seller-list-item"] input[type="radio"][name="product_offer_reference"]'
    );
  getMerchantRelationRequestLinkAttribute = (): string => '[data-qa="merchant-relation-request-create-link"]';
  getInputRadioSelector = (): string => 'input[type="radio"]';
  getProductConfigurator = (): Cypress.Chainable => cy.get('[data-qa="component product-configurator"]');
  getAddToCartButton = (): Cypress.Chainable => cy.get('[data-qa="add-to-cart-button"]');
  getAddToCartSuccessMessage = (): string => 'Items added successfully';
  getQuantityInput = (): Cypress.Chainable => cy.get('[data-qa="quantity-input"]');
  getToggleComparisonListButton = (): Cypress.Chainable => cy.get('[data-qa="add-to-compare-list-button"]');
  getAddToComparisonListSuccessMessage = (): string => 'Added to comparison';
  getRemoveFromComparisonListSuccessMessage = (): string => 'Product was removed from the comparison list.';
  getAddToComparisonListLimitExceededErrorMessage = (): string => 'The limit has already been reached';
  getShipmentTypeRadioButton = (shipmentTypeName: string): Cypress.Chainable =>
    cy.contains('[data-qa="component radio shipment_type_uuid"]', shipmentTypeName).find('input');
  getServicePointBlockLoader = (): Cypress.Chainable =>
    cy.get('ajax-loader[provider-class-name="js-service-point-shipment-types-provider"]');
  getSelectServicePointButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component ssp-service-point-selector"] button:visible');
  getSelectAssetButton = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-trigger"]');
  getSelectAssetPopup = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-results"]', { timeout: 10000 });
  getAssetOptions = (): Cypress.Chainable => cy.get('[data-qa="asset-option-trigger"');
  getServicePointSearchInput = (): Cypress.Chainable => cy.get('[data-qa="component ssp-service-point-finder"] input');
  getServicePointFinderResults = (): Cypress.Chainable => cy.get('[data-qa="component service-point"]:visible');

  getServicePointListItem = (servicePointName: string): Cypress.Chainable =>
    cy
      .get('[data-qa="component ssp-service-point-finder"]:visible')
      .find('[data-qa="component service-point"]:visible')
      .filter((_, el) => Cypress.$(el).find('.service-point__name').text().trim() === servicePointName)
      .find('button[data-qa="available-service-point"]');
  getSelectedServicePointName = (): Cypress.Chainable => cy.get('[data-qa="component ssp-service-point-selector"]');
  getCloseServicePointPopupButton = (): Cypress.Chainable => cy.get('.js-main-popup__close');
  getSspAssetNameBlock = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-name"]');
  getAttachmentsListSelector = (): string => '[data-qa="component product-detail"] [data-qa="attachments-list"]';
  getAttachmentsList = (): Cypress.Chainable => cy.get(this.getAttachmentsListSelector());
  getAttachmentItems = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-detail"] [data-qa="attachment-item"]');
  getVariantAttributeSelect = (attributeKey: string): Cypress.Chainable =>
    cy.get(`select[name="attribute[${attributeKey}]"]`);
  getVariantAttributeOptions = (attributeKey: string): Cypress.Chainable =>
    this.getVariantAttributeSelect(attributeKey).find('option[value]:not([value=""])');
  getSelectedVariantAttributeInput = (attributeKey: string): Cypress.Chainable =>
    cy.get(`input[type="hidden"][name="attribute[${attributeKey}]"]`);
  getRelatedProductsSectionSelector = (): string => '[class*="title--product-slider"]:contains("Similar products")';
  getRelatedProductsCarousel = (): Cypress.Chainable =>
    cy.get(this.getRelatedProductsSectionSelector()).first().parent().find('slick-carousel');
  getProductLabels = (): Cypress.Chainable => cy.get('#main-content [data-qa="component label-group"]');
  getProductConfigurationStatus = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-configurator"] [data-qa="component status"]');
  getConfigureButton = (): Cypress.Chainable => cy.get('[data-qa="component configuration-form"] button');

  getProductDetailPrice = (): Cypress.Chainable => cy.get('volume-price span.volume-price__price:visible').first();
  getProductOptionSelects = (): Cypress.Chainable => cy.get('select[name^="product-option["]');

  getProductDetailOriginalPrice = (): Cypress.Chainable =>
    cy.get('volume-price span[class*="volume-price"][class*="original"]:visible').first();

  getAlternativeProductsSlider = (): Cypress.Chainable => cy.get('[data-qa="component product-alternative-slider"]');

  setQuantity = (quantity: number): void => {
    cy.get('body').then(($body) => {
      // The volume-price component binds its own quantity control. A logged-in detail page also
      // renders a quantity select for the shopping-list widget, so matching on the name alone finds
      // two and cy.select() refuses the pair.
      if ($body.find('select.js-volume-price__quantity').length) {
        cy.get('select.js-volume-price__quantity').first().select(String(quantity));

        return;
      }

      // On a measurement-unit product the quantity is counted in sales units, and the field beside
      // it holds the resulting amount in base units — writing the amount instead would not convert.
      if ($body.find('.js-packaging-unit-quantity-selector__formatted-sales-unit-quantity input').length) {
        cy.get('.js-packaging-unit-quantity-selector__formatted-sales-unit-quantity input').first().clear();
        cy.get('.js-packaging-unit-quantity-selector__formatted-sales-unit-quantity input')
          .first()
          .type(String(quantity));

        return;
      }

      if ($body.find('select[name="quantity"]').length) {
        cy.get('select[name="quantity"]').first().select(String(quantity));

        return;
      }

      cy.get('formatted-number-input input').first().clear();
      cy.get('formatted-number-input input').first().type(String(quantity));
    });
  };

  selectSalesUnit = (salesUnitName: string): void => {
    cy.get('select[name="id-product-measurement-sales-unit"]').select(salesUnitName);
  };

  getMeasurementUnitChoice = (): Cypress.Chainable =>
    cy.get('.js-packaging-unit-quantity-selector__measurement-unit-choice');

  setAmount = (amount: number): void => {
    cy.get('.js-packaging-unit-quantity-selector__formatted-user-amount input').first().clear();
    cy.get('.js-packaging-unit-quantity-selector__formatted-user-amount input').first().type(String(amount));
  };

  getPackagingUnitChoice = (): Cypress.Chainable =>
    cy.get('.js-packaging-unit-quantity-selector__packaging-unit-choice');

  getBundleItems = (): Cypress.Chainable => cy.get('[data-qa*="component bundle-items"]');
}
