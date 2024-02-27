import { inject, injectable } from 'inversify';
import { autoWired } from '../../utils/inversify/auto-wired';
import { AgentDashboardPage, AgentLoginPage } from '../../pages/mp';

@injectable()
@autoWired
export class ImpersonateAsMerchantUserScenario {
  constructor(
    @inject(AgentLoginPage) private agentLoginPage: AgentLoginPage,
    @inject(AgentDashboardPage) private mpAgentDashboardPage: AgentDashboardPage
  ) {}

  public execute = (username: string, password: string, merchantUsername: string): void => {
    this.agentLoginPage.visit();
    this.agentLoginPage.login(username, password);

    this.mpAgentDashboardPage.visit();
    this.mpAgentDashboardPage.assistMerchantUser(merchantUsername);
  };
}
