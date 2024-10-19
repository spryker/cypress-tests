import { injectable } from 'inversify';
import { CatalogRepository } from '../catalog-repository';
import * as Cypress from 'cypress';

@injectable()
export class SuiteCatalogRepository implements CatalogRepository {
  getSearchInput = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] input').first();
  getFirstSuggestedProduct = (): Cypress.Chainable =>
    cy.get('[data-qa="component suggestion-product"] a').first();
  getSearchButton = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] [type="submit"]:visible');
  getProductItemBlocks = (): Cypress.Chainable => cy.get('[data-qa="component product-item"]');
  getFirstProductItemBlockSelector = (): string => '[data-qa="component product-item"]:first';
  getViewButtonSelector = (): string => 'a:contains("View")';
  getItemBlockSearchQuery = (query: string): string => `span:contains("${query}")`;
}
