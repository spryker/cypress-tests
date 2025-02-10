import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class ClaimDetailPage extends BackofficePage {
  protected PAGE_URL = '/ssp-claim-management/detail';

  assertOrderClaimDetails = (params: OrderClaimDetails): void => {
    cy.get('dl')
      .contains('dt', 'Order reference')
      .parent()
      .within(() => {
        cy.get('dd').should('contain.text', params.order.reference);
      });

    this.assertClaimDetails(params);
  };

  assertClaimDetails = (params: ClaimDetails): void => {
    cy.get('dl')
      .contains('dt', 'Claim reference')
      .parent()
      .within(() => {
        cy.get('dd').should('contain.text', params.reference);
      });

    cy.get('dl')
      .contains('dt', 'Customer')
      .parent()
      .within(() => {
        cy.get('dd').should(
          'contain.text',
          params.customer.salutation + ' ' + params.customer.firstName + ' ' + params.customer.lastName
        );
      });

    cy.get('dl')
      .contains('dt', 'Date')
      .parent()
      .within(() => {
        cy.get('dd').should('contain.text', params.date);
      });

    cy.get('dl')
      .contains('dt', 'Status')
      .parent()
      .within(() => {
        cy.get('dd').should('contain.text', params.status);
      });

    cy.get('dl')
      .contains('dt', 'Company / Business Unit')
      .parent()
      .within(() => {
        cy.get('dd').should('contain.text', params.customer.companyName + ' / ' + params.customer.businessUnitName);
      });

    cy.get('dl')
      .contains('dt', 'Store')
      .parent()
      .within(() => {
        cy.get('dd').should('contain.text', params.store);
      });

    cy.get('dl')
      .contains('dt', 'Type')
      .parent()
      .within(() => {
        cy.get('dd').contains(new RegExp(params.type, 'i')).should('exist');
      });

    cy.get('dl')
      .contains('dt', 'Subject')
      .parent()
      .within(() => {
        cy.get('dd').should('contain.text', params.subject);
      });

    cy.get('dl')
      .contains('dt', 'Description')
      .parent()
      .within(() => {
        cy.get('dd').should('contain.text', params.description);
      });

    const getColumnIndexByName = (columnName: string): number => {
      const columnNames = ['File name', 'Size', 'Type', 'Actions'];
      return columnNames.indexOf(columnName);
    };

    for (const file of params.files) {
      cy.get('tr')
        .contains('td', file.file_name)
        .parent()
        .within(() => {
          cy.get('td').eq(getColumnIndexByName('File name')).should('contain.text', file.file_name);
          cy.get('td').eq(getColumnIndexByName('Size')).should('contain.text', this.convertToReadableSize(file.size));
          cy.get('td').eq(getColumnIndexByName('Type')).should('contain.text', file.extension);
          cy.get('td').eq(getColumnIndexByName('Actions')).should('contain.text', 'Download');
        });
    }
  };

  convertToReadableSize(size: number): string {
    let sizeForRound = size + 0.0001;
    if (size >= 1000 * 1000 * 1000) {
      return parseFloat((sizeForRound / (1000 * 1000 * 1000)).toFixed(2)) + ' GB';
    } else if (size >= 1000 * 1000) {
      return parseFloat((sizeForRound / (1000 * 1000)).toFixed(2)) + ' MB';
    } else if (size >= 1000) {
      return parseFloat((sizeForRound / 1000).toFixed(2)) + ' kB';
    } else {
      return size + ' B';
    }
  }

  openClaimHistory(): void {
    cy.get('a[data-qa=show-claim-status-history]').click();
  }

  assertClaimHistoryIsNotEmpty(): void {
    cy.get('table[data-qa=history-details-table] td').should('exist').should('be.visible');
  }

  cancelClaim(): void {
    cy.get('#trigger_event_form_cancel').click();
  }

  assertClaimStatusChangedToCanceled(): void {
    cy.get('[data-qa=claim-status]').contains('Canceled');
  }

  approveClaim(): void {
    cy.get('#trigger_event_form_start_review').click();
    cy.get('#trigger_event_form_approve').click();
  }

  assertClaimStatusChangedToApproved(): void {
    cy.get('[data-qa=claim-status]').contains('Approved');
  }

  rejectClaim(): void {
    cy.get('#trigger_event_form_start_review').click();
    cy.get('#trigger_event_form_reject').click();
  }

  assertClaimStatusChangedToRejected(): void {
    cy.get('[data-qa=claim-status]').contains('Rejected');
  }

  assertClaimTableIsNotEmpty(): void
  {
    cy.get('table.gui-table-data tbody tr').should('have.length.greaterThan', 0)
  }

  assertClaimTableColumnsExist(): void
  {
    const expectedColumns = ['ID', 'Reference', 'Type', 'Customer', 'Date', 'Status', 'Actions'];
    cy.get('table.gui-table-data thead tr th').each((header, index) => {
      if (expectedColumns[index]) {
        cy.wrap(header).should('contain.text', expectedColumns[index]);
      }
    });
  }

  assertViewClaimTableLinksExist(): void
  {
    cy.get('table.gui-table-data tbody tr').eq(0).find('a.btn-view').should('exist');
  }
}

export interface ClaimDetails {
  reference: string;
  type: string;
  subject: string;
  description: string;
  date: string;
  status: string;
  store: string;
  customer: Customer;
  files: File[];
}

export interface OrderClaimDetails extends ClaimDetails {
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
