import { autoWired } from '@utils';
import { injectable, inject } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { SspInquiryRepository } from './ssp-inquiry-repository';

@injectable()
@autoWired
export class SspInquiryDetailPage extends BackofficePage {
  protected PAGE_URL = '/self-service-portal/view-inquiry';
  @inject(SspInquiryRepository) private repository: SspInquiryRepository;

  getOrderReferenceCell = (): Cypress.Chainable => this.repository.getOrderReferenceCell();

  getSspInquiryReferenceCell = (): Cypress.Chainable => this.repository.getSspInquiryReferenceCell();

  getCustomerCell = (): Cypress.Chainable => this.repository.getCustomerCell();

  getDateCell = (): Cypress.Chainable => this.repository.getDateCell();

  getStatusCell = (): Cypress.Chainable => this.repository.getStatusCell();

  getCompanyBusinessUnitCell = (): Cypress.Chainable => this.repository.getCompanyBusinessUnitCell();

  getTypeCell = (): Cypress.Chainable => this.repository.getTypeCell();

  getSubjectCell = (): Cypress.Chainable => this.repository.getSubjectCell();

  getDescriptionCell = (): Cypress.Chainable => this.repository.getDescriptionCell();

  getFileTableCell = (fileName: string): Cypress.Chainable => this.repository.getFileTableCell(fileName);

  getFileTableRowCell = (fileName: string, columnIndex: number): Cypress.Chainable =>
    this.repository.getFileTableCell(fileName).find('td').eq(columnIndex);

  getHistoryDetailsTable = (): Cypress.Chainable => this.repository.getHistoryDetailsTable();

  getSspInquiryStatus = (): Cypress.Chainable => this.repository.getSspInquiryStatus();

  getSspInquiryTableRows = (): Cypress.Chainable => this.repository.getSspInquiryTableRows();

  getSspInquiryTableHeaders = (): Cypress.Chainable => this.repository.getSspInquiryTableHeaders();

  openSspInquiryHistory(): void {
    this.repository.getSspInquiryStatusHistory().click();
  }

  cancelSspInquiry(): void {
    this.repository.getCancelButton().click();
  }

  submitComment(comment: string): void {
    this.repository.getMessageTextarea().type(comment);
    this.repository.getCommentForm().submit();
  }

  approveSspInquiry(): void {
    this.repository.getStartReviewButton().click();
    this.repository.getApproveButton().click();
  }

  rejectSspInquiry(): void {
    this.repository.getStartReviewButton().click();
    this.repository.getRejectButton().click();
  }
}

export interface SspInquiryDetails {
  reference: string;
  type: string;
  subject: string;
  description: string;
  date: string;
  status: string;
  customer: Customer;
  files: File[];
}

export interface OrderSspInquiryDetails extends SspInquiryDetails {
  order: Order;
}

export interface Order {
  reference: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  salutation: string;
  companyName: string;
  businessUnitName: string;
}

export interface File {
  file_name: string;
  extension: string;
  size: number;
}
