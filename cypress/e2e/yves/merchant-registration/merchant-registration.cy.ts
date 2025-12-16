import { container } from '@utils';
import { MerchantRegistrationPage } from '@pages/yves';
import { MerchantRegistrationDynamicFixtures, MerchantRegistrationStaticFixtures } from '@interfaces/yves';
import { MerchantRegistrationListPage, MerchantRegistrationViewPage } from '@pages/backoffice';
import {
  UserLoginScenario,
  MerchantRegistrationApprovalScenario,
  MerchantRegistrationRejectionScenario,
  MerchantActivationScenario,
  UserActivationScenario,
} from '@scenarios/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';

const MESSAGES = {
  EMAIL_ALREADY_REGISTERED: 'Email address already registered',
  MERCHANT_CREATED: 'Merchant has been created',
} as const;

const FOOTER_LINK_TEXT = 'Sell on Spryker';
const PAGE_TITLE = 'Register and get started on the Spryker Marketplace';

describe(
  'merchant registration',
  {
    tags: [
      '@yves',
      '@backoffice',
      '@mp',
      '@merchant-registration',
      'merchant',
      'registration',
      'e2e',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    /* Add b2b-mp ones integrated*/
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }

    const merchantRegistrationPage = container.get(MerchantRegistrationPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const approvalScenario = container.get(MerchantRegistrationApprovalScenario);
    const rejectionScenario = container.get(MerchantRegistrationRejectionScenario);
    const merchantActivationScenario = container.get(MerchantActivationScenario);
    const userActivationScenario = container.get(UserActivationScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let dynamicFixtures: MerchantRegistrationDynamicFixtures;
    let staticFixtures: MerchantRegistrationStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    describe('registration page and form validation', (): void => {
      it('should display page correctly and validate form fields', (): void => {
        cy.visit('/');
        merchantRegistrationPage.assertFooterLinkExists(FOOTER_LINK_TEXT);
        merchantRegistrationPage.clickFooterLink();
        merchantRegistrationPage.assertPageLoaded();
        merchantRegistrationPage.assertPageTitle(PAGE_TITLE);
        merchantRegistrationPage.assertCompanySectionVisible();
        merchantRegistrationPage.assertAccountSectionVisible();

        merchantRegistrationPage.submitForm();
        merchantRegistrationPage.assertValidationErrors();
        merchantRegistrationPage.assertFormNotSubmitted();

        merchantRegistrationPage.visit();
        merchantRegistrationPage.register({
          contactPerson: { email: 'invalid-email-format' },
        });
        merchantRegistrationPage.assertValidationErrors();
        merchantRegistrationPage.assertFormNotSubmitted();
      });
    });

    describe('back office list page', (): void => {
      const merchantRegistrationListPage = container.get(MerchantRegistrationListPage);
      const merchantRegistrationViewPage = container.get(MerchantRegistrationViewPage);
      let sharedRegistrationData: ReturnType<typeof merchantRegistrationPage.register>;

      before((): void => {
        cy.visit('/');
        merchantRegistrationPage.visit();
        sharedRegistrationData = merchantRegistrationPage.register();
        merchantRegistrationPage.assertSuccessMessage();
      });

      it('should manage registrations and add internal notes in back office', (): void => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });
        merchantRegistrationListPage.visit();

        merchantRegistrationListPage.assertPageLoaded();
        merchantRegistrationListPage.assertTableHeaders();

        merchantRegistrationListPage.sortByColumn('Created');
        merchantRegistrationListPage.assertTableVisible();
        merchantRegistrationListPage.sortByColumn('Merchant');
        merchantRegistrationListPage.assertTableVisible();

        merchantRegistrationListPage.searchByTerm(sharedRegistrationData.email);
        merchantRegistrationListPage.assertRegistrationExists(sharedRegistrationData.email);
        merchantRegistrationListPage.assertRegistrationWithStatus(sharedRegistrationData.email, 'Pending');
        merchantRegistrationListPage.assertStatusColor('Pending');

        merchantRegistrationListPage.filterByStatus('Pending');

        merchantRegistrationListPage.viewRegistrationByIndex(0);
        cy.url().should('include', '/merchant-registration-request/view');

        const noteText = `Test note added at ${new Date().toISOString()}`;
        merchantRegistrationViewPage.addInternalNote(noteText);
        merchantRegistrationViewPage.assertNoteAdded(noteText);
      });
    });

    describe('e2e workflow', (): void => {
      it('should handle full workflow with rejection and re-registration', (): void => {
        cy.visit('/');
        merchantRegistrationPage.visit();
        const registrationData = merchantRegistrationPage.register();
        merchantRegistrationPage.assertSuccessMessage();

        merchantRegistrationPage.visit();
        merchantRegistrationPage.register({
          contactPerson: { email: registrationData.email },
        });
        merchantRegistrationPage.assertErrorMessage(MESSAGES.EMAIL_ALREADY_REGISTERED);

        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        rejectionScenario.execute({
          email: registrationData.email,
        });

        merchantRegistrationPage.visit();
        const reRegistrationData = merchantRegistrationPage.register({
          contactPerson: { email: registrationData.email },
        });
        merchantRegistrationPage.assertSuccessMessage();

        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        approvalScenario.execute({
          email: reRegistrationData.email,
        });

        merchantActivationScenario.execute({
          companyName: reRegistrationData.companyName,
        });

        userActivationScenario.execute({
          email: reRegistrationData.email,
        });

        merchantUserLoginScenario.execute({
          username: reRegistrationData.email,
          password: staticFixtures.merchantUserPassword,
        });
      });

      it('should complete simple approval workflow', (): void => {
        merchantRegistrationPage.visit();
        const registrationData = merchantRegistrationPage.register();
        merchantRegistrationPage.assertSuccessMessage();

        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        approvalScenario.execute({
          email: registrationData.email,
        });

        merchantActivationScenario.execute({
          companyName: registrationData.companyName,
        });

        userActivationScenario.execute({
          email: registrationData.email,
        });

        merchantUserLoginScenario.execute({
          username: registrationData.email,
          password: staticFixtures.merchantUserPassword,
        });
      });
    });
  }
);
