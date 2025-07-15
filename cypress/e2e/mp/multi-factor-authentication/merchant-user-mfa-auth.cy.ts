import { container } from '@utils';
import { DashboardPage, MerchantUserMultiFactorAuthPage } from '@pages/mp';
import {
  MerchantUserMfaAuthDynamicFixtures,
  MerchantUserMfaAuthStaticFixtures,
} from '../../../support/types/mp/multi-factor-authentication';
import {
  MerchantUserLoginScenario,
  MerchantUserAccountScenario,
  MerchantUserSetUpMfaScenario,
  MerchantUserMfaLoginScenario,
} from '@scenarios/mp';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'merchant user mfa auth [suite]',
  { tags: ['@mp'] },
  (): void => {
    const dashboardPage = container.get(DashboardPage);
    const mfaPage = container.get(MerchantUserMultiFactorAuthPage);
    const mfaSetUpScenario = new MerchantUserSetUpMfaScenario(mfaPage);
    const mfaLoginScenario = container.get(MerchantUserMfaLoginScenario);
    const loginScenario = container.get(MerchantUserLoginScenario);
    const accountScenario = container.get(MerchantUserAccountScenario);

    let dynamicFixtures: MerchantUserMfaAuthDynamicFixtures;
    let staticFixtures: MerchantUserMfaAuthStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      cy.clearAllSessionStorage();
    });

    it('merchant user should handle MFA activation and login flow, deactivation, password change and login with new password when MFA is disabled', (): void => {
      loginScenario.execute({
        username: dynamicFixtures.merchantUserOne.username,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      dashboardPage.visit();
      dashboardPage.assertPageLocation();

      mfaSetUpScenario.executeActivation(dynamicFixtures.merchantUserOne.username);

      dashboardPage.logout();

      mfaLoginScenario.execute({
        username: dynamicFixtures.merchantUserOne.username,
        password: staticFixtures.defaultPassword,
      });

      mfaSetUpScenario.executeDeactivation(dynamicFixtures.merchantUserOne.username);

      accountScenario.executeChangePassword(staticFixtures.defaultPassword, staticFixtures.newPassword);

      dashboardPage.logout();

      loginScenario.execute({
        username: dynamicFixtures.merchantUserOne.username,
        password: staticFixtures.newPassword,
        withoutSession: true,
      });

      dashboardPage.logout();
    });

    it('merchant user should ensure proper error handling when invalid MFA verification code is provided', (): void => {
      loginScenario.execute({
        username: dynamicFixtures.merchantUserTwo.username,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      dashboardPage.visit();
      dashboardPage.assertPageLocation();

      mfaSetUpScenario.executeActivation(dynamicFixtures.merchantUserTwo.username);

      dashboardPage.logout();

      mfaLoginScenario.executeWithInvalidCode(
        {
          username: dynamicFixtures.merchantUserTwo.username,
          password: staticFixtures.defaultPassword,
        },
        staticFixtures
      );
    });
  }
);
