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

  // Types the query and waits for the suggestion response without following it, so a spec can assert
  // whether a product is offered at all. The results page is not usable for that: it does not list a
  // freshly created product even when the suggestion endpoint already does.
  searchSuggestionsFor = (params: SearchParams): void => {
    if (this.isRepository('b2c', 'b2c-mp')) {
      cy.get('.header__search-open').click();
    }

    this.repository.getSearchInput().clear().invoke('val', params.query);
    cy.intercept('**/search/suggestion**').as('searchSuggestion');
    cy.wait('@searchSuggestion');
  };

  getSuggestedProducts = (): Cypress.Chainable => cy.get(this.repository.getSuggestedProductSelector());

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
    // Resolved in one query. Chaining find() off a block reference breaks with a detached subject
    // when the results page is still settling, which it is right after a reload-until-found loop.
    cy.get(
      `${this.repository.getProductItemBlockSelector()}:contains("${params.productName}") ${this.repository.getViewButtonSelector()}`
    )
      .first()
      .click();
  };

  getProductItemBlocks = (): Cypress.Chainable => this.repository.getProductItemBlocks();

  // A sku query returns a single card, which is why the first block is the product under test — the
  // same narrowing the Robot suite used before this spec existed.
  getFirstProductItemDefaultPrice = (): Cypress.Chainable =>
    this.repository.getProductItemBlocks().first().find(this.repository.getProductItemDefaultPriceSelector());

  getFirstProductItemOriginalPrice = (): Cypress.Chainable =>
    this.repository.getProductItemBlocks().first().find(this.repository.getProductItemOriginalPriceSelector());

  getFirstProductItemEnabledAddToCartButton = (): Cypress.Chainable =>
    this.repository.getProductItemBlocks().first().find(this.repository.getEnabledAddToCartButtonSelector());

  // The quick-add button has no form behind it. It does nothing until its webcomponent attaches the
  // click handler in init(), and a click that lands before that is swallowed — no request, no error,
  // no cart change. isMounted is what the component sets once the handler is on, and waiting for the
  // add-ajax response is what proves the click was not lost.
  quickAddFirstProductItemToCart = (): void => {
    cy.intercept('**/cart/add-ajax/**').as('quickAddToCart');

    this.getFirstProductItemEnabledAddToCartButton()
      .closest('ajax-add-to-cart')
      .should(($component) => {
        expect($component[0]).to.have.property('isMounted', true);
      });

    this.getFirstProductItemEnabledAddToCartButton().click();
    cy.wait('@quickAddToCart').its('response.statusCode').should('eq', 200);
  };

  selectFirstProductItemColor = (params: SelectFirstProductItemColorParams): void => {
    this.repository.selectColorSwatch(params.swatchIdentifier);
  };

  getFoundItemsCounter = (): Cypress.Chainable => cy.get(this.repository.getFoundItemsCounterSelector());

  getFilterTitles = (): Cypress.Chainable => cy.get(this.repository.getFilterTitlesSelector());

  applyFilterValue = (params: ApplyFilterValueParams): void => {
    cy.get(this.repository.getFilterValueCheckboxSelector(params.filterName, params.filterValue)).check({
      force: true,
    });

    this.submitCatalogChange();
  };

  sortBy = (params: SortByParams): void => {
    cy.get(this.repository.getSortSelectSelector()).select(params.sortLabel, { force: true });

    this.submitCatalogChange();
  };

  openCatalogPage = (params: OpenCatalogPageParams): void => {
    cy.contains(this.repository.getPaginationStepSelector(), String(params.pageNumber)).first().click();
  };

  // Some themes apply a facet or sort change on the control itself, others only once the catalog
  // trigger is pressed. Clicking it when it is there covers both without waiting on one that is not.
  private submitCatalogChange = (): void => {
    this.getBody().then(($body) => {
      if ($body.find(this.repository.getApplyFiltersButtonSelector()).length) {
        cy.get(this.repository.getApplyFiltersButtonSelector()).first().click();
      }
    });
  };

  openFirstProductDetailPageFromResults = (): void => {
    cy.get(`${this.repository.getFirstProductItemBlockSelector()} ${this.repository.getViewButtonSelector()}`)
      .first()
      .click();
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

interface ApplyFilterValueParams {
  filterName: string;
  filterValue: string;
}

interface SortByParams {
  sortLabel: string;
}

interface OpenCatalogPageParams {
  pageNumber: number;
}

interface SelectFirstProductItemColorParams {
  swatchIdentifier: string;
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
