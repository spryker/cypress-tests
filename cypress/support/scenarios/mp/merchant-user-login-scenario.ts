import { inject, injectable } from 'inversify';
import { autoWired } from '../../utils/inversify/auto-wired';
import { LoginPage } from '../../pages/mp';

@injectable()
@autoWired
export class MerchantUserLoginScenario {
  constructor(@inject(LoginPage) private loginPage: LoginPage) {}

  public execute = (username: string, password: string): void => {
    cy.session([username, password], () => {
      this.loginPage.visit();
      this.loginPage.login(username, password);
    });
  };
}