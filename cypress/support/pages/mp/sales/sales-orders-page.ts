import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { SalesOrdersRepository } from './sales-orders-repository';

@injectable()
@autoWired
export class SalesOrdersPage extends MpPage {
  @inject(SalesOrdersRepository) private repository: SalesOrdersRepository;

  protected PAGE_URL = '/sales-merchant-portal-gui/orders';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({
      url: '/sales-merchant-portal-gui/orders/table-data**',
      expectedCount: params.expectedCount,
    });

    return this.repository.getFirstTableRow();
  };

  cancel = (params: CancelParams): void => {
    this.find({ query: params.query }).click({ force: true });
    this.repository.getDrawer().find(this.repository.getCancelButtonSelector()).click();
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}

interface CancelParams {
  query: string;
}
