import { injectable } from 'inversify';
import { SspInquiryRepository } from '../ssp-inquiry-repository';
import Chainable = Cypress.Chainable;

@injectable()
export class B2bMpSspInquiryRepository implements SspInquiryRepository {
  private readonly selectors = {
    sspInquiryForm: 'form[name="sspInquiryForm"]',
    orderReferenceInput: 'input[name="sspInquiryForm[orderReference]"]',
    sspAssetReferenceInput: 'input[name="sspInquiryForm[sspAssetReference]"]',
    typeSelect: 'select[name="sspInquiryForm[type_display]"]',
    typeOptions: 'select[name="sspInquiryForm[type_display]"] option',
    subjectInput: 'input[name="sspInquiryForm[subject]"]',
    descriptionTextarea: 'textarea[name="sspInquiryForm[description]"]',
    fileInput: 'input[name="sspInquiryForm[files][]"]',
    submitButton: 'button[type="submit"]',
    sspInquirySearchForm: 'form[name="sspInquirySearchForm"]',
    sspInquirySearchFormSubmitButton: '[data-qa="submit-filters"]',
  };

  getCreateGeneralSspInquiryButton(): Cypress.Chainable {
    return cy.get('a[data-qa="create-general-ssp-inquiry"]');
  }

  getCreateOrderSspInquiryButton(): Cypress.Chainable {
    return cy.get('a[data-qa="create-order-ssp-inquiry"]');
  }

  getSspInquiryCreatedMessage(): string {
    return 'Inquiry has been submitted successfully';
  }

  getSspInquiryDetailsReference(reference: string): string {
    return `Reference: ${reference}`;
  }

  getSspInquiryDetailsOrderReference(orderReference: string): string {
    return `Order Reference: ${orderReference}`;
  }

  getSspInquiryDetailsDate(date: string): string {
    return `Date: ${date}`;
  }

  getSspInquiryDetailsSspAssetReference(orderReference: string): string {
    return `Asset Reference: ${orderReference}`;
  }

  getSspInquiryDetailsStatus(status: string): string {
    return `Status: ${status}`;
  }

  getSspInquiryDetailsType(type: string): string {
    return `Type: ${type}`;
  }
  getSspInquiryDetailsSubject(subject: string): string {
    return `Subject: ${subject}`;
  }
  getSspInquiryDetailsDescription(desctiption: string): string {
    return `Description: ${desctiption}`;
  }

  getSspInquiryDetailsCustomerFirstName(firstName: string): string {
    return `First Name: ${firstName}`;
  }

  getSspInquiryDetailsCustomerLastName(lastName: string): string {
    return `Last Name: ${lastName}`;
  }

  getSspInquiryDetailsCustomerEmail(email: string): string {
    return `E-mail: ${email}`;
  }

  getSspInquiryDetailsCompanyAndBusinessUnitName(companyName: string, businessUnitName: string): string {
    return `Company / Business Unit: ${companyName} / ${businessUnitName}`;
  }

  getCancelSspInquiryButton(): Cypress.Chainable {
    return cy.get('button[data-qa="cancel-ssp-inquiry"]');
  }

  getCanceledSspInquiryStatusSelector(): string {
    return '.status--canceled';
  }

  // New selectors for ssp inquiry list table
  private readonly sspInquiryTable = '[data-qa="component advanced-table"] table';
  private readonly tableRow = 'tbody tr';
  private readonly viewButton = '[data-qa="cell-actions"] a';
  private readonly reference = '[data-qa="cell-reference"]';

  // New method to get first row view button
  getFirstRowViewButton(): Chainable {
    return cy.get(this.sspInquiryTable).find(this.tableRow).first().find(this.viewButton);
  }

  getFirstRowReference(): string {
    let referenceText = '';
    cy.get(this.sspInquiryTable)
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
  getSspInquiryDetailLinks(): Chainable {
    return cy.get(this.viewButton);
  }

  getSspInquiryForm(): Cypress.Chainable {
    return cy.get(this.selectors.sspInquiryForm);
  }

  getOrderReferenceInput(): Cypress.Chainable {
    return this.getSspInquiryForm().find(this.selectors.orderReferenceInput);
  }

  getSspAssetReferenceInput(): Cypress.Chainable {
    return this.getSspInquiryForm().find(this.selectors.sspAssetReferenceInput);
  }

  getTypeSelect(): Cypress.Chainable {
    return this.getSspInquiryForm().find(this.selectors.typeSelect);
  }

  getTypeOptions(): Cypress.Chainable {
    return cy.get(this.selectors.typeOptions);
  }

  getSubjectInput(): Cypress.Chainable {
    return this.getSspInquiryForm().find(this.selectors.subjectInput);
  }

  getDescriptionTextarea(): Cypress.Chainable {
    return this.getSspInquiryForm().find(this.selectors.descriptionTextarea);
  }

  getFileInput(): Cypress.Chainable {
    return this.getSspInquiryForm().find(this.selectors.fileInput);
  }

  getSubmitButton(): Cypress.Chainable {
    return this.getSspInquiryForm().find(this.selectors.submitButton);
  }

  getFileDownloadActionSelector(): string {
    return '[data-qa*="download-button"]';
  }

  getSspInquirySearchForm(): Cypress.Chainable {
    return cy.get(this.selectors.sspInquirySearchForm);
  }

  getSspInquirySearchFormSubmitButton(): Cypress.Chainable {
    return cy.get(this.selectors.sspInquirySearchFormSubmitButton);
  }
}
