import { container } from '@utils';
import { DashboardPage, MerchantUserMultiFactorAuthPage } from '@pages/mp';
import {
  MerchantUserMfaAuthDynamicFixtures,
  MerchantUserMfaAuthStaticFixtures,
} from '../../../support/types/mp/multi-factor-authentication';
import {
  MerchantUserLoginScenario,
  MerchantUserLogoutScenario,
  MerchantUserProfileScenario,
  MerchantUserSetUpMfaScenario,
  MerchantUserMfaLoginScenario,
} from '@scenarios/mp';
import { retryableBefore } from '../../../support/e2e';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'merchant user mfa auth [suite]',
  { tags: ['@mp'] },
  (): void => {
    const dashboardPage = container.get(DashboardPage);
    const mfaPage = container.get(MerchantUserMultiFactorAuthPage);
    const mfaSetUpScenario = new MerchantUserSetUpMfaScenario(mfaPage);
    const mfaLoginScenario = container.get(MerchantUserMfaLoginScenario);
    const loginScenario = container.get(MerchantUserLoginScenario);
    const logoutScenario = container.get(MerchantUserLogoutScenario);
    const profileScenario = container.get(MerchantUserProfileScenario);

    let dynamicFixtures: MerchantUserMfaAuthDynamicFixtures;
    let staticFixtures: MerchantUserMfaAuthStaticFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('merchant user should handle MFA activation and login flow, deactivation, password change and login with new password when MFA is disabled', (): void => {
      loginScenario.execute({
        username: dynamicFixtures.merchantUserOne.username,
        password: staticFixtures.defaultPassword,
      });

      mfaSetUpScenario.executeActivation(dynamicFixtures.merchantUserOne.username);

      logoutScenario.execute();

      mfaLoginScenario.execute({
        username: dynamicFixtures.merchantUserOne.username,
        password: staticFixtures.defaultPassword,
      });

      mfaSetUpScenario.executeDeactivation(dynamicFixtures.merchantUserOne.username);

      profileScenario.executeChangePassword(staticFixtures.defaultPassword, staticFixtures.newPassword);

      logoutScenario.execute();

      loginScenario.execute({
        username: dynamicFixtures.merchantUserOne.username,
        password: staticFixtures.newPassword,
      });

      dashboardPage.visit();
      dashboardPage.assertPageLocation();
    });

    it('merchant user should ensure proper error handling when invalid MFA verification code is provided', (): void => {
      loginScenario.execute({
        username: dynamicFixtures.merchantUserTwo.username,
        password: staticFixtures.defaultPassword,
      });

      mfaSetUpScenario.executeActivation(dynamicFixtures.merchantUserTwo.username);

      logoutScenario.execute();

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
