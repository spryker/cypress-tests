import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { LoginPage } from '../../pages/yves';

@injectable()
@autoWired
export class CustomerLoginScenario {
  constructor(@inject(LoginPage) private loginPage: LoginPage) {}

  public execute = (email: string, password: string): void => {
    cy.session([email, password], () => {
      this.loginPage.visit();
      this.loginPage.login(email, password);
    });
  };
}
