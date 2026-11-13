import { container } from '@utils';
import { CompanyUserInvitationPage } from '@pages/yves';
import { CompanyUserInvitationDynamicFixtures, CompanyUserInvitationStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'company user invitation',
  { tags: ['@yves', '@company-account', '@company-user-invitation', 'company-account', 'spryker-core'] },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const companyUserInvitationPage = container.get(CompanyUserInvitationPage);

    let staticFixtures: CompanyUserInvitationStaticFixtures;
    let dynamicFixtures: CompanyUserInvitationDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      companyUserInvitationPage.visit();
    });

    it('company admin should be able to import invitations from a CSV file', (): void => {
      const invitations = [
        companyUserInvitationPage.createInvitation(dynamicFixtures.businessUnit.name),
        companyUserInvitationPage.createInvitation(dynamicFixtures.businessUnit.name),
      ];

      companyUserInvitationPage.importInvitations(invitations);

      invitations.forEach((invitation) => {
        companyUserInvitationPage
          .getInvitationStatus(invitation.email)
          .should('contain', staticFixtures.invitationStatusNotSent);
      });
    });

    it('company admin should be able to import a CSV file that the browser sends as an Excel file', (): void => {
      const invitation = companyUserInvitationPage.createInvitation(dynamicFixtures.businessUnit.name);

      companyUserInvitationPage.importInvitationsWithMimeType([invitation], staticFixtures.excelCsvMimeType);

      companyUserInvitationPage
        .getInvitationStatus(invitation.email)
        .should('contain', staticFixtures.invitationStatusNotSent);
    });

    it('company admin should see a validation error when the import file has a wrong header', (): void => {
      companyUserInvitationPage.importFile('name,mail\nJohn,john@spryker.com', 'invitations.csv');

      companyUserInvitationPage.getImportForm().should('contain', staticFixtures.invalidFileMessage);
    });

    it('company admin should be able to send an invitation', (): void => {
      const invitation = companyUserInvitationPage.createInvitation(dynamicFixtures.businessUnit.name);
      companyUserInvitationPage.importInvitations([invitation]);

      companyUserInvitationPage.sendInvitation(invitation.email);

      companyUserInvitationPage.getFlashMessages().should('contain', staticFixtures.invitationSentMessage);
      companyUserInvitationPage
        .getInvitationStatus(invitation.email)
        .should('contain', staticFixtures.invitationStatusPending);
    });

    it('company admin should be able to resend a sent invitation', (): void => {
      const invitation = companyUserInvitationPage.createInvitation(dynamicFixtures.businessUnit.name);
      companyUserInvitationPage.importInvitations([invitation]);
      companyUserInvitationPage.sendInvitation(invitation.email);

      companyUserInvitationPage.resendInvitation(invitation.email);

      companyUserInvitationPage.getFlashMessages().should('contain', staticFixtures.invitationResentMessage);
    });

    it('company admin should be able to delete an invitation', (): void => {
      const invitation = companyUserInvitationPage.createInvitation(dynamicFixtures.businessUnit.name);
      companyUserInvitationPage.importInvitations([invitation]);

      companyUserInvitationPage.deleteInvitation(invitation.email);

      companyUserInvitationPage.getFlashMessages().should('contain', staticFixtures.invitationDeletedMessage);
      companyUserInvitationPage.getInvitationRow(invitation.email).should('not.exist');
    });
  }
);
