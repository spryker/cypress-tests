import { LoginPage } from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;

  execute = (email: string, password: string): void => {
    cy.session([email, password], () => {
      this.loginPage.visit();
      this.loginPage.login(email, password);
    });
  };
}
