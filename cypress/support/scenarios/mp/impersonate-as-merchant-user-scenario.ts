import { AgentDashboardPage, AgentLoginPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class ImpersonateAsMerchantUserScenario {
  @inject(AgentLoginPage) private agentLoginPage: AgentLoginPage;
  @inject(AgentDashboardPage) private mpAgentDashboardPage: AgentDashboardPage;

  public execute = (username: string, password: string, merchantUsername: string): void => {
    this.agentLoginPage.visit();
    this.agentLoginPage.login(username, password);

    this.mpAgentDashboardPage.visit();
    this.mpAgentDashboardPage.assistMerchantUser(merchantUsername);
  };
}
