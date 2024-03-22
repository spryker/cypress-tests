import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { AgentDashboardRepository } from './agent-dashboard-repository';

@injectable()
@autoWired
export class AgentDashboardPage extends MpPage {
  @inject(AgentDashboardRepository) private repository: AgentDashboardRepository;

  protected PAGE_URL = '/agent-dashboard-merchant-portal-gui/merchant-users';

  assist = (params: AssistParams): void => {
    const findParams = { query: params.query, expectedCount: 1 };

    this.find(findParams).then(($merchantUserRow) => {
      cy.wrap($merchantUserRow).find(this.repository.getAssistUserButtonSelector()).should('exist').click();
      this.repository.getModalConfirmButton().click();
    });
  };

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({
      url: '/agent-dashboard-merchant-portal-gui/merchant-users/table-data**',
      expectedCount: params.expectedCount,
    });

    return this.repository.getFirstTableRow();
  };

  getDashboardSidebarSelector = (): Cypress.Chainable => {
    return this.repository.getDashboardSidebarSelector();
  };

  getEndUserAssistanceSelector = (): string => {
    return this.repository.getEndUserAssistanceSelector();
  };

  getLogoutAgentSelector = (): string => {
    return this.repository.getLogoutAgentSelector();
  };
}

interface AssistParams {
  query: string;
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
