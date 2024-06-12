import { injectable } from 'inversify';
import { ProductRepository } from '../product-repository';
import * as Cypress from 'cypress';

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
}
