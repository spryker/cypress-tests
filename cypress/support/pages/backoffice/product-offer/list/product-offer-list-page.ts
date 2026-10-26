import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductOfferListRepository } from './product-offer-list-repository';

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

  search = (query: string): void => {
    cy.get(this.repository.getSearchFieldSelector()).clear();
    cy.get(this.repository.getSearchFieldSelector()).type(query);
  };

  clickViewButton = (rowIndex = 0): Cypress.Chainable => {
    return this.getTableRows().eq(rowIndex).find(this.repository.getViewButtonSelector()).click();
  };

  clickApproveButton = (rowIndex = 0): Cypress.Chainable => {
    return this.getTableRows().eq(rowIndex).find(this.repository.getApproveButtonSelector()).click();
  };

  clickDenyButton = (rowIndex = 0): Cypress.Chainable => {
    return this.getTableRows().eq(rowIndex).find(this.repository.getDenyButtonSelector()).click();
  };

  // The merchant switcher is a plain select that reloads the table through its own GET form.
  filterByMerchant = (params: FilterByMerchantParams): void => {
    this.repository.getMerchantFilterSelect().select(String(params.idMerchant));
  };

  findOffer = (params: FindOfferParams): Cypress.Chainable => {
    return this.find({
      interceptTableUrl: `**${this.POST_URL}**`,
      searchQuery: params.query,
    }).then((getRow) => (getRow ? getRow() : cy.wrap(null)));
  };

  getReference = (rowIndex = 0): Cypress.Chainable<string> => {
    return this.getTableRows().eq(rowIndex).find(this.repository.getReferenceColumnSelector()).invoke('text');
  };
}

interface FilterByMerchantParams {
  idMerchant: number;
}

interface FindOfferParams {
  query: string;
}
