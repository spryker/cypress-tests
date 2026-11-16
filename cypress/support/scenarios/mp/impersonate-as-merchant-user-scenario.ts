import { AgentDashboardPage, AgentLoginPage, DashboardPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class ImpersonateAsMerchantUserScenario {
  @inject(AgentLoginPage) private agentLoginPage: AgentLoginPage;
  @inject(AgentDashboardPage) private mpAgentDashboardPage: AgentDashboardPage;
  @inject(DashboardPage) private mpDashboardPage: DashboardPage;

  execute = (params: ExecuteParams): void => {
    this.agentLoginPage.visit();

    cy.intercept('POST', '**/login_check').as('impersonateLogin');
    this.agentLoginPage.login({ username: params.username, password: params.password });
    cy.wait('@impersonateLogin');

    this.mpAgentDashboardPage.visit();
    const dashboardRequestAlias = this.mpDashboardPage.interceptRequest();
    this.mpAgentDashboardPage.assist({ query: params.query });
    cy.wait(`@${dashboardRequestAlias}`);
  };
}

interface ExecuteParams {
  username: string;
  password: string;
  query: string;
}
