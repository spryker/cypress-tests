import { AgentLoginPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

interface MerchantAgentLoginExecuteParams {
  username: string;
  password: string;
}

@injectable()
@autoWired
export class MerchantAgentLoginUserScenario {
  @inject(AgentLoginPage) private agentLoginPage: AgentLoginPage;

  execute = (params: MerchantAgentLoginExecuteParams): void => {
    const { username, password } = params;

    cy.session([username, password], () => {
      this.agentLoginPage.visit();
      this.agentLoginPage.login(username, password);
    });
  };
}
