import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage, ActionEnum } from '@pages/backoffice';
import { StoreListRepository } from './store-list-repository';

@injectable()
@autoWired
export class StoreListPage extends BackofficePage {
  @inject(StoreListRepository) private repository: StoreListRepository;

  protected PAGE_URL = '/store-gui/list';

  createStore = (): void => {
    this.repository.getCreateStoreButton().click();
  };

  update = (params: UpdateParams): void => {
    this.find({ searchQuery: params.query, interceptTableUrl: `**/store-gui/list/table**${params.query}**` }).then(($storeRow) => {
      if (params.action === ActionEnum.edit) {
        cy.wrap($storeRow).find(this.repository.getEditButtonSelector()).should('exist').click();
      }

      if (params.action === ActionEnum.view) {
        cy.wrap($storeRow).find(this.repository.getViewButtonSelector()).should('exist').click();
      }
    });
  };

  hasStore = (storeName: string): Cypress.Chainable<boolean> => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(storeName);

    return this.interceptTable({ url: '/store-gui/list/table**', expectedCount: 0 }).then((recordsFiltered: number) => {
      if (recordsFiltered > 0) {
        return cy.wrap(true);
      } else {
        return cy.wrap(false);
      }
    });
  };
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}
