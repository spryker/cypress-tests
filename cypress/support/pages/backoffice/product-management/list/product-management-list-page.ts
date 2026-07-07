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
    cy.wrap($row).find(this.repository.getEditButtonSelector()).as('editBtn');
    cy.get('@editBtn').click();
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
      this.repository.getFilterSearchInput().clear().invoke('val', params.query).trigger('input');
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

  applySearchQuery = (query: string, callback: () => void): void => {
    this.repository
      .getFilterSearchInput()
      .clear()
      .invoke('val', query)
      .then(() => {
        this.interceptTable(
          {
            url: '**/product-management/index/table**',
            expectedCount: 0,
          },
          callback
        );
      });
  };

  update = (params: UpdateParams): void => {
    this.find({
      searchQuery: params.query,
      interceptTableUrl: `**/product-management/index/table**`,
      expectedCount: 1,
    }).then((getRow) => {
      if (!getRow) {
        return;
      }

      if (params.action === ActionEnum.edit) {
        getRow().find(this.repository.getEditButtonSelector()).click();
      }

      if (params.action === ActionEnum.approve) {
        getRow().find(this.repository.getApproveButtonSelector()).click();
      }

      if (params.action === ActionEnum.deny) {
        getRow().find(this.repository.getDenyButtonSelector()).click();
      }
    });
  };

  getNoTableRecordsText = (): string => this.repository.getNoTableRecordsText();
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
