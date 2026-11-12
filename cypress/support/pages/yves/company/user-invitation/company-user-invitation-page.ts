import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CompanyUserInvitationRepository } from './company-user-invitation-repository';

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
    this.importFile(this.createInvitationFileContents(invitations), 'invitations.csv');
  };

  importInvitationsWithMimeType = (invitations: Invitation[], mimeType: string): void => {
    this.importFile(this.createInvitationFileContents(invitations), 'invitations.csv', mimeType);
  };

  importFile = (contents: string, fileName: string, mimeType = 'text/csv'): void => {
    this.repository.getImportFileInput().selectFile({
      contents: Cypress.Buffer.from(contents),
      fileName,
      mimeType,
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

  getInvitationStatus = (email: string): Cypress.Chainable => this.repository.getInvitationStatus(email);

  getImportForm = (): Cypress.Chainable => this.repository.getImportForm();

  getFlashMessages = (): Cypress.Chainable => this.repository.getFlashMessages();

  private createInvitationFileContents = (invitations: Invitation[]): string => {
    const rows = invitations.map((invitation) =>
      [invitation.firstName, invitation.lastName, invitation.email, invitation.businessUnitName].join(',')
    );

    return ['first_name,last_name,email,business_unit', ...rows].join('\n');
  };
}

export interface Invitation {
  firstName: string;
  lastName: string;
  email: string;
  businessUnitName: string;
}
