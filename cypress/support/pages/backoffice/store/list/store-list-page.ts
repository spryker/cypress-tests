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
      (getRow) => {
        if (!getRow) {
          return;
        }

        if (params.action === ActionEnum.edit) {
          getRow().find(this.repository.getEditButtonSelector()).click();
        }

        if (params.action === ActionEnum.view) {
          getRow().find(this.repository.getViewButtonSelector()).click();
        }
      }
    );
  };

  hasStore = (storeName: string): Cypress.Chainable<boolean> => {
    // Existence check only — read the real row count, never assert a band on a precondition.

    // Unique name for the request we want to wait on. cy.wait('@alias') below targets a
    // request by this name, so a fresh id keeps us from clashing with another table
    // intercept or a stale alias left by a previous retry of this hook.
    const searchInterceptAlias = this.faker.string.uuid();

    cy.intercept('GET', '/store-gui/list/table**', (req) => {
      // The field fires two table requests: an empty one when cleared, then one with the
      // full value once typing settles (the search is debounced — not one per keystroke).
      // Tag ONLY the full-store-name request so cy.wait() resolves on the real search
      // result, not the empty clear.
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
