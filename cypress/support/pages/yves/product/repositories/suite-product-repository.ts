import { injectable } from 'inversify';
import { ProductRepository } from '../product-repository';
import * as Cypress from 'cypress';

@injectable()
export class SuiteProductRepository implements ProductRepository {
  getSoldByProductOffers = (): Cypress.Chainable => cy.get('[data-qa="component merchant-product-offer-item"]');
  getSoldByProductOfferRadios = (): Cypress.Chainable =>
    cy.get('[data-qa="component merchant-product-offer-item"] input[type="radio"]');
  getMerchantRelationRequestLinkAttribute = (): string => '[data-qa="merchant-relation-request-create-link"]';
  getInputRadioSelector = (): string => 'input[type="radio"]';
  getProductConfigurator = (): Cypress.Chainable => cy.get('[data-qa="component product-configurator"]');
}
