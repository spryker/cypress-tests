import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CompanyUserInvitationRepository } from './company-user-invitation-repository';

const NEWEST_FIRST_SORT_BASE = 10 ** 13;

@injectable()
@autoWired
export class CompanyUserInvitationPage extends YvesPage {
  @inject(REPOSITORIES.CompanyUserInvitationRepository) private repository: CompanyUserInvitationRepository;

  protected PAGE_URL = '/company/user-invitation';

  // The email is generated per call, not taken from a fixture: the import rejects an email that is already
  // in use, so a fixed email would fail on every re-run. The list shows 10 invitations per page sorted by
  // email, and retried tests import into the same company, so the email starts with a key that decreases
  // over time: the newest invitation is always on the first page.
  createInvitation = (businessUnitName: string): Invitation => ({
    firstName: this.faker.person.firstName().replace(/[^A-Za-z]/g, ''),
    lastName: this.faker.person.lastName().replace(/[^A-Za-z]/g, ''),
    email: `${String(NEWEST_FIRST_SORT_BASE - Date.now()).padStart(13, '0')}-${this.faker.string.alphanumeric(8).toLowerCase()}@spryker.com`,
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
    this.repository.getInvitationRow(email).find(this.repository.getSendButtonSelector()).click();
  };

  resendInvitation = (email: string): void => {
    this.repository.getInvitationRow(email).find(this.repository.getResendButtonSelector()).click();
    this.repository.getResendConfirmButton().click();
  };

  deleteInvitation = (email: string): void => {
    this.repository.getInvitationRow(email).find(this.repository.getDeleteButtonSelector()).click();
    this.repository.getDeleteConfirmButton().click();
  };

  getInvitationRow = (email: string): Cypress.Chainable => this.repository.getInvitationRow(email);

  getInvitationStatus = (email: string): Cypress.Chainable =>
    this.repository.getInvitationRow(email).find(this.repository.getInvitationStatusSelector());

  getImportForm = (): Cypress.Chainable => this.repository.getImportForm();

  getFlashMessages = (): Cypress.Chainable => this.repository.getFlashMessages();
}

export interface Invitation {
  firstName: string;
  lastName: string;
  email: string;
  businessUnitName: string;
}
