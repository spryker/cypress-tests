import { injectable } from 'inversify';
import { CatalogRepository } from '../catalog-repository';
import * as Cypress from 'cypress';

@injectable()
export class B2bMpCatalogRepository implements CatalogRepository {
  getSearchInput = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] input:visible').first();
  getFirstSuggestedProduct = (): Cypress.Chainable => cy.get('[data-qa="component suggestion-product"] a').first();
  getSearchButton = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] [type="submit"]:visible');
  getProductItemBlocks = (): Cypress.Chainable => cy.get('[data-qa="component product-item"]');
  getFirstProductItemBlockSelector = (): string => '[data-qa="component product-item"]:first';
  getViewButtonSelector = (): string => 'a:contains("View")';
  getItemBlockSearchQuery = (query: string): string => `a:contains("${query}")`;
  getSspAssetSelectorBlock = (): Cypress.Chainable => cy.get('[data-qa="component asset-selector"]');
  getSspAssetNameBlock = (): Cypress.Chainable => cy.get('[data-qa="asset-selector-name"]');
  getSspAssetSelectorTriggerButton = (): Cypress.Chainable =>
    cy.get('[data-qa="asset-selector-trigger"]').filter(':visible');
  getSspAssetOption = (name: string): Cypress.Chainable =>
    cy.get('[data-qa="component asset-option"]').filter(':visible').filter(`:contains("${name}")`);
  getSspAssetOptionTriggerButtonSelector = (): string => '[data-qa="asset-option-trigger"]';

  getProductItemDefaultPriceSelector = (): string => 'span[class*="default-price"]';
  getProductItemOriginalPriceSelector = (): string => 'span[class*="original-price"]';

  getEnabledAddToCartButtonSelector = (): string => 'ajax-add-to-cart button:not([disabled])';
  selectColorSwatch = (swatchIdentifier: string): void => {
    cy.get('[data-qa="component product-item"] product-item-color-selector')
      .first()
      .contains('[class*="tooltip"]', swatchIdentifier)
      .parents('button')
      .first()
      .trigger('mouseover');
  };

  getFoundItemsCounterSelector = (): string => '[class*="catalog-header__count"]';
  getFilterTitlesSelector = (): string => 'filter-section [class*="filter-section__item-title"]';
  getFilterValueCheckboxSelector = (filterName: string, filterValue: string): string =>
    `input[type="checkbox"][name="${filterName}[]"][value="${filterValue}"]`;
  getApplyFiltersButtonSelector = (): string => 'button.js-catalog__trigger.button--small';
  getSortSelectSelector = (): string => 'select[name="sort"]';
  getPaginationStepSelector = (): string => 'a[class*="pagination__step"]';
}
