import { container } from '@utils';
import { AgentOverviewPage } from '@pages/yves';
import {
  AgentMfaAuthDynamicFixtures,
  AgentMfaAuthStaticFixtures,
} from '../../../support/types/yves/multi-factor-authentication';
import { AgentLogoutScenario } from '../../../support/scenarios/yves/agent-logout-scenario';
import { AgentMfaActivationScenario } from '../../../support/scenarios/yves/agent-mfa-activation-scenario';
import { AgentMfaLoginScenario } from '../../../support/scenarios/yves/agent-mfa-login-scenario';
import { AgentLoginScenario } from '../../../support/scenarios/yves/agent-login-scenario';
import { retryableBefore } from '../../../support/e2e';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'agent mfa auth [suite]',
  { tags: ['@yves', '@customer-account-management'] },
  (): void => {
    const agentOverviewPage = container.get(AgentOverviewPage);
    const logoutScenario = container.get(AgentLogoutScenario);
    const loginScenario = container.get(AgentLoginScenario);
    const mfaActivationScenario = container.get(AgentMfaActivationScenario);
    const mfaLoginScenario = container.get(AgentMfaLoginScenario);

    let dynamicFixtures: AgentMfaAuthDynamicFixtures;
    let staticFixtures: AgentMfaAuthStaticFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('should verify successful MFA activation and subsequent authenticated login', (): void => {
      loginScenario.execute({
        username: dynamicFixtures.agentOne.username,
        password: staticFixtures.defaultPassword,
      });

      agentOverviewPage.visit();
      agentOverviewPage.assertPageLocation();
      mfaActivationScenario.execute(dynamicFixtures.agentOne.username);

      logoutScenario.execute();
      mfaLoginScenario.execute({
        username: dynamicFixtures.agentOne.username,
        password: staticFixtures.defaultPassword,
      });

      agentOverviewPage.visit();
      agentOverviewPage.assertPageLocation();
    });

    it('should ensure proper error handling when invalid MFA verification code is provided', (): void => {
      loginScenario.execute({
        username: dynamicFixtures.agentTwo.username,
        password: staticFixtures.defaultPassword,
      });

      agentOverviewPage.visit();
      agentOverviewPage.assertPageLocation();
      mfaActivationScenario.execute(dynamicFixtures.agentTwo.username);

      logoutScenario.execute();
      mfaLoginScenario.executeWithInvalidCode(
        {
          username: dynamicFixtures.agentTwo.username,
          password: staticFixtures.defaultPassword,
        },
        staticFixtures
      );
    });
  }
);
