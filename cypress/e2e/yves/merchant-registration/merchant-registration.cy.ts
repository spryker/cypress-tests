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
        merchantRegistrationPage.getFooterLink().should('be.visible').should('contain.text', FOOTER_LINK_TEXT);
        merchantRegistrationPage.clickFooterLink();
        cy.url().should('include', '/merchant-registration-request');
        merchantRegistrationPage.getTitle().should('be.visible');
        merchantRegistrationPage.getTitle().should('contain.text', PAGE_TITLE);
        merchantRegistrationPage.getCompanySection().should('be.visible');
        merchantRegistrationPage.getAccountSection().should('be.visible');

        merchantRegistrationPage.submitForm();
        merchantRegistrationPage.getValidationErrors().should('have.length.greaterThan', 0);
        cy.url().should('include', '/merchant-registration-request');

        merchantRegistrationPage.visit();
        merchantRegistrationPage.register({
          contactPerson: { email: 'invalid-email-format' },
        });
        merchantRegistrationPage.getValidationErrors().should('have.length.greaterThan', 0);
        cy.url().should('include', '/merchant-registration-request');
      });
    });

    describe('back office list page', (): void => {
      const merchantRegistrationListPage = container.get(MerchantRegistrationListPage);
      const merchantRegistrationViewPage = container.get(MerchantRegistrationViewPage);
      let sharedRegistrationData: ReturnType<typeof merchantRegistrationPage.register>;

      before((): void => {
        merchantRegistrationPage.visit();
        sharedRegistrationData = merchantRegistrationPage.register();
        merchantRegistrationPage.getSuccessMessage().should('exist').and('not.have.css', 'visibility', 'hidden');
      });

      it('should manage registrations and add internal notes in back office', (): void => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });
        merchantRegistrationListPage.visit();

        cy.url().should('include', '/merchant-registration-request/list');
        merchantRegistrationListPage.getTable().should('be.visible');
        merchantRegistrationListPage.getTableHeader().contains('ID').should('be.visible');
        merchantRegistrationListPage.getTableHeader().contains('Created').should('be.visible');
        merchantRegistrationListPage.getTableHeader().contains('Merchant').should('be.visible');
        merchantRegistrationListPage
          .getTableHeader()
          .contains(/Full name|Name/)
          .should('be.visible');
        merchantRegistrationListPage.getTableHeader().contains('Email').should('be.visible');
        merchantRegistrationListPage.getTableHeader().contains('Status').should('be.visible');
        merchantRegistrationListPage.getTableHeader().contains('Actions').should('be.visible');

        merchantRegistrationListPage.sortByColumn('Created');
        merchantRegistrationListPage.getTable().should('be.visible');
        merchantRegistrationListPage.sortByColumn('Merchant');
        merchantRegistrationListPage.getTable().should('be.visible');

        merchantRegistrationListPage.searchByTerm(sharedRegistrationData.email);
        merchantRegistrationListPage.getTableRows().contains(sharedRegistrationData.email).should('exist');
        merchantRegistrationListPage
          .getStatusCellForEmail(sharedRegistrationData.email)
          .should('contain.text', 'Pending');
        merchantRegistrationListPage.getStatusBadge('Pending').should('exist');

        merchantRegistrationListPage.getStatusColumnCells().contains('Pending').should('be.visible');

        merchantRegistrationListPage.viewRegistrationByIndex(0);
        cy.url().should('include', '/merchant-registration-request/view');

        const noteText = `Test note added at ${new Date().toISOString()}`;
        merchantRegistrationViewPage.addInternalNote(noteText);
        merchantRegistrationViewPage.getCommentMessage().contains(noteText).should('be.visible');
      });
    });

    describe('e2e workflow', (): void => {
      it('should handle full workflow with rejection and re-registration', (): void => {
        merchantRegistrationPage.visit();
        const registrationData = merchantRegistrationPage.register();
        merchantRegistrationPage.getSuccessMessage().should('exist').and('not.have.css', 'visibility', 'hidden');

        merchantRegistrationPage.visit();
        merchantRegistrationPage.register({
          contactPerson: { email: registrationData.email },
        });
        merchantRegistrationPage.getErrorFlashMessage({ timeout: 10000 }).should('exist').and('be.visible');
        merchantRegistrationPage.getErrorFlashMessage().should('contain.text', MESSAGES.EMAIL_ALREADY_REGISTERED);

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
        merchantRegistrationPage.getSuccessMessage().should('exist').and('not.have.css', 'visibility', 'hidden');

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
        merchantRegistrationPage.getSuccessMessage().should('exist').and('not.have.css', 'visibility', 'hidden');

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
