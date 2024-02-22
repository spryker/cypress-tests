import { inject, injectable } from 'inversify';
import { autoWired } from '../../utils/inversify/auto-wired';
import { AgentLoginPage } from '../../pages/yves/agent-login/agent-login-page';

@injectable()
@autoWired
export class AgentLoginScenario {
  constructor(@inject(AgentLoginPage) private loginPage: AgentLoginPage) {}

  public execute = (user: User): void => {
    cy.visit(this.loginPage.PAGE_URL);
    this.loginPage.login(user);
  };
}
