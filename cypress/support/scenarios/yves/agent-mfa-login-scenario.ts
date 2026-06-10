import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { AgentLoginPage, AgentMultiFactorAuthPage } from '../../pages/yves';

@injectable()
@autoWired
export class AgentMfaLoginScenario {
  @inject(AgentLoginPage) private loginPage: AgentLoginPage;
  @inject(AgentMultiFactorAuthPage) private mfaPage: AgentMultiFactorAuthPage;

  execute(credentials: LoginCredentials): void {
    this.loginPage.visit();
    this.loginPage.login(credentials);

    this.mfaPage.waitForVerificationPopup();

    cy.intercept('POST', '**/multi-factor-auth/send-user-code').as('mfaCodeValidation');

    cy.getUserMultiFactorAuthCode(credentials.username, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });

    // Wait for verification to succeed (session upgraded server-side) before the caller navigates,
    // otherwise the test races the post-MFA login and lands back on /agent/login.
    cy.wait('@mfaCodeValidation').its('response.body').should('include', 'data-success');
  }

  executeWithInvalidCode(credentials: LoginCredentials, staticFixtures: AgentMfaAuthStaticFixtures): void {
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
  username: string;
  password: string;
}

interface AgentMfaAuthStaticFixtures {
  invalidCode: string;
}
