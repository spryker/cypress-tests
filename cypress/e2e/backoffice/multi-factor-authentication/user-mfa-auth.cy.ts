import { container } from '@utils';
import { IndexPage, ResetPasswordPage } from '@pages/backoffice';
import { CustomerOverviewPage } from '@pages/yves';
import {
  UserMfaAuthDynamicFixtures,
  UserMfaAuthStaticFixtures,
} from '../../../support/types/backoffice/multi-factor-authentication';
import {
  UserLoginScenario,
  UserMfaActivationScenario,
  UserLogoutScenario,
  UserMfaLoginScenario,
  UserMfaCreateScenario,
  CustomerMfaRemoveScenario,
} from '@scenarios/backoffice';
import { CustomerMfaActivationScenario, CustomerLoginScenario } from '@scenarios/yves';
import { retryableBefore } from '../../../support/e2e';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'user mfa auth [suite]',
  { tags: ['@backoffice', '@user-account-management'] },
  (): void => {
    const backofficeIndexPage = container.get(IndexPage);
    const userResetPasswordPage = container.get(ResetPasswordPage);
    const mfaActivationScenario = container.get(UserMfaActivationScenario);
    const mfaLoginScenario = container.get(UserMfaLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const userLogoutScenario = container.get(UserLogoutScenario);
    const userMfaCreateScenario = container.get(UserMfaCreateScenario);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const customerMfaActivationScenario = container.get(CustomerMfaActivationScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerMfaRemoveScenario = container.get(CustomerMfaRemoveScenario);

    let dynamicFixtures: UserMfaAuthDynamicFixtures;
    let staticFixtures: UserMfaAuthStaticFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('should verify successful MFA activation and subsequent authenticated login', (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUserOne.username,
        password: staticFixtures.defaultPassword,
      });

      mfaActivationScenario.execute(dynamicFixtures.rootUserOne.username);

      userLogoutScenario.execute();
      mfaLoginScenario.execute({
        username: dynamicFixtures.rootUserOne.username,
        password: staticFixtures.defaultPassword,
      });

      backofficeIndexPage.assertPageLocation();
    });

    it('should ensure proper error handling when invalid MFA verification code is provided', (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUserTwo.username,
        password: staticFixtures.defaultPassword,
      });

      mfaActivationScenario.execute(dynamicFixtures.rootUserTwo.username);

      userLogoutScenario.execute();
      mfaLoginScenario.executeWithInvalidCode(
        {
          username: dynamicFixtures.rootUserTwo.username,
          password: staticFixtures.defaultPassword,
        },
        staticFixtures
      );
    });

    it("should change password and login using a new one without MFA if it's not enabled", (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUserThree.username,
        password: staticFixtures.defaultPassword,
      });

      userResetPasswordPage.visit();
      userResetPasswordPage.changePassword(staticFixtures.defaultPassword, staticFixtures.newPassword);

      userLogoutScenario.execute();

      userLoginScenario.execute({
        username: dynamicFixtures.rootUserThree.username,
        password: staticFixtures.newPassword,
      });

      backofficeIndexPage.visit();
      backofficeIndexPage.assertPageLocation();
    });

    it('should verify successful MFA deactivation and subsequent login without MFA', (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUserFour.username,
        password: staticFixtures.defaultPassword,
      });

      mfaActivationScenario.execute(dynamicFixtures.rootUserFour.username);

      userLogoutScenario.execute();
      mfaLoginScenario.execute({
        username: dynamicFixtures.rootUserFour.username,
        password: staticFixtures.defaultPassword,
      });

      mfaActivationScenario.deactivate(dynamicFixtures.rootUserFour.username);

      userLogoutScenario.execute();
      userLoginScenario.execute({
        username: dynamicFixtures.rootUserFour.username,
        password: staticFixtures.defaultPassword,
      });

      backofficeIndexPage.visit();
      backofficeIndexPage.assertPageLocation();
    });

    it('should verify requesting MFA during user creation', (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUserFive.username,
        password: staticFixtures.defaultPassword,
      });

      mfaActivationScenario.execute(dynamicFixtures.rootUserFive.username);

      userMfaCreateScenario.execute({
        password: staticFixtures.newPassword,
        adminUsername: dynamicFixtures.rootUserFive.username,
        isRootUser: true,
      });
    });

    it('should remove customer MFA from Backoffice', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customerOne.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      customerOverviewPage.assertPageLocation();
      customerMfaActivationScenario.execute(dynamicFixtures.customerOne.email);

      userLoginScenario.execute({
        username: dynamicFixtures.rootUserSix.username,
        password: staticFixtures.defaultPassword,
      });

      customerMfaRemoveScenario.execute({
        email: dynamicFixtures.customerOne.email,
      });
    });
  }
);
