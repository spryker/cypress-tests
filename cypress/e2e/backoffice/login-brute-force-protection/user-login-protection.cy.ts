import { container } from '@utils';
import { IndexPage, LoginPage } from '@pages/backoffice';
import { LoginPage as MerchantPortalLoginPage } from '@pages/mp';
import { UserLogoutScenario } from '@scenarios/backoffice';
import { LoginBruteForceProtectionStaticFixtures, UserLoginProtectionDynamicFixtures } from '@interfaces/backoffice';

describe(
  'user login brute-force protection',
  {
    tags: [
      '@backoffice',
      '@login-brute-force-protection',
      'spryker-core-back-office',
      'marketplace-merchantportal-core',
      'spryker-core',
    ],
    retries: 0,
  },
  (): void => {
    if (!['suite', 'b2b-mp', 'b2c-mp', 'b2b', 'b2c'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the login brute-force protection is wired only in suite, b2b-mp, b2c-mp, b2b and b2c', () => {});
      return;
    }

    const loginPage = container.get(LoginPage);
    const indexPage = container.get(IndexPage);
    const merchantPortalLoginPage = container.get(MerchantPortalLoginPage);
    const userLogoutScenario = container.get(UserLogoutScenario);

    let staticFixtures: LoginBruteForceProtectionStaticFixtures;
    let dynamicFixtures: UserLoginProtectionDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('user should log in after solving the security check shown after repeated failed logins, and without it after logging out', (): void => {
      const username = dynamicFixtures.challengeUser.username;

      failLogin(username, 1);
      loginPage.visit();
      loginPage.getCaptchaWidget().should('not.exist');

      failLogin(username, staticFixtures.challengeAfterFailedAttempts - 1, 1);
      loginPage.visit();
      loginPage.getCaptchaWidget().should('be.visible');
      loginPage.solveCaptcha();
      loginPage.login({ username, password: staticFixtures.defaultPassword });

      indexPage.getLoginForm().should('not.exist');

      userLogoutScenario.execute();
      loginPage.visit();
      loginPage.getCaptchaWidget().should('not.exist');
      loginPage.login({ username, password: staticFixtures.defaultPassword });

      indexPage.getLoginForm().should('not.exist');
    });

    it('user should be rejected when the security check is skipped or its payload is tampered with', (): void => {
      const username = dynamicFixtures.captchaRejectionUser.username;

      failLogin(username, staticFixtures.challengeAfterFailedAttempts);
      loginPage.visit();
      loginPage.submitLoginWithoutSolvingCaptcha({ username, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getCaptchaRequiredText()).should('be.visible');
      loginPage.getCaptchaWidget().should('be.visible');

      loginPage.solveCaptcha();
      loginPage.tamperCaptchaPayload();
      loginPage.login({ username, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getCaptchaInvalidText()).should('be.visible');
      loginPage.getCaptchaWidget().should('be.visible');
    });

    it('user should be locked out after failed logins in the Back Office and the Merchant Portal, while another user can log in from the same IP address', (): void => {
      const username = dynamicFixtures.lockUser.username;

      failLogin(username, 1);

      if (hasMerchantPortal()) {
        failMerchantPortalLogin(username, staticFixtures.challengeAfterFailedAttempts - 1);
      } else {
        failLogin(username, staticFixtures.challengeAfterFailedAttempts - 1, 1);
      }

      failLogin(
        username,
        staticFixtures.lockAfterFailedAttempts - staticFixtures.challengeAfterFailedAttempts,
        staticFixtures.challengeAfterFailedAttempts
      );
      loginPage.visit();
      loginPage.login({ username, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getAccountBlockedText()).should('be.visible');
      loginPage.getCaptchaWidget().should('not.exist');
      indexPage.visit();
      indexPage.getLoginForm().should('be.visible');

      loginPage.visit();
      loginPage.login({ username: dynamicFixtures.otherUser.username, password: staticFixtures.defaultPassword });

      indexPage.getLoginForm().should('not.exist');
    });

    function failMerchantPortalLogin(username: string, numberOfAttempts: number): void {
      for (let attempt = 0; attempt < numberOfAttempts; attempt++) {
        merchantPortalLoginPage.visit();
        merchantPortalLoginPage.login({ username, password: staticFixtures.wrongPassword });
        merchantPortalLoginPage
          .assertBodyContainsText(merchantPortalLoginPage.getFailedAuthenticationText())
          .should('be.visible');
      }
    }

    function hasMerchantPortal(): boolean {
      return ['suite', 'b2b-mp', 'b2c-mp'].includes(Cypress.env('repositoryId'));
    }

    function failLogin(username: string, numberOfAttempts: number, previousFailedAttempts = 0): void {
      for (let attempt = 0; attempt < numberOfAttempts; attempt++) {
        loginPage.visit();

        if (previousFailedAttempts + attempt >= staticFixtures.challengeAfterFailedAttempts) {
          loginPage.solveCaptcha();
        }

        loginPage.login({ username, password: staticFixtures.wrongPassword });
        loginPage.assertBodyContainsText(loginPage.getFailedAuthenticationText()).should('be.visible');
      }
    }
  }
);
