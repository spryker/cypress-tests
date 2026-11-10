import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CompanyUserInvitationRepository } from './company-user-invitation-repository';

const MAX_INVITATION_LIST_PAGES = 20;

@injectable()
@autoWired
export class CompanyUserInvitationPage extends YvesPage {
  @inject(REPOSITORIES.CompanyUserInvitationRepository) private repository: CompanyUserInvitationRepository;

  protected PAGE_URL = '/company/user-invitation';

  createInvitation = (businessUnitName: string): Invitation => ({
    firstName: this.faker.person.firstName().replace(/[^A-Za-z]/g, ''),
    lastName: this.faker.person.lastName().replace(/[^A-Za-z]/g, ''),
    email: `${Date.now()}-${this.faker.string.alphanumeric(8).toLowerCase()}@spryker.com`,
    businessUnitName,
  });

  importInvitations = (invitations: Invitation[]): void => {
    const rows = invitations.map((invitation) =>
      [invitation.firstName, invitation.lastName, invitation.email, invitation.businessUnitName].join(',')
    );

    this.importFile(['first_name,last_name,email,business_unit', ...rows].join('\n'), 'invitations.csv');
  };

  importFile = (contents: string, fileName: string): void => {
    this.repository.getImportFileInput().selectFile({
      contents: Cypress.Buffer.from(contents),
      fileName,
      mimeType: 'text/csv',
    });
    this.repository.getImportSubmitButton().click();
  };

  sendInvitation = (email: string): void => {
    this.findInvitationRow(email).find(this.repository.getSendButtonSelector()).click();
  };

  resendInvitation = (email: string): void => {
    this.findInvitationRow(email).find(this.repository.getResendButtonSelector()).click();
    this.repository.getResendConfirmButton().click();
  };

  deleteInvitation = (email: string): void => {
    this.findInvitationRow(email).find(this.repository.getDeleteButtonSelector()).click();
    this.repository.getDeleteConfirmButton().click();
  };

  getInvitationRow = (email: string): Cypress.Chainable => this.repository.getInvitationRow(email);

  getInvitationStatus = (email: string): Cypress.Chainable =>
    this.findInvitationRow(email).find(this.repository.getInvitationStatusSelector());

  getImportForm = (): Cypress.Chainable => this.repository.getImportForm();

  getFlashMessages = (): Cypress.Chainable => this.repository.getFlashMessages();

  private findInvitationRow = (email: string, page = 1): Cypress.Chainable =>
    cy.get('body').then(($body) => {
      if ($body.text().includes(email)) {
        return this.repository.getInvitationRow(email);
      }

      if (page >= MAX_INVITATION_LIST_PAGES) {
        throw new Error(`Invitation ${email} is not found on the first ${MAX_INVITATION_LIST_PAGES} list pages.`);
      }

      this.visit({ qs: { page: page + 1 } });

      return this.findInvitationRow(email, page + 1);
    });
}

export interface Invitation {
  firstName: string;
  lastName: string;
  email: string;
  businessUnitName: string;
}
