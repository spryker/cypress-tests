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

    this.mfaPage.getVerificationPopup().should('be.visible');

    console.log('customer');

    cy.getMultiFactorAuthCode(credentials.email, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });
  }

  executeWithInvalidCode(credentials: LoginCredentials, staticFixtures: CustomerMfaAuthStaticFixtures): void {
    this.loginPage.visit();
    this.loginPage.login(credentials);

    this.mfaPage.getVerificationPopup().should('be.visible');
    this.mfaPage.verifyCode(staticFixtures.invalidCode);
    this.mfaPage.getInvalidCodeMessage().should('be.visible');

    cy.reload();
    this.loginPage.assertPageLocation();
  }
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface CustomerMfaAuthStaticFixtures {
  invalidCode: string;
}
