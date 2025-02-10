import { autoWired } from '@utils';
import { injectable } from 'inversify';
import Chainable = Cypress.Chainable;

@injectable()
@autoWired
export class ClaimRepository {
    private readonly selectors = {
        claimReferenceCell: 'dl dt:contains("Claim reference") + dd',
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
        claimStatusHistory: 'a[data-qa=show-claim-status-history]',
        historyDetailsTable: 'table[data-qa=history-details-table] td',
        cancelButton: '#trigger_event_form_cancel',
        claimStatus: '[data-qa=claim-status]',
        startReviewButton: '#trigger_event_form_start_review',
        approveButton: '#trigger_event_form_approve',
        rejectButton: '#trigger_event_form_reject'
    };

    getClaimReferenceCell(): Chainable {
        return cy.get(this.selectors.claimReferenceCell);
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

    getClaimStatusHistory(): Chainable {
        return cy.get(this.selectors.claimStatusHistory);
    }

    getHistoryDetailsTable(): Chainable {
        return cy.get(this.selectors.historyDetailsTable);
    }

    getCancelButton(): Chainable {
        return cy.get(this.selectors.cancelButton);
    }

    getClaimStatus(): Chainable {
        return cy.get(this.selectors.claimStatus);
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

    getClaimTableRows(): Chainable
    {
        return cy.get('table.gui-table-data tbody tr');
    }

    getClaimTableHeaders(): Chainable
    {
        return this.getClaimTableRows().get('th')
    }
}
