import { LoginPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

interface MerchantUserLoginExecuteParams {
  username: string;
  password: string;
}

@injectable()
@autoWired
export class MerchantUserLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;

  execute = (params: MerchantUserLoginExecuteParams): void => {
    cy.session([params.username, params.password], () => {
      this.loginPage.visit();
      this.loginPage.login(params.username, params.password);
    });
  };
}
