import { inject, injectable } from 'inversify';
import { autoWired } from '../../utils/inversify/auto-wired';
import { AgentDashboardPage } from '../../pages/mp';
import { MerchantAgentLoginUserScenario } from './merchant-agent-login-user-scenario';

@injectable()
@autoWired
export class ImpersonateAsMerchantUserScenario {
  constructor(
    @inject(MerchantAgentLoginUserScenario) private merchantAgentLoginUserScenario: MerchantAgentLoginUserScenario,
    @inject(AgentDashboardPage) private mpAgentDashboardPage: AgentDashboardPage
  ) {}

  public execute = (username: string, password: string, merchantUsername: string): void => {
    this.merchantAgentLoginUserScenario.execute(username, password);

    this.mpAgentDashboardPage.assistMerchantUser(merchantUsername);
  };
}
