import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpPage } from '../mp-page';
import { AgentDashboardRepository } from './agent-dashboard-repository';

@injectable()
@autoWired
export class AgentDashboardPage extends MpPage {
  @inject(AgentDashboardRepository) private repository: AgentDashboardRepository;

  protected PAGE_URL = '/agent-dashboard-merchant-portal-gui/merchant-users';

  getDashboardSidebarSelector = (): Cypress.Chainable => {
    return this.repository.getDashboardSidebarSelector();
  };

  assistMerchantUser = (query: string): void => {
    this.findMerchantUser(query).then((merchantUserRow) => {
      const button = merchantUserRow.find(this.repository.getAssistUserButtonSelector());

      if (button.length) {
        button.click();
        this.repository.getModalConfirmButton().click();
      }
    });
  };

  findMerchantUser = (query: string, counter: number = 1): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/agent-dashboard-merchant-portal-gui/merchant-users/table-data**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', counter);

    return this.repository.getFirstTableRow();
  };
}
