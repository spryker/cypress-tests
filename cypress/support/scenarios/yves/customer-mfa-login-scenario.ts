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

    cy.intercept('POST', '**/multi-factor-auth/send-customer-code').as('mfaCodeValidation');

    cy.getMultiFactorAuthCode(credentials.email, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });

    // Wait for verification to succeed (session upgraded server-side) before the caller navigates,
    // otherwise the test races the post-MFA login and lands back on the login page.
    cy.wait('@mfaCodeValidation').its('response.body').should('include', 'data-success');
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
