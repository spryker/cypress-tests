import { container } from '@utils';
import { LoginPage, CustomerOverviewPage, MultiFactorAuthPage } from '@pages/yves';
import { CustomerMfaAuthDynamicFixtures, CustomerMfaAuthStaticFixtures } from '../../../support/types/yves/multi-factor-authentication';
import { CustomerLogoutScenario } from '../../../support/scenarios/yves/customer-logout-scenario';
import { CustomerDeletePage } from '../../../support/pages/yves/customer/customer-delete/customer-delete-page';
import { CustomerMfaActivationScenario } from '../../../support/scenarios/yves/customer-mfa-activation-scenario';
import { CustomerMfaLoginScenario } from '../../../support/scenarios/yves/customer-mfa-login-scenario';
import { CustomerLoginScenario } from '../../../support/scenarios/yves/customer-login-scenario';
import { retryableBefore } from '../../../support/e2e';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
    'customer mfa auth [suite]',
    { tags: ['@yves', '@customer-account-management'] },
    (): void => {
        const loginPage = container.get(LoginPage);
        const customerOverviewPage = container.get(CustomerOverviewPage);
        const mfaPage = container.get(MultiFactorAuthPage);
        const logoutScenario = container.get(CustomerLogoutScenario);
        const customerDeletePage = container.get(CustomerDeletePage);
        const mfaActivationScenario = container.get(CustomerMfaActivationScenario);
        const customerLoginScenario = container.get(CustomerLoginScenario);
        const mfaLoginScenario = container.get(CustomerMfaLoginScenario);

        let dynamicFixtures: CustomerMfaAuthDynamicFixtures;
        let staticFixtures: CustomerMfaAuthStaticFixtures;

        retryableBefore((): void => {
            ({ staticFixtures, dynamicFixtures } = Cypress.env());
        });

        it('should setup email MFA and login with MFA', (): void => {
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

        it('should setup email MFA, verify MFA is triggered on delete account form and deactivate MFA', (): void => {
            loginPage.visit();
            loginPage.login({
                email: dynamicFixtures.customerTwo.email,
                password: staticFixtures.defaultPassword,
            });
            
            customerOverviewPage.assertPageLocation();
            mfaActivationScenario.execute(dynamicFixtures.customerTwo.email);

            customerDeletePage.visit();
            customerDeletePage.clickDeleteAccount();
            mfaPage.waitForVerificationPopup();

            mfaActivationScenario.deactivate(dynamicFixtures.customerTwo.email);
        });

        it('should setup email MFA and enter the invalid code during login', (): void => {
            loginPage.visit();
            loginPage.login({
                email: dynamicFixtures.customerThree.email,
                password: staticFixtures.defaultPassword,
            });
            
            customerOverviewPage.assertPageLocation();
            mfaActivationScenario.execute(dynamicFixtures.customerThree.email);

            logoutScenario.execute();
            mfaLoginScenario.executeWithInvalidCode({
                email: dynamicFixtures.customerThree.email,
                password: staticFixtures.defaultPassword,
            });
        });
});
