import { LoginPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUserLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;

  execute = (params: ExecuteParams): void => {
    if (params.withoutSession) {
      this.loginPage.visit();
      cy.intercept('POST', '**/login_check').as('merchantUserLogin');
      this.loginPage.login(params);
      cy.wait('@merchantUserLogin');

      return;
    }

    cy.session([params.username, params.password], () => {
      this.loginPage.visit();
      cy.intercept('POST', '**/login_check').as('merchantUserLogin');
      this.loginPage.login(params);
      cy.wait('@merchantUserLogin');
    });
  };
}

interface ExecuteParams {
  username: string;
  password: string;
  withoutSession?: boolean;
}
