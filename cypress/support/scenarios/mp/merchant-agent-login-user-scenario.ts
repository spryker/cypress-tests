import { AgentLoginPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantAgentLoginUserScenario {
  @inject(AgentLoginPage) private agentLoginPage: AgentLoginPage;

  execute = (params: ExecuteParams): void => {
    if (params.withoutSession) {
      this.agentLoginPage.visit();
      cy.intercept('POST', '**/login_check').as('merchantAgentLogin');
      this.agentLoginPage.login(params);
      cy.wait('@merchantAgentLogin');

      return;
    }

    cy.session([params.username, params.password], () => {
      this.agentLoginPage.visit();
      cy.intercept('POST', '**/login_check').as('merchantAgentLogin');
      this.agentLoginPage.login(params);
      cy.wait('@merchantAgentLogin');
    });
  };
}

interface ExecuteParams {
  username: string;
  password: string;
  withoutSession?: boolean;
}
