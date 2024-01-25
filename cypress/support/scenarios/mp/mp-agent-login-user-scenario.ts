import { inject, injectable } from 'inversify';
import { autoProvide } from '../../utils/inversify/auto-provide';
import { MpAgentLoginPage } from '../../pages/mp/agent-login/mp-agent-login-page';

@injectable()
@autoProvide
export class MpAgentLoginUserScenario {
  constructor(@inject(MpAgentLoginPage) private loginPage: MpAgentLoginPage) {}

  public execute = (user: User): void => {
    cy.visitMerchantPortal(this.loginPage.PAGE_URL);
    this.loginPage.login(user);
  };
}
