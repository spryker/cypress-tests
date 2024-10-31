import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage, ActionEnum } from '@pages/backoffice';
import { StockListRepository } from './stock-list-repository';

@injectable()
@autoWired
export class StockListPage extends BackofficePage {
  @inject(StockListRepository) private repository: StockListRepository;

  protected PAGE_URL = '/stock-gui/warehouse/list';

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

    this.find(findParams).then(($stockRow) => {
      if (params.action === ActionEnum.edit) {
        this.clickEditAction($stockRow);
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

      return this.interceptTable(
        { url: '/stock-gui/warehouse/table**', expectedCount: params.expectedCount },
        () => this.repository.getFirstTableRow()
    );
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
interface IsAssignedParams {
  row: JQuery<HTMLElement>;
  storeName?: string;
}
