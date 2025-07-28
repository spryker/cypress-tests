import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductOfferListRepository } from './product-offer-list-repository';

interface FindParams {
  searchQuery: string;
  tableUrl: string;
}

@injectable()
@autoWired
export class ProductOfferListPage extends BackofficePage {
  @inject(ProductOfferListRepository) private repository: ProductOfferListRepository;

  protected PAGE_URL = '/product-offer-gui/list';
  protected POST_URL = '/product-offer-gui/list/table';

  getCreateButton = (): Cypress.Chainable => {
    return cy.get(this.repository.getCreateButtonSelector());
  };

  getTableRows = (): Cypress.Chainable => {
    return cy.get(this.repository.getTableRowsSelector());
  };

  getTableEditButton = (row: number): Cypress.Chainable => {
    return this.getTableRows().eq(row).get(this.repository.getEditButtonSelector());
  };

  /**
   * Search for a product offer using the search field
   * @param query - The search query (SKU or reference)
   */
  search = (query: string): Cypress.Chainable => {
    return cy.get(this.repository.getSearchFieldSelector()).clear().type(query);
  };

  /**
   * Click the view button for a specific row
   * @param rowIndex - The row index (default: 0 for first row)
   */
  clickViewButton = (rowIndex: number = 0): Cypress.Chainable => {
    return this.getTableRows().eq(rowIndex).find(this.repository.getViewButtonSelector()).click();
  };

  /**
   * Get the reference from a specific row
   * @param rowIndex - The row index (default: 0 for first row)
   */
  getReference = (rowIndex: number = 0): Cypress.Chainable<string> => {
    return this.getTableRows().eq(rowIndex).find(this.repository.getReferenceColumnSelector()).invoke('text');
  };

  /**
   * Find a product offer and click its view button
   * @param searchQuery - The search query (SKU or reference)
   */
  findAndView = (searchQuery: string): Cypress.Chainable => {
    this.find({
      searchQuery,
      tableUrl: '**/product-offer-gui/list/table**',
    });
    return this.clickViewButton();
  };
}
