import { injectable } from 'inversify';
import { CompanyUserInvitationRepository } from '../company-user-invitation-repository';

const INVITATION_STATUS_HEADER = /^\s*Status\s*$/;

// The b2b-mp shop overrides the invitation templates without data-qa hooks, so the selectors use the
// form name, the action URLs and the column header.
@injectable()
export class B2bMpCompanyUserInvitationRepository implements CompanyUserInvitationRepository {
  getImportFileInput = (): Cypress.Chainable =>
    cy.get('form[name="company_user_invitation_form"] [name="company_user_invitation_form[invitations_list]"]');
  getImportSubmitButton = (): Cypress.Chainable => cy.get('form[name="company_user_invitation_form"] [type="submit"]');
  getImportForm = (): Cypress.Chainable => cy.get('form[name="company_user_invitation_form"]');
  getInvitationRow = (email: string): Cypress.Chainable =>
    cy.contains('[data-qa="component invitation-table"] tbody tr', email);
  getInvitationStatus = (email: string): Cypress.Chainable =>
    cy
      .contains('[data-qa="component invitation-table"] thead th', INVITATION_STATUS_HEADER)
      .invoke('index')
      .then((statusColumnIndex) => this.getInvitationRow(email).find('td').eq(Number(statusColumnIndex)));
  getSendButtonSelector = (): string => 'a[href*="user-invitation/send"]';
  getResendButtonSelector = (): string => 'a[href*="user-invitation/resend"]';
  getDeleteButtonSelector = (): string => 'a[href*="user-invitation/delete"]';
  getResendConfirmButton = (): Cypress.Chainable => cy.get('a[href*="user-invitation/resend/confirm"]');
  getDeleteConfirmButton = (): Cypress.Chainable => cy.get('a[href*="user-invitation/delete/confirm"]');
  getFlashMessages = (): Cypress.Chainable => cy.get('[data-qa="component notification-area"] flash-message');
}
