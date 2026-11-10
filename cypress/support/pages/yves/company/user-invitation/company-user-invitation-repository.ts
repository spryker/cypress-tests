export interface CompanyUserInvitationRepository {
  getImportFileInput(): Cypress.Chainable;
  getImportSubmitButton(): Cypress.Chainable;
  getImportForm(): Cypress.Chainable;
  getInvitationRow(email: string): Cypress.Chainable;
  getInvitationStatusSelector(): string;
  getSendButtonSelector(): string;
  getResendButtonSelector(): string;
  getDeleteButtonSelector(): string;
  getResendConfirmButton(): Cypress.Chainable;
  getDeleteConfirmButton(): Cypress.Chainable;
  getFlashMessages(): Cypress.Chainable;
}
