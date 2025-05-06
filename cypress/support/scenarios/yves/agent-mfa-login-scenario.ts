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
