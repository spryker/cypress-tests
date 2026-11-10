import { injectable } from 'inversify';
import { CompanyUserInvitationRepository } from '../company-user-invitation-repository';

@injectable()
export class SuiteCompanyUserInvitationRepository implements CompanyUserInvitationRepository {
  getImportFileInput = (): Cypress.Chainable =>
    cy.get('[data-qa="invitation-import-form"] [name="company_user_invitation_form[invitations_list]"]');
  getImportSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="invitation-import-form"] [type="submit"]');
  getImportForm = (): Cypress.Chainable => cy.get('[data-qa="invitation-import-form"]');
  getInvitationRow = (email: string): Cypress.Chainable => cy.contains('[data-qa="invitation-row"]', email);
  getInvitationStatusSelector = (): string => '[data-qa="invitation-status"]';
  getSendButtonSelector = (): string => '[data-qa="invitation-send-button"]';
  getResendButtonSelector = (): string => '[data-qa="invitation-resend-button"]';
  getDeleteButtonSelector = (): string => '[data-qa="invitation-delete-button"]';
  getResendConfirmButton = (): Cypress.Chainable => cy.get('[data-qa="invitation-resend-confirm-button"]');
  getDeleteConfirmButton = (): Cypress.Chainable => cy.get('[data-qa="invitation-delete-confirm-button"]');
  getFlashMessages = (): Cypress.Chainable => cy.get('[data-qa="component notification-area"] flash-message');
}
