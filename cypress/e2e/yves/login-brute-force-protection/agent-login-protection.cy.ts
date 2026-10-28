import { container } from '@utils';
import { AgentLoginPage, AgentOverviewPage } from '@pages/yves';
import { AgentLoginProtectionDynamicFixtures, LoginBruteForceProtectionStaticFixtures } from '@interfaces/yves';

describe(
  'agent login brute-force protection',
  {
    tags: ['@yves', '@login-brute-force-protection', 'agent-assist', 'spryker-core'],
    retries: 0,
  },
  (): void => {
    if (!['suite'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the login brute-force protection is wired only in suite', () => {});
      return;
    }

    const agentLoginPage = container.get(AgentLoginPage);
    const agentOverviewPage = container.get(AgentOverviewPage);

    let staticFixtures: LoginBruteForceProtectionStaticFixtures;
    let dynamicFixtures: AgentLoginProtectionDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('agent should log in after solving the security check shown after repeated failed logins', (): void => {
      const username = dynamicFixtures.challengeAgent.username;

      failLogin(username, 1);
      agentLoginPage.visit();
      agentLoginPage.getCaptchaWidget().should('not.exist');

      failLogin(username, staticFixtures.challengeAfterFailedAttempts - 1, 1);
      agentLoginPage.visit();
      agentLoginPage.getCaptchaWidget().should('be.visible');
      agentLoginPage.solveCaptcha();
      cy.clearCookies();
      agentLoginPage.login({ username, password: staticFixtures.defaultPassword });

      agentOverviewPage.visit();
      agentOverviewPage.assertPageLocation();
    });

    it('agent should be rejected when the security check is skipped or its payload is tampered with', (): void => {
      const username = dynamicFixtures.captchaRejectionAgent.username;

      failLogin(username, staticFixtures.challengeAfterFailedAttempts);
      agentLoginPage.visit();
      agentLoginPage.login({ username, password: staticFixtures.defaultPassword });

      agentLoginPage.assertBodyContainsText(agentLoginPage.getCaptchaRequiredText()).should('be.visible');
      agentLoginPage.getCaptchaWidget().should('be.visible');

      agentLoginPage.solveCaptcha();
      agentLoginPage.tamperCaptchaPayload();
      agentLoginPage.login({ username, password: staticFixtures.defaultPassword });

      agentLoginPage.assertBodyContainsText(agentLoginPage.getCaptchaInvalidText()).should('be.visible');
      agentLoginPage.getCaptchaWidget().should('be.visible');
    });

    it('agent should be locked out after repeated failed logins, even with the correct password', (): void => {
      const username = dynamicFixtures.lockAgent.username;

      failLogin(username, staticFixtures.lockAfterFailedAttempts);
      agentLoginPage.visit();
      agentLoginPage.login({ username, password: staticFixtures.defaultPassword });

      agentLoginPage.assertBodyContainsText(agentLoginPage.getAccountBlockedText()).should('be.visible');
      agentOverviewPage.visit();
      agentLoginPage.assertPageLocation();
    });

    function failLogin(username: string, numberOfAttempts: number, previousFailedAttempts = 0): void {
      for (let attempt = 0; attempt < numberOfAttempts; attempt++) {
        agentLoginPage.visit();

        if (previousFailedAttempts + attempt >= staticFixtures.challengeAfterFailedAttempts) {
          agentLoginPage.solveCaptcha();
        }

        agentLoginPage.login({ username, password: staticFixtures.wrongPassword });
        agentLoginPage.assertBodyContainsText(agentLoginPage.getFailedAuthenticationText()).should('be.visible');
      }
    }
  }
);
