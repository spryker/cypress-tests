import { AgentLoginPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantAgentLoginUserScenario {
  @inject(AgentLoginPage) private agentLoginPage: AgentLoginPage;

  execute = (params: ExecuteParams): void => {
    cy.session([params.username, params.password], () => {
      this.agentLoginPage.visit();
      this.agentLoginPage.login(params);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);
    });
  };
}

interface ExecuteParams {
  username: string;
  password: string;
}
