import { injectable } from 'inversify';
import { ProductRepository } from '../product-repository';
import * as Cypress from 'cypress';

@injectable()
export class B2bProductRepository implements ProductRepository {
  getSoldByProductOffers = (): Cypress.Chainable => cy.get('[data-qa="component merchant-product-offer-item"]');
  getSoldByProductOfferRadios = (): Cypress.Chainable =>
    cy.get('[data-qa="component merchant-product-offer-item"] input[type="radio"]');
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
  getSelectServicePointButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component ssp-service-point-selector"] button');
  getServicePointSearchInput = (): Cypress.Chainable => cy.get('[data-qa="component ssp-service-point-finder"] input');
  getServicePointListItem = (servicePointName: string): Cypress.Chainable =>
    cy.contains('[data-qa="component service-point"]', servicePointName).find('button');
  getSelectedServicePointName = (): Cypress.Chainable => cy.get('[data-qa="component ssp-service-point-selector"]');
  getCloseServicePointPopupButton = (): Cypress.Chainable => cy.get('.js-main-popup__close');
  getSspAssetNameBlock = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-name"]');
}
