import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { AgentDashboardRepository } from './agent-dashboard-repository';

@injectable()
@autoWired
export class AgentDashboardPage extends MpPage {
  @inject(AgentDashboardRepository) private repository: AgentDashboardRepository;

  protected PAGE_URL = '/agent-dashboard-merchant-portal-gui/merchant-users';

  // The merchant-users dashboard loads its datatable via an async `table-data` request that writes the
  // (non-locking) session. If we navigate away before it finishes, that write can overwrite the CSRF token
  // freshly minted by the next page (MFA set-up) -> flaky "could not be activated". This opt-in variant
  // waits for the datatable request to complete so its session write is committed before we move on.
  // Kept separate from visit() so other agent-dashboard tests are not affected.
  visitAndWaitForTableData = (options?: Partial<Cypress.VisitOptions>): void => {
    cy.intercept('GET', '**/agent-dashboard-merchant-portal-gui/merchant-users/table-data**').as(
      'agentMerchantUsersTableData',
    );
    cy.visitMerchantPortal(this.PAGE_URL, options);
    cy.wait('@agentMerchantUsersTableData', { timeout: 10000 });
  };

  assist = (params: AssistParams): void => {
    const findParams = { query: params.query, expectedCount: 1 };

    this.find(findParams).then(($merchantUserRow) => {
      cy.wrap($merchantUserRow)
        .find(this.repository.getAssistUserButtonSelector())
        .should('exist')
        .click({ force: true });
      this.repository.getModalConfirmButton().click();
    });
  };

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query, { delay: 0 });
    cy.get(searchSelector).type('{enter}');

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

  logoutAgent = (): void => {
    this.repository.getUserMenu().click();
    cy.contains('a', 'Logout').click({ force: true });
  };
}

interface AssistParams {
  query: string;
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
