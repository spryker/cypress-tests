import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { LoginPage, MultiFactorAuthPage } from '../../pages/yves';

@injectable()
@autoWired
export class CustomerMfaLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;
  @inject(MultiFactorAuthPage) private mfaPage: MultiFactorAuthPage;

  execute(credentials: LoginCredentials): void {
    cy.intercept('POST', '**/multi-factor-auth/send-user-code').as('mfaCodeSubmit');

    this.loginPage.visit();
    this.loginPage.login(credentials);

    this.mfaPage.waitForVerificationPopup();

    this.submitNewestCode(credentials.email);

    // After a successful verification the popup reloads the page; wait for the redirect off the
    // login page to land so the next visit() does not race the just-established session.
    cy.url({ timeout: 20000 }).should('not.include', '/login');
  }

  /**
   * While it initialises, the login MFA popup requests a fresh verification code and can do so more
   * than once. The backend keeps every code but only accepts the most recently generated one, so the
   * first code read from the DB may already be stale by the time it is submitted — which left the
   * test stuck on /login. A rejected submit re-renders the validation form without issuing a new
   * code, so re-reading the (now stable) newest code and submitting again succeeds. Bounded to stay
   * within the backend attempt limit.
   */
  private submitNewestCode(email: string, attempt = 1): void {
    const maxAttempts = 3;

    cy.getMultiFactorAuthCode(email, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });

    cy.wait('@mfaCodeSubmit').then((interception) => {
      const body = interception.response?.body;
      const verified = typeof body === 'string' && body.includes('data-success');

      if (!verified && attempt < maxAttempts) {
        this.submitNewestCode(email, attempt + 1);
      }
    });
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
