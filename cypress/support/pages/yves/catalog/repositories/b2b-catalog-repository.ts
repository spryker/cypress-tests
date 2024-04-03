import { injectable } from 'inversify';
import { CatalogRepository } from '../catalog-repository';
import * as Cypress from 'cypress';

@injectable()
export class B2bCatalogRepository implements CatalogRepository {
  getSearchInput = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] input').first();
  getFirstSuggestedProduct = (): Cypress.Chainable => cy.get('[data-qa="component suggestion-product"] a').first();
}
