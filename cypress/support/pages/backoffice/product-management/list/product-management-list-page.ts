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

  getTableRows = (): Cypress.Chainable => this.repository.getTableRows();

  getResetButton = (): Cypress.Chainable => this.repository.getResetButton();

  applyFilters = (params: ApplyFiltersParams): void => {
    if (params.query) {
      this.repository.getFilterSearchInput().type(params.query);
    }

    if (params.status) {
      this.repository.getFilterStatusSelect().click();
      this.repository.getSelectOption().contains('Active').click();
    }

    if (params.stores) {
      params.stores.forEach((store) => {
        this.repository.getFilterStoresSelect().click();
        this.repository.getSelectOption().contains(store).click();
      });
    }

    this.repository.getFilterButton().click();
  };

  update = (params: UpdateParams): void => {
    this.find({ searchQuery: params.query, tableUrl: '/product-management/index/table**', expectedCount: 1 }).then(
      ($productRow) => {
        if (params.action === ActionEnum.edit) {
          cy.wrap($productRow).find(this.repository.getEditButtonSelector()).as('editButton');
          cy.get('@editButton').click();
        }
        if (params.action === ActionEnum.approve) {
          cy.wrap($productRow).find(this.repository.getApproveButtonSelector()).as('approveButton');
          cy.get('@approveButton').click();
        }
        if (params.action === ActionEnum.deny) {
          cy.wrap($productRow).find(this.repository.getDenyButtonSelector()).as('denyButton');
          cy.get('@denyButton').click();
        }
      }
    );
  };
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}

interface ApplyFiltersParams {
  status?: string;
  query?: string;
  stores?: string[];
}

export enum StatusEnum {
  active = 'active',
  deactivated = 'deactivated',
}
interface IsAssignedParams {
  row: JQuery<HTMLElement>;
  storeName?: string;
}
