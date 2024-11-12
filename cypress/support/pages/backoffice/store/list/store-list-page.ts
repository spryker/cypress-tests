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
    this.find({searchQuery: params.query, tableUrl: '/store-gui/list/table**'}).then(($storeRow) => {
      if (params.action === ActionEnum.edit) {
        cy.wrap($storeRow).find(this.repository.getEditButtonSelector()).should('exist').click();
      }

      if (params.action === ActionEnum.view) {
        cy.wrap($storeRow).find(this.repository.getViewButtonSelector()).should('exist').click();
      }
    });
  };

  hasStoreByStoreName = (query: string): Cypress.Chainable<boolean> => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);

    return this.repository.getStoreDataTable().then((body) => {
      if (body.text().includes(query)) {
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

interface FindParams {
  query: string;
  expectedCount?: number;
}
