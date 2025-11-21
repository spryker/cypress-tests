import { injectable } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class MerchantRegistrationViewPage extends BackofficePage {
  protected PAGE_URL = '/merchant-registration-request/view';

  // Selectors
  private readonly pageTitle = 'h1, .page-header h1';

  // Sections - using widget structure
  private readonly companyInfoSection = '.ibox:contains("Company Information")';
  private readonly contactPersonSection = '.ibox:contains("Contact Person")';

  // Generic field selector - Spryker GUI uses .row.form-group structure
  private getFieldValue(labelText: string): Cypress.Chainable {
    return cy.contains('.row.form-group', labelText).find('.col-sm-10, .col-xs-10');
  }

  // Status
  private readonly statusBadge = '.label';
  private readonly statusPending = '.label-warning';
  private readonly statusAccepted = '.label-success';
  private readonly statusRejected = '.label-danger';

  // Action Buttons
  private readonly createMerchantButton = 'a.btn.btn-success:contains("Create Merchant")';
  private readonly rejectMerchantButton = 'a.btn.btn-danger:contains("Decline Merchant")';

  // Confirmation Dialogs
  private readonly confirmDialog = '.sweet-alert';
  private readonly dialogTitle = '.sweet-alert h2';
  private readonly dialogMessage = '.sweet-alert p';
  private readonly confirmButton = '.sweet-alert button.confirm';
  private readonly cancelButton = '.sweet-alert button.cancel';

  // Messages
  private readonly successMessage = '.alert-success, .flash-success';
  private readonly errorMessage = '.alert-danger, .flash-error';

  private readonly notesTextarea = 'textarea[name="message"]';
  private readonly addNoteButton = 'button[type="submit"]:contains("Send")';
  private readonly commentMessage = '.comment__message';

  viewRequest(requestId: number): void {
    cy.visitBackoffice(`${this.PAGE_URL}/${requestId}`);
  }

  assertPageLoaded(): void {
    cy.url().should('include', this.PAGE_URL);
  }

  assertSectionsVisible(): void {
    cy.get(this.companyInfoSection).should('be.visible');
    cy.get(this.contactPersonSection).should('be.visible');
  }

  assertStatus(expectedStatus: 'Pending' | 'Accepted' | 'Rejected'): void {
    cy.get(this.statusBadge).should('contain.text', expectedStatus);
  }

  assertStatusColor(status: 'Pending' | 'Accepted' | 'Rejected'): void {
    const statusSelector = {
      Pending: this.statusPending,
      Accepted: this.statusAccepted,
      Rejected: this.statusRejected,
    }[status];

    cy.get(statusSelector).should('exist');
  }

  assertCompanyInformation(expectedData: {
    companyName?: string;
    country?: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    registrationNumber?: string;
  }): void {
    if (expectedData.companyName) {
      cy.contains(expectedData.companyName).should('be.visible');
    }
    if (expectedData.country) {
      cy.contains(expectedData.country).should('be.visible');
    }
    if (expectedData.street) {
      cy.contains(expectedData.street).should('be.visible');
    }
  }

  assertContactPersonInformation(expectedData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  }): void {
    if (expectedData.firstName) {
      cy.contains(expectedData.firstName).should('be.visible');
    }
    if (expectedData.lastName) {
      cy.contains(expectedData.lastName).should('be.visible');
    }
    if (expectedData.email) {
      cy.contains(expectedData.email).should('be.visible');
    }
    if (expectedData.role) {
      cy.contains(expectedData.role).should('be.visible');
    }
  }

  // Action Buttons Assertions
  assertCreateMerchantButtonVisible(): void {
    cy.get(this.createMerchantButton).should('be.visible').and('not.be.disabled');
  }

  assertRejectMerchantButtonVisible(): void {
    cy.get(this.rejectMerchantButton).should('be.visible').and('not.be.disabled');
  }

  assertActionButtonsNotVisible(): void {
    cy.get(this.createMerchantButton).should('not.exist');
    cy.get(this.rejectMerchantButton).should('not.exist');
  }

  // Approval Flow
  clickCreateMerchant(): void {
    cy.get(this.createMerchantButton).click();
  }

  approveRequest(): void {
    this.clickCreateMerchant();
    cy.url().should('include', '/accept-merchant-registration-request');
    cy.get('button.btn.btn-success.safe-submit').click();
  }

  // Rejection Flow
  clickRejectMerchant(): void {
    cy.get(this.rejectMerchantButton).click();
  }

  rejectRequest(): void {
    this.clickRejectMerchant();
    cy.url().should('include', '/reject-merchant-registration-request');
    cy.get('button.btn.btn-danger.safe-submit').click();
  }

  // Success Messages
  assertSuccessMessage(expectedMessage: string): void {
    cy.get(this.successMessage).should('be.visible').and('contain.text', expectedMessage);
  }

  assertMerchantCreatedMessage(): void {
    this.assertSuccessMessage('Merchant has been created');
  }

  assertMerchantRejectedMessage(): void {
    this.assertSuccessMessage('Merchant has been rejected');
  }

  // Internal Notes
  addInternalNote(noteText: string): void {
    cy.get(this.notesTextarea).type(noteText);
    cy.get(this.addNoteButton).click();
  }

  assertNoteAdded(noteText: string): void {
    cy.get(this.commentMessage).contains(noteText).should('be.visible');
  }
}
