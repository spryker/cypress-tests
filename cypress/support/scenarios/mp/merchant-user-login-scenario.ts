import { LoginPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUserLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;

  execute = (params: ExecuteParams): void => {
    cy.session([params.username, params.password], () => {
      this.loginPage.visit();
      this.loginPage.login(params);
    });
  };
}

interface ExecuteParams {
  username: string;
  password: string;
}
