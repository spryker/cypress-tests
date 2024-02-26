import { inject, injectable } from 'inversify';
import { LoginPage } from '../../pages/backoffice/login/login-page';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class UserLoginScenario {
  constructor(@inject(LoginPage) private loginPage: LoginPage) {}

  public execute = (username: string, password: string): void => {
    cy.session([username, password], () => {
      this.loginPage.visit();
      this.loginPage.login(username, password);
    });
  };
}
