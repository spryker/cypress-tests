import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage, ActionEnum } from '@pages/backoffice';
import { StockListRepository } from './stock-list-repository';

@injectable()
@autoWired
export class StockListPage extends BackofficePage {
  @inject(StockListRepository) private repository: StockListRepository;

  protected PAGE_URL = '/stock-gui/warehouse/list';

  update = (params: UpdateParams): void => {
    const findParams = { query: params.query, expectedCount: 1 };

    this.find(findParams).then(($stockRow) => {
      if (params.action === ActionEnum.edit) {
        cy.wrap($stockRow).find(this.repository.getEditButtonSelector()).should('exist').click();
      }

      if (params.action === ActionEnum.view) {
        cy.wrap($stockRow).find(this.repository.getViewButtonSelector()).should('exist').click();
      }
    });
  };

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({ url: '/stock-gui/warehouse/table**', expectedCount: params.expectedCount });

    return this.repository.getFirstTableRow();
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
