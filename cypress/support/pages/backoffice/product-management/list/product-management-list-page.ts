import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { ProductManagementListRepository } from './product-management-list-repository';

@injectable()
@autoWired
export class ProductManagementListPage extends BackofficePage {
  @inject(ProductManagementListRepository) private repository: ProductManagementListRepository;

  protected PAGE_URL = '/product-management';

  clickEditAction = ($row: JQuery<HTMLElement>): void => {
    cy.wrap($row).find(this.repository.getEditButtonSelector()).should('exist').click();
  };

  rowIsAssignedToStore = (params: IsAssignedParams): boolean => {
    if (typeof params.storeName !== 'string') {
      return false;
    }

    return params.row.find(this.repository.getStoreCellSelector()).text().includes(params.storeName);
  };

  update = (params: UpdateParams): void => {
    const findParams = { query: params.query, expectedCount: 1 };

    this.find(findParams).then(($productRow) => {
      if (params.action === ActionEnum.edit) {
        cy.wrap($productRow).find(this.repository.getEditButtonSelector()).as('editButton');
        cy.get('@editButton').click();
      }
    });
  };

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({ url: '/product-management/index/table**', expectedCount: params.expectedCount });

    return this.repository.getFirstTableRow();
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}

interface IsAssignedParams {
  row: JQuery<HTMLElement>;
  storeName?: string;
}
