import { injectable } from 'inversify';
import { ProductComparisonRepository } from '../product-comparison-repository';
import * as Cypress from 'cypress';

@injectable()
export class SuiteProductComparisonRepository implements ProductComparisonRepository {
  getDeleteFromComparisonButton = (sku: string): Cypress.Chainable =>
    cy.get(`comparison-product-toggler[sku="${sku}"] > button`);
  getClearComparisonListButton = (): Cypress.Chainable => cy.get('[data-qa="clear-compare-list-button"]');
  getComparisonPageNavigationLinkSelector = (): string => 'div.header__navigation-top comparison-link > a';
  getProductItemSelector = (): string => '[data-qa="component product-item"]';
  getProductComparisonListIsEmptyMessage = (): string => 'Comparison list is empty.';
  getComparisonTableRowSelector = (): string => '[data-qa="component comparison-table"] .comparison-table__list-row';
}
