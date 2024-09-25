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
    this.repository.getFirstSuggestedProduct().click();
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
}

interface SearchParams {
  query: string;
}
