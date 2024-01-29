import { inject, injectable } from 'inversify';
import { MpAgentLoginUserScenario } from './mp-agent-login-user-scenario';
import { MpAgentDashboardPage } from '../../pages/mp/agent-dashboard/mp-agent-dashboard-page';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class ImpersonateAsMerchantUserScenario {
  constructor(
    @inject(MpAgentLoginUserScenario) private mpAgentLoginUserScenario: MpAgentLoginUserScenario,
    @inject(MpAgentDashboardPage) private mpAgentDashboardPage: MpAgentDashboardPage
  ) {}

  public execute = (merchantAgentUser: User, merchantUsername: string): void => {
    this.mpAgentLoginUserScenario.execute(merchantAgentUser);

    this.mpAgentDashboardPage.assistMerchantUser(merchantUsername);
  };
}
