import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpPage } from '../mp-page';
import { SalesOrdersRepository } from './sales-orders-repository';

@injectable()
@autoWired
export class SalesOrdersPage extends MpPage {
  @inject(SalesOrdersRepository) private repository: SalesOrdersRepository;

  protected PAGE_URL = '/sales-merchant-portal-gui/orders';

  findOrder = (query: string): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/sales-merchant-portal-gui/orders/table-data**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  cancelOrder = (query: string): void => {
    this.findOrder(query).click();
    this.repository.getDrawer().find('button:contains("Cancel")').click();
  };
}
