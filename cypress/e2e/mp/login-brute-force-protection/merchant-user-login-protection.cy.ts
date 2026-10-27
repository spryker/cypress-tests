import { container } from '@utils';
import { DashboardPage, LoginPage } from '@pages/mp';
import { LoginBruteForceProtectionStaticFixtures, MerchantUserLoginProtectionDynamicFixtures } from '@interfaces/mp';

describe(
  'merchant user login brute-force protection',
  {
    tags: ['@mp', '@login-brute-force-protection', 'marketplace-merchantportal-core', 'spryker-core'],
    // Every attempt moves the account's server-side counters, so a retried test would start from the wrong
    // state; a failed spec is rerun as a whole with fresh fixture users instead.
    retries: 0,
  },
  (): void => {
    if (!['suite'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the login brute-force protection is wired only in suite', () => {});
      return;
    }

    const loginPage = container.get(LoginPage);
    const dashboardPage = container.get(DashboardPage);

    let staticFixtures: LoginBruteForceProtectionStaticFixtures;
    let dynamicFixtures: MerchantUserLoginProtectionDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('merchant user should log in after solving the security check shown after repeated failed logins', (): void => {
      const username = dynamicFixtures.challengeMerchantUser.username;

      failLogin(username, 1);
      loginPage.visit();
      loginPage.getCaptchaWidget().should('not.exist');

      failLogin(username, staticFixtures.challengeAfterFailedAttempts - 1, 1);
      loginPage.visit();
      loginPage.getCaptchaWidget().should('be.visible');
      loginPage.solveCaptcha();
      // Under Cypress the browser keeps the old session cookie instead of the one the successful login XHR sets
      // after earlier logins, so this login starts without a session.
      cy.clearCookies();
      cy.intercept('POST', '**/login_check').as('loginCheck');
      loginPage.login({ username, password: staticFixtures.defaultPassword });
      cy.wait('@loginCheck');

      dashboardPage.visit();
      dashboardPage.assertPageLocation();
    });

    it('merchant user should be rejected when the security check is skipped or its payload is tampered with', (): void => {
      const username = dynamicFixtures.captchaRejectionMerchantUser.username;

      failLogin(username, staticFixtures.challengeAfterFailedAttempts);
      loginPage.visit();
      loginPage.login({ username, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getCaptchaRequiredText()).should('be.visible');
      loginPage.getCaptchaWidget().should('be.visible');

      loginPage.solveCaptcha();
      loginPage.tamperCaptchaPayload();
      loginPage.login({ username, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getCaptchaInvalidText()).should('be.visible');
      loginPage.getCaptchaWidget().should('be.visible');
    });

    it('merchant user should be locked out after repeated failed logins, even with the correct password', (): void => {
      const username = dynamicFixtures.lockMerchantUser.username;

      failLogin(username, staticFixtures.lockAfterFailedAttempts);
      loginPage.visit();
      loginPage.login({ username, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getAccountBlockedText()).should('be.visible');
      dashboardPage.visit();
      loginPage.assertPageLocation();
    });

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
