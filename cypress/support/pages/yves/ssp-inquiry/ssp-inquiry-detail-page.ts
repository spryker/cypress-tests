import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import 'cypress-file-upload';
import { SspInquiryRepository } from './ssp-inquiry-repository';

@injectable()
@autoWired
export class SspInquiryDetailPage extends YvesPage {
  @inject(REPOSITORIES.SspInquiryRepository) private repository: SspInquiryRepository;

  public PAGE_URL = '/customer/ssp-inquiry/detail';

  getSspInquiryDetailsReference = (reference: string): Cypress.Chainable =>
    cy.contains(this.repository.getSspInquiryDetailsReference(reference));

  getSspInquiryDetailsDate = (date: string): Cypress.Chainable =>
    cy.contains(this.repository.getSspInquiryDetailsDate(date));

  getSspInquiryDetailsStatus = (status: string): Cypress.Chainable =>
    cy.contains(new RegExp(this.repository.getSspInquiryDetailsStatus(status), 'i'));

  getSspInquiryDetailsType = (value: string): Cypress.Chainable =>
    cy.contains(this.repository.getSspInquiryDetailsType(value));

  getSspInquiryDetailsSubject = (subject: string): Cypress.Chainable =>
    cy.contains(this.repository.getSspInquiryDetailsSubject(subject));

  getSspInquiryDetailsDescription = (description: string): Cypress.Chainable =>
    cy.contains(this.repository.getSspInquiryDetailsDescription(description));

  getSspInquiryDetailsCustomerFirstName = (firstName: string): Cypress.Chainable =>
    cy.contains(this.repository.getSspInquiryDetailsCustomerFirstName(firstName));

  getSspInquiryDetailsCustomerLastName = (lastName: string): Cypress.Chainable =>
    cy.contains(this.repository.getSspInquiryDetailsCustomerLastName(lastName));

  getSspInquiryDetailsCustomerEmail = (email: string): Cypress.Chainable =>
    cy.contains(this.repository.getSspInquiryDetailsCustomerEmail(email));

  getSspInquiryDetailsCompanyAndBusinessUnitName = (companyName: string, businessUnitName: string): Cypress.Chainable =>
    cy.contains(this.repository.getSspInquiryDetailsCompanyAndBusinessUnitName(companyName, businessUnitName));

  getSspInquiryDetailsOrderReferenceText = (orderReference: string): string =>
    this.repository.getSspInquiryDetailsOrderReference(orderReference);

  getSspInquiryDetailsSspAssetReferenceText = (reference: string): string =>
    this.repository.getSspInquiryDetailsSspAssetReference(reference);

  getFileTableRowCell = (fileName: string, columnIndex: number): Cypress.Chainable =>
    cy.get('tr').contains('td', fileName).parent().find('td').eq(columnIndex);

  getFileDownloadActionSelector = (): string => this.repository.getFileDownloadActionSelector();

  clickCancelSspInquiryButton(): void {
    this.repository.getCancelSspInquiryButton().click();
  }

  getCancelSspInquiryButton(): Cypress.Chainable {
    return this.repository.getCancelSspInquiryButton();
  }

  getCanceledSspInquiryStatusSelector(): string {
    return this.repository.getCanceledSspInquiryStatusSelector();
  }

  getCanceledSspInquiryStatus(): Cypress.Chainable {
    return cy.get(this.repository.getCanceledSspInquiryStatusSelector());
  }
}

export interface SspInquiryDetails {
  reference: string;
  type: SspInquiryType;
  subject: string;
  description: string;
  date: string;
  status: string;
  customer: Customer;
  files: File[];
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  businessUnitName: string;
}

export interface File {
  name: string;
  size: string;
  extension: string;
}

export interface OrderSspInquiryDetails extends SspInquiryDetails {
  orderReference: string;
}

export interface SspAssetSspInquiryDetails extends SspInquiryDetails {
  sspAssetReference: string;
}

interface SspInquiryType {
  key: string;
  value: string;
}
