import { injectable } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class MerchantRegistrationViewPage extends BackofficePage {
  protected PAGE_URL = '/merchant-registration-request/view';

  // Action Buttons
  private readonly createMerchantButton = 'a.btn.btn-success:contains("Create Merchant")';
  private readonly rejectMerchantButton = 'a.btn.btn-danger:contains("Decline Merchant")';

  // Internal Notes
  private readonly notesTextarea = 'textarea[name="message"]';
  private readonly addNoteButton = 'button[type="submit"]:contains("Send")';
  private readonly commentMessage = '.comment__message';

  viewRequest(requestId: number): void {
    cy.visitBackoffice(`${this.PAGE_URL}/${requestId}`);
  }

  // Approval Flow
  clickCreateMerchant(): void {
    cy.get(this.createMerchantButton).click();
  }

  approveRequest(): void {
    this.clickCreateMerchant();
    // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Internal synchronization guard: waits for navigation to the accept page between clicks.
    cy.url().should('include', '/accept-merchant-registration-request');
    cy.get('button.btn.btn-success.safe-submit').click();
  }

  // Rejection Flow
  clickRejectMerchant(): void {
    cy.get(this.rejectMerchantButton).click();
  }

  rejectRequest(): void {
    this.clickRejectMerchant();
    // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Internal synchronization guard: waits for navigation to the reject page between clicks.
    cy.url().should('include', '/reject-merchant-registration-request');
    cy.get('button.btn.btn-danger.safe-submit').click();
  }

  // Internal Notes
  addInternalNote(noteText: string): void {
    cy.get(this.notesTextarea).type(noteText);
    cy.get(this.addNoteButton).click();
  }

  getCommentMessage = (): Cypress.Chainable => cy.get(this.commentMessage);
}
