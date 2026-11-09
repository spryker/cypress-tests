import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { LoginPage, MultiFactorAuthPage, IndexPage } from '../../pages/backoffice';

@injectable()
@autoWired
export class UserMfaLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;
  @inject(MultiFactorAuthPage) private mfaPage: MultiFactorAuthPage;
  @inject(IndexPage) private indexPage: IndexPage;

  execute(params: ExecuteParams): void {
    this.loginPage.visit();
    this.loginPage.login(params);

    this.mfaPage.getVerificationPopup().should('be.visible');

    let mfaCode: string;

    cy.getUserMultiFactorAuthCode(params.username, 'email').then((code) => {
      mfaCode = code;
      this.mfaPage.verifyCode(code);
    });

    this.indexPage.getLoginForm().should('not.exist');

    // A verified, unexpired code exempts the user from MFA, so leaving it would let the next
    // protected Back Office form submit without the verification popup.
    cy.then(() => cy.cleanUpUserMultiFactorAuthCode(mfaCode));
  }

  executeWithInvalidCode(params: ExecuteParams, staticFixtures: UserMfaAuthStaticFixtures): void {
    this.loginPage.visit();
    this.loginPage.login(params);

    this.mfaPage.getVerificationPopup().should('be.visible');
    this.mfaPage.verifyCode(staticFixtures.invalidCode);
    this.mfaPage.getInvalidCodeMessage().should('be.visible');
    this.mfaPage.getVerificationPopup().should('be.visible');
    this.loginPage.assertPageLocation();

    // The rejected code leaves a session that passed the password step but not MFA. Keeping it makes
    // the next login page visit redirect to the dashboard, which denies access to it with a 500.
    this.loginPage.clearSessionCookie();
  }
}

interface ExecuteParams {
  username: string;
  password: string;
}

interface UserMfaAuthStaticFixtures {
  invalidCode: string;
}
