import { inject, injectable } from 'inversify';
import { autoProvide } from '../../utils/inversify/auto-provide';
import { MpAgentLoginUserScenario } from './mp-agent-login-user-scenario';
import { MpAgentDashboardPage } from '../../pages/mp/agent-dashboard/mp-agent-dashboard-page';

@injectable()
@autoProvide
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
