import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { AgentLoginPage } from '../../pages/yves';

@injectable()
@autoWired
export class AgentLoginScenario {
  constructor(@inject(AgentLoginPage) private loginPage: AgentLoginPage) {}

  public execute = (username: string, password: string): void => {
    cy.session([username, password], () => {
      this.loginPage.visit();
      this.loginPage.login(username, password);
    });
  };
}
