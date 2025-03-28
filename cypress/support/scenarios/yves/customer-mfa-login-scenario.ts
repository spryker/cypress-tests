import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { LoginPage, MultiFactorAuthPage } from '../../pages/yves';

interface LoginCredentials {
  email: string;
  password: string;
}

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

  executeWithInvalidCode(credentials: LoginCredentials, invalidCode = '123456'): void {
    this.loginPage.visit();
    this.loginPage.login(credentials);

    this.mfaPage.waitForVerificationPopup();
    this.mfaPage.verifyCode(invalidCode);

    cy.contains('Invalid multi-factor authentication code');
    cy.reload();
    this.loginPage.assertPageLocation();
  }
}
