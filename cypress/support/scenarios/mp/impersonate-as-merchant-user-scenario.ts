import { AgentDashboardPage, AgentLoginPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class ImpersonateAsMerchantUserScenario {
  @inject(AgentLoginPage) private agentLoginPage: AgentLoginPage;
  @inject(AgentDashboardPage) private mpAgentDashboardPage: AgentDashboardPage;

  execute = (params: ExecuteParams): void => {
    this.agentLoginPage.visit();

    cy.intercept('POST', '**/login_check').as('impersonateLogin');
    this.agentLoginPage.login({ username: params.username, password: params.password });
    cy.wait('@impersonateLogin');

    this.mpAgentDashboardPage.visit();
    this.mpAgentDashboardPage.assist({ query: params.query });
  };
}

interface ExecuteParams {
  username: string;
  password: string;
  query: string;
}
