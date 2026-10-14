import { LoginPage } from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;

  execute = (params: ExecuteParams): void => {
    if (params.alternativeEmails?.length) {
      this.findRegisteredEmail([params.email, ...params.alternativeEmails], params.password).then((email: string) => {
        this.execute({ ...params, email, alternativeEmails: undefined });
      });

      return;
    }

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

  // Shops sharing one repository id can seed the same demo customer under different e-mail domains,
  // so the first address the storefront API accepts with the password is the one that is registered.
  private findRegisteredEmail = (emails: string[], password: string): Cypress.Chainable<string> => {
    const [email, ...remainingEmails] = emails;

    return cy
      .request({
        method: 'POST',
        url: Cypress.env().glueUrl + '/access-tokens',
        headers: { 'Content-Type': 'application/json' },
        body: { data: { type: 'access-tokens', attributes: { username: email, password } } },
        failOnStatusCode: false,
      })
      .then((response): Cypress.Chainable<string> => {
        if (response.isOkStatusCode || !remainingEmails.length) {
          return cy.wrap(email);
        }

        return this.findRegisteredEmail(remainingEmails, password);
      });
  };
}

interface ExecuteParams {
  email: string;
  password: string;
  withoutSession?: boolean;
  resetSession?: boolean;
  alternativeEmails?: string[];
}
