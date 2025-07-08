import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { LoginPage, MerchantUserMultiFactorAuthPage } from '../../pages/mp';

@injectable()
@autoWired
export class MerchantUserMfaLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;
  @inject(MerchantUserMultiFactorAuthPage) private mfaPage: MerchantUserMultiFactorAuthPage;

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
    this.mfaPage.waitForInvalidCodeMessage();

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
