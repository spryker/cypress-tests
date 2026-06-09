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
    this.find({ searchQuery: params.query, interceptTableUrl: `**/store-gui/list/table**${params.query}**` }).then(
      ($storeRow) => {
        if (params.action === ActionEnum.edit) {
          cy.wrap($storeRow).find(this.repository.getEditButtonSelector()).should('exist').click();
        }

        if (params.action === ActionEnum.view) {
          cy.wrap($storeRow).find(this.repository.getViewButtonSelector()).should('exist').click();
        }
      }
    );
  };

  hasStore = (storeName: string): Cypress.Chainable<boolean> => {
    // Existence check only: register the intercept before typing and match on the
    // exact search value so we wait for the full-search response (not a partial
    // keystroke). Pass no expectedCount — never assert a band on a precondition.
    const searchInterceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/store-gui/list/table**', (req) => {
      if (req.query['search[value]'] === storeName) {
        req.alias = searchInterceptAlias;
      }
    });

    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(storeName);

    return cy
      .wait(`@${searchInterceptAlias}`, { timeout: 10000 })
      .its('response.body')
      .then((body) => cy.wrap(body.recordsFiltered > 0));
  };
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}
