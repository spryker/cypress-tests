import { inject, injectable } from 'inversify';
import { autoWired } from '../../utils/inversify/auto-wired';
import { AgentLoginPage } from '../../pages/yves';

@injectable()
@autoWired
export class AgentLoginScenario {
  constructor(@inject(AgentLoginPage) private loginPage: AgentLoginPage) {}

  public execute = (username: string, password: string): void => {
    cy.resetYvesCookies();

    cy.session([username, password], () => {
      this.loginPage.visit();
      this.loginPage.login(username, password);
    });
  };
}
