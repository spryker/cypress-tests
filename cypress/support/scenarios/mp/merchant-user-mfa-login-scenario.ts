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

    cy.intercept('POST', '**/send-code').as('sendCode');
    cy.getUserMultiFactorAuthCode(params.username, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });
    cy.wait('@sendCode');
  }

  executeWithInvalidCode(params: ExecuteParams, staticFixtures: MerchantUserMfaAuthStaticFixtures): void {
    this.loginPage.visit();
    this.loginPage.login(params);

    this.mfaPage.waitForVerificationPopup();
    cy.intercept('POST', '**/send-code').as('sendCode');
    this.mfaPage.verifyCode(staticFixtures.invalidCode);
    cy.wait('@sendCode');

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
