import { injectable } from 'inversify';
import { ClaimRepository } from '../claim-repository';
import Chainable = Cypress.Chainable;

@injectable()
export class SuiteClaimRepository implements ClaimRepository {
  private readonly selectors = {
    claimForm: 'form[name="claimForm"]',
    orderReferenceInput: 'input[name="claimForm[orderReference]"]',
    typeSelect: 'select[name="claimForm[type_display]"]',
    typeOptions: 'select[name="claimForm[type_display]"] option',
    subjectInput: 'input[name="claimForm[subject]"]',
    descriptionTextarea: 'textarea[name="claimForm[description]"]',
    fileInput: 'input[name="claimForm[files][]"]',
    submitButton: 'button[type="submit"]',
  };

  getCreateGeneralClaimButton(): Cypress.Chainable {
    return cy.get('a[data-qa="create-general-claim"]');
  }

  getCreateOrderClaimButton(): Cypress.Chainable {
    return cy.get('a[data-qa="create-order-claim"]');
  }

  getClaimCreatedMessage(): string {
    return 'Claim has been submitted successfully';
  }

  getClaimDetailsReference(reference: string): string {
    return `Reference: ${reference}`;
  }

  getClaimDetailsOrderReference(orderReference: string): string {
    return `Order Reference: ${orderReference}`;
  }

  getClaimDetailsDate(date: string): string {
    return `Date: ${date}`;
  }

  getClaimDetailsStatus(status: string): string {
    return `Status: ${status}`;
  }

  getClaimDetailsType(type: string): string {
    return `Type: ${type}`;
  }
  getClaimDetailsSubject(subject: string): string {
    return `Subject: ${subject}`;
  }
  getClaimDetailsDescription(desctiption: string): string {
    return `Description: ${desctiption}`;
  }

  getClaimDetailsCustomerFirstName(firstName: string): string {
    return `First Name: ${firstName}`;
  }

  getClaimDetailsCustomerLastName(lastName: string): string {
    return `Last Name: ${lastName}`;
  }

  getClaimDetailsCustomerEmail(email: string): string {
    return `E-mail: ${email}`;
  }

  getClaimDetailsCompanyAndBusinessUnitName(companyName: string, businessUnitName: string): string {
    return `Company / Business Unit: ${companyName} / ${businessUnitName}`;
  }

  getCancelClaimButton(): Cypress.Chainable {
    return cy.get('button[data-qa="cancel-claim"]');
  }

  getCanceledClaimStatusSelector(): string {
    return '.claim-status--canceled';
  }

  // New selectors for claim list table
  private readonly claimTable = '[data-qa="component claim-table"] table';
  private readonly tableRow = 'tbody tr';
  private readonly viewButton = '[data-qa="claim-details"]';
  private readonly reference = '[data-qa="claim-reference"]';

  // New method to get first row view button
  getFirstRowViewButton(): Chainable {
    return cy.get(this.claimTable).find(this.tableRow).first().find(this.viewButton);
  }

  getFirstRowReference(): string {
    let referenceText = '';
    cy.get(this.claimTable)
      .find(this.tableRow)
      .first()
      .find(this.reference)
      .invoke('text')
      .then((text) => {
        referenceText = text;
      });
    return referenceText;
  }

  // Add method to interface
  getClaimDetailLinks(): Chainable {
    return cy.get(this.viewButton);
  }

  getClaimForm(): Cypress.Chainable {
    return cy.get(this.selectors.claimForm);
  }

  getOrderReferenceInput(): Cypress.Chainable {
    return this.getClaimForm().find(this.selectors.orderReferenceInput);
  }

  getTypeSelect(): Cypress.Chainable {
    return this.getClaimForm().find(this.selectors.typeSelect);
  }

  getTypeOptions(): Cypress.Chainable {
    return cy.get(this.selectors.typeOptions);
  }

  getSubjectInput(): Cypress.Chainable {
    return this.getClaimForm().find(this.selectors.subjectInput);
  }

  getDescriptionTextarea(): Cypress.Chainable {
    return this.getClaimForm().find(this.selectors.descriptionTextarea);
  }

  getFileInput(): Cypress.Chainable {
    return this.getClaimForm().find(this.selectors.fileInput);
  }

  getSubmitButton(): Cypress.Chainable {
    return this.getClaimForm().find(this.selectors.submitButton);
  }
}
