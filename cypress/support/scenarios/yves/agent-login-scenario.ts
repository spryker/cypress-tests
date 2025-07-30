import { AgentLoginPage } from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class AgentLoginScenario {
  @inject(AgentLoginPage) private loginPage: AgentLoginPage;

  execute = (params: ExecuteParams): void => {
    if (params.withoutSession) {
      this.loginPage.visit();
      this.loginPage.login(params);

      return;
    }

    cy.session([params.username, params.password], () => {
      this.loginPage.visit();
      this.loginPage.login(params);
    });
  };
}

interface ExecuteParams {
  username: string;
  password: string;
  withoutSession?: boolean;
}
