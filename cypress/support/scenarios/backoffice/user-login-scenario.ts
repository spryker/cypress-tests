import { LoginPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class UserLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;

  execute = (username: string, password: string): void => {
    cy.session([username, password], () => {
      this.loginPage.visit();
      this.loginPage.login(username, password);
    });
  };
}
