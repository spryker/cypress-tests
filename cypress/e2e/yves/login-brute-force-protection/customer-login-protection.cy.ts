import { container } from '@utils';
import { CustomerOverviewPage, LoginPage, MultiFactorAuthPage } from '@pages/yves';
import { CustomerLoginScenario, CustomerLogoutScenario, CustomerMfaActivationScenario } from '@scenarios/yves';
import { CustomerLoginProtectionDynamicFixtures, LoginBruteForceProtectionStaticFixtures } from '@interfaces/yves';

describe(
  'customer login brute-force protection',
  {
    tags: ['@yves', '@login-brute-force-protection', 'customer-account-management', 'spryker-core'],
    retries: 0,
  },
  (): void => {
    if (!['suite'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the login brute-force protection is wired only in suite', () => {});
      return;
    }

    const loginPage = container.get(LoginPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const multiFactorAuthPage = container.get(MultiFactorAuthPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerLogoutScenario = container.get(CustomerLogoutScenario);
    const multiFactorAuthActivationScenario = container.get(CustomerMfaActivationScenario);

    let staticFixtures: LoginBruteForceProtectionStaticFixtures;
    let dynamicFixtures: CustomerLoginProtectionDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should log in after solving the security check shown after repeated failed logins', (): void => {
      const email = dynamicFixtures.challengeCustomer.email;

      failLogin(email, 1);
      loginPage.visit();
      loginPage.getCaptchaWidget().should('not.exist');

      failLogin(email, staticFixtures.challengeAfterFailedAttempts - 1, 1);
      loginPage.visit();
      loginPage.getCaptchaWidget().should('be.visible');
      loginPage.solveCaptcha();
      loginPage.login({ email, password: staticFixtures.defaultPassword });

      customerOverviewPage.assertPageLocation();
    });

    it('customer should be rejected when the security check is skipped or its payload is tampered with', (): void => {
      const email = dynamicFixtures.captchaRejectionCustomer.email;

      failLogin(email, staticFixtures.challengeAfterFailedAttempts);
      loginPage.visit();
      loginPage.login({ email, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getCaptchaRequiredText()).should('be.visible');
      loginPage.getCaptchaWidget().should('be.visible');

      loginPage.solveCaptcha();
      loginPage.tamperCaptchaPayload();
      loginPage.login({ email, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getCaptchaInvalidText()).should('be.visible');
      loginPage.getCaptchaWidget().should('be.visible');
    });

    it('customer should be locked out after repeated failed logins, even with the correct password', (): void => {
      const email = dynamicFixtures.lockCustomer.email;

      failLogin(email, staticFixtures.lockAfterFailedAttempts);
      loginPage.visit();
      loginPage.login({ email, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getAccountBlockedText()).should('be.visible');
      customerOverviewPage.visit();
      loginPage.assertPageLocation();
    });

    it('customer with multi-factor authentication should log in after solving the security check', (): void => {
      const email = dynamicFixtures.multiFactorAuthCustomer.email;

      customerLoginScenario.execute({ email, password: staticFixtures.defaultPassword, withoutSession: true });
      customerOverviewPage.assertPageLocation();
      multiFactorAuthActivationScenario.execute(email);
      customerLogoutScenario.execute();

      failLogin(email, staticFixtures.challengeAfterFailedAttempts);
      loginPage.visit();
      loginPage.solveCaptcha();
      loginPage.login({ email, password: staticFixtures.defaultPassword });

      multiFactorAuthPage.getVerificationPopup().should('be.visible');
      cy.getMultiFactorAuthCode(email, 'email').then((code) => {
        multiFactorAuthPage.verifyCode(code);
      });

      customerOverviewPage.assertPageLocation();
    });

    function failLogin(email: string, numberOfAttempts: number, previousFailedAttempts = 0): void {
      for (let attempt = 0; attempt < numberOfAttempts; attempt++) {
        loginPage.visit();

        if (previousFailedAttempts + attempt >= staticFixtures.challengeAfterFailedAttempts) {
          loginPage.solveCaptcha();
        }

        loginPage.login({ email, password: staticFixtures.wrongPassword });
        loginPage.assertBodyContainsText(loginPage.getFailedAuthenticationText()).should('be.visible');
      }
    }
  }
);
