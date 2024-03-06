import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { AgentLoginPage } from '../../pages/mp';

@injectable()
@autoWired
export class MerchantAgentLoginUserScenario {
  @inject(AgentLoginPage) private agentLoginPage: AgentLoginPage;

  execute = (username: string, password: string): void => {
    cy.session([username, password], () => {
      this.agentLoginPage.visit();
      this.agentLoginPage.login(username, password);
    });
  };
}
