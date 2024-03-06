import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { AgentLoginPage } from '../../pages/mp';

@injectable()
@autoWired
export class MerchantAgentLoginUserScenario {
  constructor(@inject(AgentLoginPage) private agentLoginPage: AgentLoginPage) {}

  public execute = (username: string, password: string): void => {
    cy.session([username, password], () => {
      this.agentLoginPage.visit();
      this.agentLoginPage.login(username, password);
    });
  };
}
