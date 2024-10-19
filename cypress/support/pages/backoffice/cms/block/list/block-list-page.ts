import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { inject, injectable } from 'inversify';
import { BlockListRepository } from './block-list-repository';

@injectable()
@autoWired
export class BlockListPage extends BackofficePage {
  @inject(BlockListRepository) private repository: BlockListRepository;

  protected PAGE_URL = '/cms-block-gui/list-block';

  update = (params: UpdateParams): void => {
    const findParams = { query: params.query, expectedCount: 1 };

    this.find(findParams).then(($storeRow) => {
        cy.wrap($storeRow).as('row');
        cy.get('@row').find(this.repository.getEditButtonSelector()).should('exist').click()
    });
  };

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({ url: 'cms-block-gui/list-block/table**', expectedCount: params.expectedCount });

    return this.repository.getFirstTableRow();
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}

interface UpdateParams {
  query: string;
}
