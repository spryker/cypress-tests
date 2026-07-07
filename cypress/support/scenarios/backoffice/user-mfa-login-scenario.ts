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

    cy.getUserMultiFactorAuthCode(params.username, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });

    this.indexPage.getLoginForm().should('not.exist');
  }

  executeWithInvalidCode(params: ExecuteParams, staticFixtures: UserMfaAuthStaticFixtures): void {
    this.loginPage.visit();
    this.loginPage.login(params);

    this.mfaPage.getVerificationPopup().should('be.visible');
    this.mfaPage.verifyCode(staticFixtures.invalidCode);
    this.mfaPage.getInvalidCodeMessage().should('be.visible');

    cy.reload();
    this.loginPage.assertPageLocation();
  }
}

interface ExecuteParams {
  username: string;
  password: string;
}

interface UserMfaAuthStaticFixtures {
  invalidCode: string;
}
