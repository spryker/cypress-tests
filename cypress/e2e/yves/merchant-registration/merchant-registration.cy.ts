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
    tags: ['@yves', '@backoffice', '@mp', '@merchant-registration', 'merchant', 'registration', 'e2e'],
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

    describe('page access and display', (): void => {
      it('should load registration page with all sections', (): void => {
        merchantRegistrationPage.visit();
        merchantRegistrationPage.assertPageLoaded();
        merchantRegistrationPage.assertPageTitle(PAGE_TITLE);
        merchantRegistrationPage.assertCompanySectionVisible();
        merchantRegistrationPage.assertAccountSectionVisible();
      });
    });

    describe('form validation', (): void => {
      beforeEach((): void => {
        merchantRegistrationPage.visit();
      });

      it('should show validation errors when submitting empty form', (): void => {
        merchantRegistrationPage.submitForm();
        merchantRegistrationPage.assertValidationErrors();
        merchantRegistrationPage.assertFormNotSubmitted();
      });

      it('should show validation error for invalid email format', (): void => {
        merchantRegistrationPage.register({
          contactPerson: { email: 'invalid-email-format' },
        });
        merchantRegistrationPage.assertValidationErrors();
        merchantRegistrationPage.assertFormNotSubmitted();
      });

      it('should show validation error when terms are not accepted', (): void => {
        merchantRegistrationPage.fillFormWithoutTerms();
        merchantRegistrationPage.assertValidationErrors();
        merchantRegistrationPage.assertFormNotSubmitted();
      });
    });

    describe('footer link navigation', (): void => {
      it('should display footer link and navigate to registration page', (): void => {
        cy.visit('/');
        merchantRegistrationPage.assertFooterLinkExists(FOOTER_LINK_TEXT);
        merchantRegistrationPage.clickFooterLink();
        merchantRegistrationPage.assertPageLoaded();
      });
    });

    describe('back office list page', (): void => {
      const merchantRegistrationListPage = container.get(MerchantRegistrationListPage);
      let sharedRegistrationData: ReturnType<typeof merchantRegistrationPage.register>;

      before((): void => {
        merchantRegistrationPage.visit();
        sharedRegistrationData = merchantRegistrationPage.register();
        merchantRegistrationPage.assertSuccessMessage();
      });

      beforeEach((): void => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });
        merchantRegistrationListPage.visit();
      });

      it('should display page with table and headers', (): void => {
        merchantRegistrationListPage.assertPageLoaded();
        merchantRegistrationListPage.assertTableHeaders();
      });

      it('should allow sorting by columns', (): void => {
        merchantRegistrationListPage.sortByColumn('Created');
        merchantRegistrationListPage.assertTableVisible();

        merchantRegistrationListPage.sortByColumn('Merchant');
        merchantRegistrationListPage.assertTableVisible();
      });

      it('should search registrations by email', (): void => {
        merchantRegistrationListPage.searchByTerm(sharedRegistrationData.email);
        merchantRegistrationListPage.assertRegistrationExists(sharedRegistrationData.email);
      });

      it('should display registration with pending status', (): void => {
        merchantRegistrationListPage.searchByTerm(sharedRegistrationData.email);
        merchantRegistrationListPage.assertRegistrationWithStatus(sharedRegistrationData.email, 'Pending');
      });

      it('should show status color badges', (): void => {
        merchantRegistrationListPage.assertStatusColor('Pending');
      });

      it('should view registration by index', (): void => {
        merchantRegistrationListPage.viewRegistrationByIndex(0);
        cy.url().should('include', '/merchant-registration-request/view');
      });

      it('should filter registrations by status', (): void => {
        merchantRegistrationListPage.filterByStatus('Pending');
      });
    });

    describe('internal notes', (): void => {
      const merchantRegistrationListPage = container.get(MerchantRegistrationListPage);
      const merchantRegistrationViewPage = container.get(MerchantRegistrationViewPage);

      it('should add and display internal note', (): void => {
        merchantRegistrationPage.visit();
        const registrationData = merchantRegistrationPage.register();
        merchantRegistrationPage.assertSuccessMessage();

        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        merchantRegistrationListPage.visit();
        merchantRegistrationListPage.viewRegistrationByEmail(registrationData.email);

        const noteText = `Test note added at ${new Date().toISOString()}`;
        merchantRegistrationViewPage.addInternalNote(noteText);
        merchantRegistrationViewPage.assertNoteAdded(noteText);
      });
    });

    describe('e2e workflow', (): void => {
      it('should handle full workflow with rejection and re-registration', (): void => {
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
