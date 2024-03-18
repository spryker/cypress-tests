import { injectable } from 'inversify';
import { CatalogRepository } from '../catalog-repository';
import * as Cypress from 'cypress';

@injectable()
export class SuiteCatalogRepository implements CatalogRepository {
  getSearchInput = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] input').first();
  getFirstSuggestedProduct = (): Cypress.Chainable => cy.get('[data-qa="component suggestion-product"] a').first();
  getSoldByProductOffers = (): Cypress.Chainable => cy.get('[data-qa="component merchant-product-offer-item"]');
  getSoldByProductOfferRadios = (): Cypress.Chainable =>
    cy.get('[data-qa="component merchant-product-offer-item"] input[type="radio"]');
  getMerchantRelationRequestLinkAttribute = (): string => '[data-qa="merchant-relation-request-create-link"]';
}
