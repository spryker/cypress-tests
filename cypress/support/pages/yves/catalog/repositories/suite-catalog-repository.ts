import { injectable } from 'inversify';
import { CatalogRepository } from '../catalog-repository';
import * as Cypress from 'cypress';

@injectable()
export class SuiteCatalogRepository implements CatalogRepository {
  getSearchInput = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] input').first();
  getFirstSuggestedProduct = (): Cypress.Chainable => cy.get('[data-qa="component suggestion-product"] a').first();
  getSuggestedProductSelector = (): string => '[data-qa="component suggestion-product"]';
  getSearchButton = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] [type="submit"]:visible');
  getProductItemBlocks = (): Cypress.Chainable => cy.get('[data-qa="component product-item"]');
  getFirstProductItemBlockSelector = (): string => '[data-qa="component product-item"]:first';
  getProductItemBlockSelector = (): string => '[data-qa="component product-item"]';
  getViewButtonSelector = (): string => 'a:contains("View")';
  getItemBlockSearchQuery = (query: string): string => `span:contains("${query}")`;
  getSspAssetSelectorBlock = (): Cypress.Chainable => cy.get('[data-qa="component asset-selector"]');
  getSspAssetNameBlock = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-name"]');
  getSspAssetSelectorTriggerButton = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-trigger"]');
  getSspAssetOption = (name: string): Cypress.Chainable =>
    cy.get('[data-qa="component asset-option"]').filter(`:contains("${name}")`);
  getSspAssetOptionTriggerButtonSelector = (): string => '[data-qa="asset-option-trigger"]';

  getProductItemDefaultPriceSelector = (): string => 'span[class*="default-price"]';
  getProductItemOriginalPriceSelector = (): string => 'span[class*="original-price"]';

  getEnabledAddToCartButtonSelector = (): string => 'ajax-add-to-cart button:not([disabled])';
  selectColorSwatch = (swatchIdentifier: string): void => {
    cy.get(`[data-qa="component product-item"] product-item-color-selector button[style*="${swatchIdentifier}"]`)
      .first()
      .click();
  };

  getFoundItemsCounterSelector = (): string => '[data-qa="component sort"] strong';
  getFilterTitlesSelector = (): string => 'section[data-qa="component filter-section"] [class*="title"]';
  getFilterValueCheckboxSelector = (filterName: string, filterValue: string): string =>
    `input[type="checkbox"][name="${filterName}[]"][value="${filterValue}"]`;
  getApplyFiltersButtonSelector = (): string => 'button.js-catalog__trigger.button--small';
  getSortSelectSelector = (): string => 'select[name="sort"]';
  getPaginationStepSelector = (): string => 'a[class*="pagination__step"]';
}
