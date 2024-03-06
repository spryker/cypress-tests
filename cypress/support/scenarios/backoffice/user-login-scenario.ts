import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { LoginPage } from '../../pages/backoffice';

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
