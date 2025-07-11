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

    cy.intercept('POST', '**/get-enabled-types*').as('getEnabledTypes');
    this.loginPage.login(params);
    cy.wait('@getEnabledTypes');

    this.mfaPage.waitForVerificationPopup();

    cy.getUserMultiFactorAuthCode(params.username, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });
  }

  executeWithInvalidCode(params: ExecuteParams, staticFixtures: MerchantUserMfaAuthStaticFixtures): void {
    this.loginPage.visit();

    cy.intercept('POST', '**/get-enabled-types*').as('getEnabledTypes');
    this.loginPage.login(params);
    cy.wait('@getEnabledTypes');

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
