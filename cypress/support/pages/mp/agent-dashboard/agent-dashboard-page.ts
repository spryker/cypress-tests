import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { AgentDashboardRepository } from './agent-dashboard-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { MpPage } from '../mp-page';

@injectable()
@autoWired
export class AgentDashboardPage extends MpPage {
  protected PAGE_URL: string = '/agent-dashboard-merchant-portal-gui/merchant-users';

  constructor(@inject(AgentDashboardRepository) private repository: AgentDashboardRepository) {
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

  public findMerchantUser = (query: string, counter: number = 1): Cypress.Chainable => {
    cy.get(this.repository.getSearchSelector()).clear().type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/agent-dashboard-merchant-portal-gui/merchant-users/table-data**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', counter);

    return this.repository.getFirstTableRow();
  };
}
