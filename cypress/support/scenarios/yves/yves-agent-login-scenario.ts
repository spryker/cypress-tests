import { inject, injectable } from 'inversify';
import { autoWired } from '../../utils/inversify/auto-wired';
import { YvesAgentLoginPage } from '../../pages/yves/agent-login/yves-agent-login-page';

@injectable()
@autoWired
export class YvesAgentLoginScenario {
  constructor(@inject(YvesAgentLoginPage) private loginPage: YvesAgentLoginPage) {}

  public execute = (user: User): void => {
    cy.visit(this.loginPage.PAGE_URL);
    this.loginPage.login(user);
  };
}
