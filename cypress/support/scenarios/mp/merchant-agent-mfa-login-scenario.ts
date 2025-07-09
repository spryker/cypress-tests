import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { AgentLoginPage, MerchantAgentMultiFactorAuthPage } from '../../pages/mp';

@injectable()
@autoWired
export class MerchantAgentMfaLoginScenario {
  @inject(AgentLoginPage) private loginPage: AgentLoginPage;
  @inject(MerchantAgentMultiFactorAuthPage) private mfaPage: MerchantAgentMultiFactorAuthPage;

  execute(params: ExecuteParams): void {
    this.loginPage.visit();
    this.loginPage.login(params);

    this.mfaPage.waitForVerificationPopup();

    cy.getUserMultiFactorAuthCode(params.username, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(4000);
  }

  executeWithInvalidCode(params: ExecuteParams, staticFixtures: MerchantUserMfaAuthStaticFixtures): void {
    this.loginPage.visit();
    this.loginPage.login(params);

    this.mfaPage.waitForVerificationPopup();
    this.mfaPage.verifyCode(staticFixtures.invalidCode);

    cy.reload();
    this.loginPage.assertPageLocation();
  }
}

interface ExecuteParams {
  username: string;
  password: string;
}

interface MerchantUserMfaAuthStaticFixtures {
  invalidCode: string;
}
