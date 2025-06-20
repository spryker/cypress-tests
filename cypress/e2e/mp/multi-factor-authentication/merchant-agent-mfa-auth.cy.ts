import { container } from '@utils';
import { AgentDashboardPage, MerchantAgentMultiFactorAuthPage } from '@pages/mp';
import {
  MerchantAgentMfaAuthDynamicFixtures,
  MerchantAgentMfaAuthStaticFixtures,
} from '../../../support/types/mp/multi-factor-authentication';
import {
  MerchantAgentLoginUserScenario,
  MerchantAgentMfaLoginScenario,
  MerchantUserSetUpMfaScenario,
} from '@scenarios/mp';
import { retryableBefore } from '../../../support/e2e';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'agent (merchant user) mfa auth [suite]',
  { tags: ['@mp'] },
  (): void => {
    const mpAgentDashboardPage = container.get(AgentDashboardPage);
    const mfaLoginScenario = container.get(MerchantAgentMfaLoginScenario);
    const merchantAgentLoginUserScenario = container.get(MerchantAgentLoginUserScenario);

    const mpAgentMfaPage = container.get(MerchantAgentMultiFactorAuthPage);
    const mfaSetUpScenario = new MerchantUserSetUpMfaScenario(mpAgentMfaPage);

    let dynamicFixtures: MerchantAgentMfaAuthDynamicFixtures;
    let staticFixtures: MerchantAgentMfaAuthStaticFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('agent (merchant user) should handle MFA activation and login flow, deactivation and login when MFA is disabled', (): void => {
      merchantAgentLoginUserScenario.execute({
        username: dynamicFixtures.merchantAgentUserOne.username,
        password: staticFixtures.defaultPassword,
      });

      mpAgentDashboardPage.visit();
      mpAgentDashboardPage.assertPageLocation();

      mfaSetUpScenario.executeActivation(dynamicFixtures.merchantAgentUserOne.username);

      mpAgentDashboardPage.logoutAgent();

      mfaLoginScenario.execute({
        username: dynamicFixtures.merchantAgentUserOne.username,
        password: staticFixtures.defaultPassword,
      });

      mfaSetUpScenario.executeDeactivation(dynamicFixtures.merchantAgentUserOne.username);

      mpAgentDashboardPage.logoutAgent();

      merchantAgentLoginUserScenario.execute({
        username: dynamicFixtures.merchantAgentUserOne.username,
        password: staticFixtures.defaultPassword,
      });

      mpAgentDashboardPage.visit();
      mpAgentDashboardPage.assertPageLocation();
    });

    it('agent (merchant user) should ensure proper error handling when invalid MFA verification code is provided', (): void => {
      merchantAgentLoginUserScenario.execute({
        username: dynamicFixtures.merchantAgentUserTwo.username,
        password: staticFixtures.defaultPassword,
      });

      mpAgentDashboardPage.visit();
      mpAgentDashboardPage.assertPageLocation();

      mfaSetUpScenario.executeActivation(dynamicFixtures.merchantAgentUserTwo.username);

      mpAgentDashboardPage.logoutAgent();

      mfaLoginScenario.executeWithInvalidCode(
        {
          username: dynamicFixtures.merchantAgentUserTwo.username,
          password: staticFixtures.defaultPassword,
        },
        staticFixtures
      );
    });
  }
);
