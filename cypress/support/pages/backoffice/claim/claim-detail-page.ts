import {autoWired} from '@utils';
import { injectable, inject } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ClaimRepository } from './claim-repository';

@injectable()
@autoWired
export class ClaimDetailPage extends BackofficePage {
  protected PAGE_URL = '/ssp-claim-management/detail';
    @inject(ClaimRepository) private repository: ClaimRepository;


    assertOrderClaimDetails = (params: OrderClaimDetails): void => {
    this.repository.getOrderReferenceCell().should('contain.text', params.order.reference);
    this.assertClaimDetails(params);
  };

  assertClaimDetails = (params: ClaimDetails): void => {
    this.repository.getClaimReferenceCell().should('contain.text', params.reference);
    this.repository.getCustomerCell().should('contain.text',
      `${params.customer.salutation} ${params.customer.firstName} ${params.customer.lastName}`);
    this.repository.getDateCell().should('contain.text', params.date);
    this.repository.getStatusCell().contains(new RegExp(params.status, 'i')).should('exist');
    this.repository.getCompanyBusinessUnitCell().should('contain.text',
      `${params.customer.companyName} / ${params.customer.businessUnitName}`);
    this.repository.getStoreCell().should('contain.text', params.store);
    this.repository.getTypeCell().contains(new RegExp(params.type, 'i')).should('exist');
    this.repository.getSubjectCell().should('contain.text', params.subject);
    this.repository.getDescriptionCell().should('contain.text', params.description);

      const getColumnIndexByName = (columnName: string): number => {
          const columnNames = ['File name', 'Size', 'Type', 'Actions'];
          return columnNames.indexOf(columnName);
      };

    for (const file of params.files) {
      const fileRow = this.repository.getFileTableCell(file.file_name);
      fileRow.within(() => {
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
    this.repository.getClaimStatusHistory().click();
  }

  assertClaimHistoryIsNotEmpty(): void {
    this.repository.getHistoryDetailsTable().should('exist').should('be.visible');
  }

  cancelClaim(): void {
    this.repository.getCancelButton().click();
  }

  assertClaimStatusChangedToCanceled(): void {
    this.repository.getClaimStatus().contains('Canceled');
  }

  submitComment(comment: string): void {
    this.repository.getMessageTextarea().type(comment);
    this.repository.getCommentForm().submit();
  }

  approveClaim(): void {
    this.repository.getStartReviewButton().click();
    this.repository.getApproveButton().click();
  }

  assertClaimStatusChangedToApproved(): void {
    this.repository.getClaimStatus().contains('Approved');
  }

  rejectClaim(): void {
    this.repository.getStartReviewButton().click();
    this.repository.getRejectButton().click();
  }

  assertClaimStatusChangedToRejected(): void {
    this.repository.getClaimStatus().contains('Rejected');
  }

  assertClaimTableIsNotEmpty(): void
  {
    this.repository.getClaimTableRows().should('have.length.greaterThan', 0)
  }

  assertClaimTableColumnsExist(): void
  {
    const expectedColumns = ['ID', 'Reference', 'Type', 'Customer', 'Date', 'Status', 'Actions'];
    this.repository.getClaimTableHeaders().each((header, index) => {
      if (expectedColumns[index]) {
        cy.wrap(header).should('contain.text', expectedColumns[index]);
      }
    });
  }

  assertViewClaimTableLinksExist(): void
  {
    this.repository.getClaimTableRows().eq(0).find('a.btn-view').should('exist');
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
