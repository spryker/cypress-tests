import { container } from '@utils';
import { LoginPage, CustomerOverviewPage, MultiFactorAuthPage } from '@pages/yves';
import { CustomerMfaAuthDynamicFixtures, CustomerMfaAuthStaticFixtures } from '../../../support/types/yves/multi-factor-authentication';
import { retryableBefore } from '../../../support/e2e';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
    'customer mfa auth [suite]',
    { tags: ['@yves', '@customer-account-management'] },
    (): void => {
        const loginPage = container.get(LoginPage);
        const customerOverviewPage = container.get(CustomerOverviewPage);
        const mfaPage = container.get(MultiFactorAuthPage);

        let dynamicFixtures: CustomerMfaAuthDynamicFixtures;
        let staticFixtures: CustomerMfaAuthStaticFixtures;

        retryableBefore((): void => {
            ({ staticFixtures, dynamicFixtures } = Cypress.env());
        });

        it('should setup email MFA', (): void => {
            loginPage.visit();
            loginPage.login({
                email: dynamicFixtures.customer.email,
                password: staticFixtures.defaultPassword
            });

            customerOverviewPage.assertPageLocation();
            mfaPage.visit();

            // Click the activate button for Dummy MFA
            mfaPage.activateMfa('Email');

            // Wait for popup and verification form
            mfaPage.waitForVerificationPopup();

            // Get and verify the code from email
            cy.getMfaCode(dynamicFixtures.customer.email, 'email').then((code) => {
                mfaPage.verifyCode(code);
            });

            // Wait for the page to reload and verify the button changed to Deactivate
            mfaPage.verifyMfaActivated('Email');

            //add helper to clean up the code
            //logout
            //login with mfa

            // Deactivate MFA
            // mfaPage.deactivateMfa('Dummy');
            //
            // // Wait for verification popup and enter code
            // mfaPage.waitForVerificationPopup();
            // mfaPage.verifyCode('123456');
            //
            // // Wait for the page to reload and verify the button changed to Activate
            // mfaPage.verifyMfaDeactivated('Dummy');
        });



        // describe('Invalid MFA code', () => {
        //     it('should show error for invalid code', (): void => {
        //         // Login with credentials
        //         loginPage.visit();
        //         loginPage.login({
        //             email: dynamicFixtures.customer.email,
        //             password: staticFixtures.defaultPassword
        //         });

        //         // Should go to MFA page
        //         cy.url().should('include', '/multi-factor-auth');
        //         mfaPage.assertMfaHandlerWidgetVisible();

        //         // Enter invalid code
        //         mfaPage.selectAuthType('email');
        //         mfaPage.verifyCode('000000');

        //         // Should show error
        //         mfaPage.assertValidationError();
        //     });
        // });    }
});
