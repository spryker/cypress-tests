import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { LoginPage, MultiFactorAuthPage } from '../../pages/yves';

@injectable()
@autoWired
export class CustomerMfaLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;
  @inject(MultiFactorAuthPage) private mfaPage: MultiFactorAuthPage;

  execute(credentials: LoginCredentials): void {
    this.loginPage.visit();
    this.loginPage.login(credentials);

    this.mfaPage.waitForVerificationPopup();

    cy.getMultiFactorAuthCode(credentials.email, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });

    // verifyCode() submits the verification popup via fetch, so Cypress does not wait for a page
    // load and the in-flight POST may not have established the MFA-passed session yet. Block until
    // the redirect off the login page lands, otherwise the next visit() races that request and the
    // customer guard bounces it back to /login.
    cy.url({ timeout: 20000 }).should('not.include', '/login');
  }

  executeWithInvalidCode(credentials: LoginCredentials, staticFixtures: CustomerMfaAuthStaticFixtures): void {
    this.loginPage.visit();
    this.loginPage.login(credentials);

    this.mfaPage.waitForVerificationPopup();
    this.mfaPage.verifyCode(staticFixtures.invalidCode);
    this.mfaPage.waitForInvalidCodeMessage();

    cy.reload();
    this.loginPage.assertPageLocation();
  }
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface CustomerMfaAuthStaticFixtures {
  invalidCode: string;
}
