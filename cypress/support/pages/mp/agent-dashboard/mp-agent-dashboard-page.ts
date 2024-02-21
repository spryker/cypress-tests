import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpAgentDashboardRepository } from './mp-agent-dashboard-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class MpAgentDashboardPage extends AbstractPage {
  public PAGE_URL: string = '/agent-dashboard-merchant-portal-gui/merchant-users';

  constructor(@inject(MpAgentDashboardRepository) private repository: MpAgentDashboardRepository) {
    super();
  }

  public getDashboardSidebarSelector = (): Cypress.Chainable => {
    return this.repository.getDashboardSidebarSelector();
  };

  public assistMerchantUser = (query: string): void => {
    this.findMerchantUser(query).then((merchantUserRow) => {
      const button = merchantUserRow.find(this.repository.getAssistUserButtonSelector());

      if (button.length) {
        button.click();
        this.repository.getModalConfirmButton().click();
      }
    });
  };

  public findMerchantUser = (query: string): Cypress.Chainable => {
    cy.get(this.repository.getSearchSelector()).clear().type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/agent-dashboard-merchant-portal-gui/merchant-users/table-data**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', 1);

    return this.repository.getFirstTableRow();
  };
}
