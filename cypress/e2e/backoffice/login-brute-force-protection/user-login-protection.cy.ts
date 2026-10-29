import { container } from '@utils';
import { IndexPage, LoginPage } from '@pages/backoffice';
import { LoginBruteForceProtectionStaticFixtures, UserLoginProtectionDynamicFixtures } from '@interfaces/backoffice';

describe(
  'user login brute-force protection',
  {
    tags: ['@backoffice', '@login-brute-force-protection', 'spryker-core-back-office', 'spryker-core'],
    retries: 0,
  },
  (): void => {
    if (!['suite'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the login brute-force protection is wired only in suite', () => {});
      return;
    }

    const loginPage = container.get(LoginPage);
    const indexPage = container.get(IndexPage);

    let staticFixtures: LoginBruteForceProtectionStaticFixtures;
    let dynamicFixtures: UserLoginProtectionDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('user should log in after solving the security check shown after repeated failed logins', (): void => {
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
    });

    it('user should be rejected when the security check is skipped or its payload is tampered with', (): void => {
      const username = dynamicFixtures.captchaRejectionUser.username;

      failLogin(username, staticFixtures.challengeAfterFailedAttempts);
      loginPage.visit();
      loginPage.loginBypassingFormValidation({ username, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getCaptchaRequiredText()).should('be.visible');
      loginPage.getCaptchaWidget().should('be.visible');

      loginPage.solveCaptcha();
      loginPage.tamperCaptchaPayload();
      loginPage.login({ username, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getCaptchaInvalidText()).should('be.visible');
      loginPage.getCaptchaWidget().should('be.visible');
    });

    it('user should be locked out after repeated failed logins, even with the correct password', (): void => {
      const username = dynamicFixtures.lockUser.username;

      failLogin(username, staticFixtures.lockAfterFailedAttempts);
      loginPage.visit();
      loginPage.login({ username, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getAccountBlockedText()).should('be.visible');
      indexPage.visit();
      indexPage.getLoginForm().should('be.visible');
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
