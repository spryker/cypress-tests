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

  assertOrderSspInquiryDetails = (params: OrderSspInquiryDetails): void => {
    this.repository.getSspInquiryDetailsOrderReference(params.orderReference);
    this.assertSspInquiryDetails(params);
  };

  assertSspAssetSspInquiryDetails = (params: SspAssetSspInquiryDetails): void => {
    this.repository.getSspInquiryDetailsSspAssetReference(params.reference);
    this.assertSspInquiryDetails(params);
  };

  assertSspInquiryDetails = (params: SspInquiryDetails): void => {
    cy.contains(this.repository.getSspInquiryDetailsReference(params.reference)).should('exist');
    cy.contains(this.repository.getSspInquiryDetailsDate(params.date)).should('exist');
    cy.contains(new RegExp(this.repository.getSspInquiryDetailsStatus(params.status), 'i')).should('exist');
    cy.contains(this.repository.getSspInquiryDetailsType(params.type.value)).should('exist');
    cy.contains(this.repository.getSspInquiryDetailsSubject(params.subject)).should('exist');
    cy.contains(this.repository.getSspInquiryDetailsDescription(params.description)).should('exist');
    cy.contains(this.repository.getSspInquiryDetailsCustomerFirstName(params.customer.firstName)).should('exist');
    cy.contains(this.repository.getSspInquiryDetailsCustomerLastName(params.customer.lastName)).should('exist');
    cy.contains(this.repository.getSspInquiryDetailsCustomerEmail(params.customer.email)).should('exist');
    cy.contains(
      this.repository.getSspInquiryDetailsCompanyAndBusinessUnitName(
        params.customer.companyName,
        params.customer.businessUnitName
      )
    ).should('exist');

    const getColumnIndexByName = (columnName: string): number => {
      const columnNames = ['File name', 'Size', 'Type', 'Actions'];
      return columnNames.indexOf(columnName);
    };

    const extractFileName = (filePath: string): string => {
      return filePath.split('/').pop() || '';
    };

    for (const file of params.files) {
      cy.get('tr')
        .contains('td', extractFileName(file.name))
        .parent()
        .within(() => {
          cy.get('td').eq(getColumnIndexByName('File name')).should('contain.text', extractFileName(file.name));
          cy.get('td').eq(getColumnIndexByName('Size')).should('contain.text', file.size);
          cy.get('td').eq(getColumnIndexByName('Type')).should('contain.text', file.extension);
          cy.get('td')
            .eq(getColumnIndexByName('Actions'))
            .find(this.repository.getFileDownloadActionSelector())
            .should('exist');
        });
    }
  };

  clickCancelSspInquiryButton(): void {
    this.repository.getCancelSspInquiryButton().click();
  }

  getCancelSspInquiryButton(): Cypress.Chainable {
    return this.repository.getCancelSspInquiryButton();
  }

  getCanceledSspInquiryStatusSelector(): string {
    return this.repository.getCanceledSspInquiryStatusSelector();
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
