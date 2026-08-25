import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CatalogRepository } from './catalog-repository';

@injectable()
@autoWired
export class CatalogPage extends YvesPage {
  @inject(REPOSITORIES.CatalogRepository) private repository: CatalogRepository;

  protected PAGE_URL = '/search';

  searchProductFromSuggestions = (params: SearchParams): void => {
    if (this.isRepository('b2c', 'b2c-mp')) {
      cy.get('.header__search-open').click();
    }

    this.repository.getSearchInput().clear().invoke('val', params.query);
    cy.intercept('**/search/suggestion**').as('searchSuggestion');
    cy.wait('@searchSuggestion').then(() => {
      this.repository.getFirstSuggestedProduct().click();
    });
  };

  search = (params: SearchParams): void => {
    if (this.isRepository('b2c', 'b2c-mp')) {
      cy.get('.header__search-open').click();
    }

    this.repository.getSearchInput().clear().type(`${params.query}{enter}`);

    cy.url().then((url) => {
      cy.reloadUntilFound(
        url,
        this.repository.getItemBlockSearchQuery(params.query), // Is working with product's name only
        this.repository.getFirstProductItemBlockSelector(),
        25,
        5000
      );

      this.repository.getProductItemBlocks().first().find(this.repository.getViewButtonSelector()).click();
    });
  };

  searchForProducts = (params: SearchParams): void => {
    if (this.isRepository('b2c', 'b2c-mp')) {
      cy.get('.header__search-open').click();
    }

    this.repository.getSearchInput().clear().type(`${params.query}{enter}`);

    cy.url().then((url) => {
      cy.reloadUntilFound(url, this.repository.getFirstProductItemBlockSelector(), 'body', 25, 5000);
    });
  };

  // The suggestion dropdown ranks by completion rather than by exact sku, so a sku query can put a
  // different product first. Opening the detail page from the result blocks keeps it exact.
  openProductDetailPageFromResults = (params: OpenProductDetailPageFromResultsParams): void => {
    this.repository
      .getProductItemBlocks()
      .filter(`:contains("${params.productName}")`)
      .first()
      .find(this.repository.getViewButtonSelector())
      .click();
  };

  getProductItemBlocks = (): Cypress.Chainable => this.repository.getProductItemBlocks();

  // A sku query returns a single card, which is why the first block is the product under test — the
  // same narrowing the Robot suite used before this spec existed.
  getFirstProductItemDefaultPrice = (): Cypress.Chainable =>
    this.repository.getProductItemBlocks().first().find(this.repository.getProductItemDefaultPriceSelector());

  getFirstProductItemOriginalPrice = (): Cypress.Chainable =>
    this.repository.getProductItemBlocks().first().find(this.repository.getProductItemOriginalPriceSelector());

  openFirstProductDetailPageFromResults = (): void => {
    this.repository.getProductItemBlocks().first().find(this.repository.getViewButtonSelector()).click();
  };

  getSspAssetSelectorBlock = (): Cypress.Chainable => this.repository.getSspAssetSelectorBlock();

  getSspAssetNameBlock = (): Cypress.Chainable => this.repository.getSspAssetNameBlock();

  selectSspAsset = (params: SelectSspAssetParams): void => {
    this.repository.getSspAssetSelectorTriggerButton().click();

    this.repository
      .getSspAssetOption(params.name)
      .find(this.repository.getSspAssetOptionTriggerButtonSelector())
      .click();
  };
}

interface OpenProductDetailPageFromResultsParams {
  productName: string;
}

interface SearchParams {
  query: string;
}

interface SelectSspAssetParams {
  name: string;
}
