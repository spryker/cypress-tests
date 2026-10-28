import { container } from '@utils';
import { AgentDashboardPage, AgentLoginPage } from '@pages/mp';
import { LoginBruteForceProtectionStaticFixtures, MerchantAgentLoginProtectionDynamicFixtures } from '@interfaces/mp';

describe(
  'merchant agent login brute-force protection',
  {
    tags: [
      '@mp',
      '@login-brute-force-protection',
      'marketplace-agent-assist',
      'marketplace-merchantportal-core',
      'spryker-core',
    ],
    retries: 0,
  },
  (): void => {
    if (!['suite'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the login brute-force protection is wired only in suite', () => {});
      return;
    }

    const loginPage = container.get(AgentLoginPage);
    const agentDashboardPage = container.get(AgentDashboardPage);

    let staticFixtures: LoginBruteForceProtectionStaticFixtures;
    let dynamicFixtures: MerchantAgentLoginProtectionDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('merchant agent should log in after solving the security check shown after repeated failed logins', (): void => {
      const username = dynamicFixtures.challengeMerchantAgent.username;

      failLogin(username, 1);
      loginPage.visit();
      loginPage.getCaptchaWidget().should('not.exist');

      failLogin(username, staticFixtures.challengeAfterFailedAttempts - 1, 1);
      loginPage.visit();
      loginPage.getCaptchaWidget().should('be.visible');
      loginPage.solveCaptcha();
      cy.clearCookies();
      cy.intercept('POST', '**/login_check').as('loginCheck');
      loginPage.login({ username, password: staticFixtures.defaultPassword });
      cy.wait('@loginCheck');

      agentDashboardPage.visit();
      agentDashboardPage.assertPageLocation();
    });

    it('merchant agent should be rejected when the security check is skipped or its payload is tampered with', (): void => {
      const username = dynamicFixtures.captchaRejectionMerchantAgent.username;

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

    it('merchant agent should be locked out after repeated failed logins, even with the correct password', (): void => {
      const username = dynamicFixtures.lockMerchantAgent.username;

      failLogin(username, staticFixtures.lockAfterFailedAttempts);
      loginPage.visit();
      loginPage.login({ username, password: staticFixtures.defaultPassword });

      loginPage.assertBodyContainsText(loginPage.getAccountBlockedText()).should('be.visible');
      agentDashboardPage.visit();
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
