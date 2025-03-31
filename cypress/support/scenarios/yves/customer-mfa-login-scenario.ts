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

    cy.getMultiFactorAuthCode(credentials.email, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });
  }

  executeWithInvalidCode(credentials: LoginCredentials, staticFixtures: CustomerMfaAuthStaticFixtures): void {
    this.loginPage.visit();
    this.loginPage.login(credentials);

    this.mfaPage.waitForVerificationPopup();
    this.mfaPage.verifyCode(staticFixtures.invalidCode);
    this.mfaPage.waitForMessage(staticFixtures.invalidCodeMessage);

    cy.reload();
    this.loginPage.assertPageLocation();
  }
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface CustomerMfaAuthStaticFixtures {
  invalidCodeMessage: string;
  invalidCode: string;
}
