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
    });
  };
}

interface ExecuteParams {
  username: string;
  password: string;
}
