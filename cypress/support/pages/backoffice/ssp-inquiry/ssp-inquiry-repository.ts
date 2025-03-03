import { autoWired } from '@utils';
import { injectable } from 'inversify';
import Chainable = Cypress.Chainable;

@injectable()
@autoWired
export class SspInquiryRepository {
  private readonly selectors = {
      sspInquiryReferenceCell: 'dl dt:contains("Inquiry reference") + dd',
    orderReferenceCell: 'dl dt:contains("Order reference") + dd',
    customerCell: 'dl dt:contains("Customer") + dd',
    dateCell: 'dl dt:contains("Date") + dd',
    statusCell: 'dl dt:contains("Status") + dd',
    companyBusinessUnitCell: 'dl dt:contains("Company / Business Unit") + dd',
    storeCell: 'dl dt:contains("Store") + dd',
    typeCell: 'dl dt:contains("Type") + dd',
    subjectCell: 'dl dt:contains("Subject") + dd',
    descriptionCell: 'dl dt:contains("Description") + dd',
    messageTextarea: 'textarea[name="message"]',
    commentForm: 'form[action="/comment-gui/comment/add"]',
      sspInquiryStatusHistory: 'a[data-qa=show-ssp-inquiry-status-history]',
    historyDetailsTable: 'table[data-qa=history-details-table] td',
    cancelButton: '#trigger_event_form_cancel',
      sspInquiryStatus: '[data-qa=ssp-inquiry-status]',
    startReviewButton: '#trigger_event_form_start_review',
    approveButton: '#trigger_event_form_approve',
    rejectButton: '#trigger_event_form_reject',
  };

  getSspInquiryReferenceCell(): Chainable {
    return cy.get(this.selectors.sspInquiryReferenceCell);
  }

  getOrderReferenceCell(): Chainable {
    return cy.get(this.selectors.orderReferenceCell);
  }

  getCustomerCell(): Chainable {
    return cy.get(this.selectors.customerCell);
  }

  getDateCell(): Chainable {
    return cy.get(this.selectors.dateCell);
  }

  getStatusCell(): Chainable {
    return cy.get(this.selectors.statusCell);
  }

  getCompanyBusinessUnitCell(): Chainable {
    return cy.get(this.selectors.companyBusinessUnitCell);
  }

  getStoreCell(): Chainable {
    return cy.get(this.selectors.storeCell);
  }

  getTypeCell(): Chainable {
    return cy.get(this.selectors.typeCell);
  }

  getSubjectCell(): Chainable {
    return cy.get(this.selectors.subjectCell);
  }

  getDescriptionCell(): Chainable {
    return cy.get(this.selectors.descriptionCell);
  }

  getFileTableCell(fileName: string): Chainable {
    return cy.get('tr').contains('td', fileName).parent();
  }

  getMessageTextarea(): Chainable {
    return cy.get(this.selectors.messageTextarea);
  }

  getCommentForm(): Chainable {
    return cy.get(this.selectors.commentForm);
  }

  getSspInquiryStatusHistory(): Chainable {
    return cy.get(this.selectors.sspInquiryStatusHistory);
  }

  getHistoryDetailsTable(): Chainable {
    return cy.get(this.selectors.historyDetailsTable);
  }

  getCancelButton(): Chainable {
    return cy.get(this.selectors.cancelButton);
  }

  getSspInquiryStatus(): Chainable {
    return cy.get(this.selectors.sspInquiryStatus);
  }

  getStartReviewButton(): Chainable {
    return cy.get(this.selectors.startReviewButton);
  }

  getApproveButton(): Chainable {
    return cy.get(this.selectors.approveButton);
  }

  getRejectButton(): Chainable {
    return cy.get(this.selectors.rejectButton);
  }

  getSspInquiryTableRows(): Chainable {
    return cy.get('table.gui-table-data tbody tr');
  }

  getSspInquiryTableHeaders(): Chainable {
    return this.getSspInquiryTableRows().get('th');
  }
}
