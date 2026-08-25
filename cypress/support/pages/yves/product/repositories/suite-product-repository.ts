import { injectable } from 'inversify';
import { ProductRepository } from '../product-repository';

@injectable()
export class SuiteProductRepository implements ProductRepository {
  getSoldByProductOffers = (): Cypress.Chainable => cy.get('[data-qa="component buy-box-item"]');
  getSoldByProductOfferRadios = (): Cypress.Chainable =>
    cy.get('[data-qa="component buy-box-item"] input[type="radio"]');
  getMerchantRelationRequestLinkAttribute = (): string => '[data-qa="merchant-relation-request-create-link"]';
  getInputRadioSelector = (): string => 'input[type="radio"]';
  getProductConfigurator = (): Cypress.Chainable => cy.get('[data-qa="component product-configurator"]');
  getAddToCartButton = (): Cypress.Chainable => cy.get('[data-qa="add-to-cart-button"]');
  getAddToCartSuccessMessage = (): string => 'Items added successfully';
  getQuantityInput = (): Cypress.Chainable => cy.get('[name="quantity"]');
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
  getServicePointSearchInput = (): Cypress.Chainable => cy.get('[data-qa="component ssp-service-point-finder"] input');
  getSelectAssetButton = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-trigger"]');
  getSelectAssetPopup = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-results"]', { timeout: 10000 });
  getAssetOptions = (): Cypress.Chainable => cy.get('[data-qa="asset-option-trigger"');
  getServicePointFinderResults = (): Cypress.Chainable => cy.get('[data-qa="component service-point"]');

  getServicePointListItem = (servicePointName: string): Cypress.Chainable =>
    cy
      .get('[data-qa="component ssp-service-point-finder"]')
      .find('[data-qa="component service-point"]')
      .filter((_, el) => Cypress.$(el).find('.service-point__name').text().trim() === servicePointName)
      .find('button[data-qa="available-service-point"]');
  getSelectedServicePointName = (): Cypress.Chainable => cy.get('[data-qa="component ssp-service-point-selector"]');
  getCloseServicePointPopupButton = (): Cypress.Chainable => cy.get('.js-main-popup__close');
  getSspAssetNameBlock = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-name"]');
  getAttachmentsListSelector = (): string => '[data-qa="component product-detail"] ul.list';
  getAttachmentsList = (): Cypress.Chainable => cy.get(this.getAttachmentsListSelector());
  getAttachmentItems = (): Cypress.Chainable => cy.get('[data-qa="component product-detail"] .list__item .link');
  getVariantAttributeSelect = (attributeKey: string): Cypress.Chainable =>
    cy.get(`select[name="attribute[${attributeKey}]"]`);
  getVariantAttributeOptions = (attributeKey: string): Cypress.Chainable =>
    this.getVariantAttributeSelect(attributeKey).find('option[value]:not([value=""])');
  getSelectedVariantAttributeInput = (attributeKey: string): Cypress.Chainable =>
    cy.get(`input[type="hidden"][name="attribute[${attributeKey}]"]`);
  getRelatedProductsSectionSelector = (): string => 'main simple-carousel[data-qa="component simple-carousel"]';
  getRelatedProductsCarousel = (): Cypress.Chainable => cy.get(this.getRelatedProductsSectionSelector()).first();
  getProductLabels = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-carousel"] [data-qa="component label-group"]');
  getProductConfigurationStatus = (): Cypress.Chainable =>
    cy.get('[data-qa="component product-configurator"] [data-qa="component status"]');
  getConfigureButton = (): Cypress.Chainable => cy.get('[data-qa="component configuration-form"] button');
}
