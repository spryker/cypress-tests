import { injectable } from 'inversify';
import { CatalogRepository } from '../catalog-repository';
import * as Cypress from 'cypress';

@injectable()
export class B2cCatalogRepository implements CatalogRepository {
  getSearchInput = (): Cypress.Chainable => cy.get('[name="q"]');
  getFirstSuggestedProduct = (): Cypress.Chainable => cy.get('[data-qa="component suggestion-product"] a').first();
  getSearchButton = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] [type="submit"]:visible');
  getProductItemBlocks = (): Cypress.Chainable => cy.get('[data-qa="component product-item"]');
  getFirstProductItemBlockSelector = (): string => '[data-qa="component product-item"]:first';
  getViewButtonSelector = (): string => 'a:first';
  getItemBlockSearchQuery = (query: string): string => `span:contains("${query}")`;
}
