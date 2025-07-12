import { container } from '@utils';
import { CustomerOverviewPage, HomePage, MultiFactorAuthPage } from '@pages/yves';
import {
  CustomerMfaAuthDynamicFixtures,
  CustomerMfaAuthStaticFixtures,
} from '../../../support/types/yves/multi-factor-authentication';
import { CustomerLogoutScenario } from '../../../support/scenarios/yves/customer-logout-scenario';
import { CustomerDeletePage } from '../../../support/pages/yves/customer/customer-delete/customer-delete-page';
import { CustomerMfaActivationScenario } from '../../../support/scenarios/yves/customer-mfa-activation-scenario';
import { CustomerMfaLoginScenario } from '../../../support/scenarios/yves/customer-mfa-login-scenario';
import { CustomerLoginScenario } from '../../../support/scenarios/yves/customer-login-scenario';
import { retryableBefore } from '../../../support/e2e';
import { CustomerProfilePage } from '../../../support/pages/yves/customer/profile/customer-profile-page';
import { CustomerProfileScenario } from '../../../support/scenarios/yves/customer-profile-scenario';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'customer mfa auth [suite]',
  { tags: ['@yves', '@customer-account-management'] },
  (): void => {
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const customerDeletePage = container.get(CustomerDeletePage);
    const customerProfilePage = container.get(CustomerProfilePage);
    const mfaPage = container.get(MultiFactorAuthPage);
    const homePage = container.get(HomePage);
    const logoutScenario = container.get(CustomerLogoutScenario);
    const mfaActivationScenario = container.get(CustomerMfaActivationScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const mfaLoginScenario = container.get(CustomerMfaLoginScenario);
    const customerProfileScenario = container.get(CustomerProfileScenario);

    let dynamicFixtures: CustomerMfaAuthDynamicFixtures;
    let staticFixtures: CustomerMfaAuthStaticFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    before((): void => {
      cy.cleanUpCustomerMultiFactorAuth();
    });

    it('should verify successful MFA activation and subsequent authenticated login', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customerOne.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      customerOverviewPage.assertPageLocation();
      mfaActivationScenario.execute(dynamicFixtures.customerOne.email);

      logoutScenario.execute();
      mfaLoginScenario.execute({
        email: dynamicFixtures.customerOne.email,
        password: staticFixtures.defaultPassword,
      });

      customerOverviewPage.assertPageLocation();
    });

    it('should validate MFA verification requirement during account deletion and successful deactivation', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customerTwo.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      customerOverviewPage.assertPageLocation();
      mfaActivationScenario.execute(dynamicFixtures.customerTwo.email);

      customerDeletePage.visit();
      customerDeletePage.clickDeleteAccount();
      mfaPage.waitForVerificationPopup();

      mfaActivationScenario.deactivate(dynamicFixtures.customerTwo.email);

      customerDeletePage.visit();
      customerDeletePage.clickDeleteAccount();
      homePage.assertPageLocation();
    });

    it('should ensure proper error handling when invalid MFA verification code is provided', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customerThree.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      customerOverviewPage.assertPageLocation();
      mfaActivationScenario.execute(dynamicFixtures.customerThree.email);

      logoutScenario.execute();
      mfaLoginScenario.executeWithInvalidCode(
        {
          email: dynamicFixtures.customerThree.email,
          password: staticFixtures.defaultPassword,
        },
        staticFixtures
      );
    });

    it("should change password and login using a new one without MFA if it's not enabled", (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customerFour.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      customerProfilePage.visit();
      customerProfileScenario.executePasswordChange({
        password: staticFixtures.defaultPassword,
        newPassword: staticFixtures.newPassword,
      });

      logoutScenario.execute();

      customerLoginScenario.execute({
        email: dynamicFixtures.customerFour.email,
        password: staticFixtures.newPassword,
        withoutSession: true,
      });

      customerOverviewPage.assertPageLocation();
    });
  }
);
