import { inject, injectable } from 'inversify';
import { MpAgentLoginPage } from '../../pages/mp/agent-login/mp-agent-login-page';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class MpAgentLoginUserScenario {
  constructor(@inject(MpAgentLoginPage) private loginPage: MpAgentLoginPage) {}

  public execute = (user: User): void => {
    cy.visitMerchantPortal(this.loginPage.PAGE_URL);
    this.loginPage.login(user);
  };
}
