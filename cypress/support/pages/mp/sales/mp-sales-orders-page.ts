import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpSalesOrdersRepository } from './mp-sales-orders-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { MpPage } from '../mp-page';

@injectable()
@autoWired
export class MpSalesOrdersPage extends MpPage {
  protected PAGE_URL: string = '/sales-merchant-portal-gui/orders';

  constructor(@inject(MpSalesOrdersRepository) private repository: MpSalesOrdersRepository) {
    super();
  }

  public findOrder = (query: string): Cypress.Chainable => {
    cy.get(this.repository.getSearchSelector()).clear().type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/sales-merchant-portal-gui/orders/table-data**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  public cancelOrder = (query: string): void => {
    this.findOrder(query).click();
    this.repository.getDrawer().find('button:contains("Cancel")').click();
  };
}
