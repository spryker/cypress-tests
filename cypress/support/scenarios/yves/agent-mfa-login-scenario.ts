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

    cy.getUserMultiFactorAuthCode(credentials.username, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });

    // verifyCode() submits the verification popup via fetch, so Cypress does not wait for a page
    // load and the in-flight POST may not have established the MFA-passed session yet. Block until
    // the redirect off the login page lands, otherwise the next visit() races that request and the
    // agent guard bounces it back to /agent/login.
    cy.url({ timeout: 20000 }).should('not.include', '/agent/login');
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
