import { LoginPage } from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;

  execute = (params: ExecuteParams): void => {
    if (params.withoutSession) {
      if (params.resetSession) {
        cy.clearCookies();
      }

      this.loginPage.visit();
      this.loginPage.login(params);

      return;
    }

    cy.session([params.email, params.password], () => {
      this.loginPage.visit();
      this.loginPage.login(params);

      // login() only submits the form; without waiting for the post-login redirect the session
      // snapshot can be taken from a guest/partially authenticated state, and every restore of
      // that snapshot then renders checkout as a guest (missing saved-address select, empty cart).
      cy.location('pathname').should('not.include', '/login');
    });
  };
}

interface ExecuteParams {
  email: string;
  password: string;
  withoutSession?: boolean;
  resetSession?: boolean;
}
