import { injectable } from 'inversify';
import { ProductRepository } from '../product-repository';

@injectable()
export class B2cProductRepository implements ProductRepository {
  getSoldByProductOffers = (): Cypress.Chainable => cy.get('[data-qa="component merchant-product-offer-item"]');
  getSoldByProductOfferRadios = (): Cypress.Chainable =>
    cy.get('[data-qa="component merchant-product-offer-item"] input[type="radio"]');
  getMerchantRelationRequestLinkAttribute = (): string => '[data-qa="merchant-relation-request-create-link"]';
  getInputRadioSelector = (): string => 'input[type="radio"]';
  getProductConfigurator = (): Cypress.Chainable => cy.get('.page-layout-main');
  getAddToCartButton = (): Cypress.Chainable => cy.get('[data-qa="add-to-cart-button"]:visible');
  getAddToCartSuccessMessage = (): string => 'Items added successfully';
  getQuantityInput = (): Cypress.Chainable => cy.get('[data-qa="quantity-counter"]');
  getToggleComparisonListButton = (): Cypress.Chainable => cy.get('[data-qa="add-to-compare-list-button"]');
  getAddToComparisonListSuccessMessage = (): string => 'Added to comparison';
  getRemoveFromComparisonListSuccessMessage = (): string => 'Product was removed from the comparison list.';
  getAddToComparisonListLimitExceededErrorMessage = (): string => 'The limit has already been reached';
  getShipmentTypeRadioButton = (shipmentTypeName: string): Cypress.Chainable =>
    cy.contains('[data-qa="component radio shipment_type_uuid"]', shipmentTypeName).find('input');
  getSelectServicePointButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component ssp-service-point-selector"] button');
  getSelectAssetButton = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-trigger"]');
  getSelectAssetPopup = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-results"]', { timeout: 10000 });
  getAssetOptions = (): Cypress.Chainable => cy.get('[data-qa="asset-option-trigger"');
  getServicePointSearchInput = (): Cypress.Chainable => cy.get('[data-qa="component ssp-service-point-finder"] input');
  getServicePointListItem = (servicePointName: string): Cypress.Chainable =>
    cy
      .get('[data-qa="component service-point"]')
      .filter((_, el) => Cypress.$(el).find('.service-point__name').text().trim() === servicePointName)
      .find('button');
  getSelectedServicePointName = (): Cypress.Chainable => cy.get('[data-qa="component ssp-service-point-selector"]');
  getCloseServicePointPopupButton = (): Cypress.Chainable => cy.get('.js-main-popup__close');
  getSspAssetNameBlock = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-name"]');
  getAttachmentsList = (): Cypress.Chainable => cy.get('[data-qa="component product-detail"] [data-qa="attachments-table"]');
  getAttachmentItems = (): Cypress.Chainable => cy.get('[data-qa="component product-detail"] [data-qa="cell-name"] .link');
}
