import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { LoginPage } from '../../pages/mp';

@injectable()
@autoWired
export class MerchantUserLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;

  execute = (username: string, password: string): void => {
    cy.session([username, password], () => {
      this.loginPage.visit();
      this.loginPage.login(username, password);
    });
  };
}
