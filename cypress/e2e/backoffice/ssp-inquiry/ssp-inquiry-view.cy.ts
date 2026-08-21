import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { SspInquiryStaticFixtures, SspInquiryDynamicFixtures } from '@interfaces/backoffice';
import { SspInquiryDetailPage, SspInquiryDetails, OrderSspInquiryDetails } from '@pages/backoffice';
import { SspInquiryListPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'ssp inquiry management',
  {
    tags: [
      '@ssp',
      '@backoffice',
      '@sspInquiryManagement',
      'ssp-inquiry-management',
      ' self-service-portal',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }
    const sspInquiryDetailPage = container.get(SspInquiryDetailPage);
    const sspInquiryListPage = container.get(SspInquiryListPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: SspInquiryStaticFixtures;
    let dynamicFixtures: SspInquiryDynamicFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('can view general ssp inquiry details', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.generalSspInquiry.id_ssp_inquiry,
        },
      });

      assertSspInquiryDetails({
        reference: dynamicFixtures.generalSspInquiry.reference,
        date: new Date()
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          })
          .replace(/([a-zA-Z]+)\s/, '$1. '),
        status: dynamicFixtures.generalSspInquiry.status,
        type: dynamicFixtures.generalSspInquiry.type,
        subject: dynamicFixtures.generalSspInquiry.subject,
        description: dynamicFixtures.generalSspInquiry.description,
        files: dynamicFixtures.generalSspInquiry.files.map((file) => ({
          file_name: file.file_name,
          size: file.file_info[0].size,
          extension: file.file_info[0].extension,
        })),
        customer: {
          firstName: dynamicFixtures.customer.first_name,
          lastName: dynamicFixtures.customer.last_name,
          email: dynamicFixtures.customer.email,
          salutation: dynamicFixtures.customer.salutation,
          companyName: dynamicFixtures.company.name,
          businessUnitName: dynamicFixtures.businessUnit.name,
        },
      });
    });

    it('can view order ssp inquiry details', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.orderSspInquiry.id_ssp_inquiry,
        },
      });

      assertOrderSspInquiryDetails({
        reference: dynamicFixtures.orderSspInquiry.reference,
        date: new Date()
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          })
          .replace(/([a-zA-Z]+)\s/, '$1. '),
        order: {
          reference: dynamicFixtures.orderSspInquiry.order.order_reference,
        },
        status: dynamicFixtures.orderSspInquiry.status,
        type: dynamicFixtures.orderSspInquiry.type,
        subject: dynamicFixtures.orderSspInquiry.subject,
        description: dynamicFixtures.orderSspInquiry.description,
        files: dynamicFixtures.orderSspInquiry.files.map((file) => ({
          file_name: file.file_name,
          size: file.file_info[0].size,
          extension: file.file_info[0].extension,
        })),
        customer: {
          firstName: dynamicFixtures.customer.first_name,
          lastName: dynamicFixtures.customer.last_name,
          email: dynamicFixtures.customer.email,
          salutation: dynamicFixtures.customer.salutation,
          companyName: dynamicFixtures.company.name,
          businessUnitName: dynamicFixtures.businessUnit.name,
        },
      });
    });

    it('user can fill and submit the comment form', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.generalSspInquiry.id_ssp_inquiry,
        },
      });

      sspInquiryDetailPage.submitComment('This is a test comment.');

      sspInquiryDetailPage.assertPageLocation();
      sspInquiryDetailPage.assertBodyContainsText('This is a test comment.').should('exist');
    });

    it('should visit the ssp inquiry list page', () => {
      sspInquiryListPage.visit();

      sspInquiryDetailPage.getSspInquiryTableRows().should('have.length.greaterThan', 0);

      const expectedColumns = ['ID', 'Reference', 'Type', 'Customer', 'Date', 'Status', 'Actions'];
      sspInquiryDetailPage.getSspInquiryTableHeaders().each((header, index) => {
        if (expectedColumns[index]) {
          cy.wrap(header).should('contain.text', expectedColumns[index]);
        }
      });

      sspInquiryDetailPage.getSspInquiryTableRows().eq(0).find('a.btn-view').should('exist');
    });

    it('user can approve ssp inquiry', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.generalSspInquiry.id_ssp_inquiry,
        },
      });

      sspInquiryDetailPage.approveSspInquiry();
      sspInquiryDetailPage.getSspInquiryStatus().contains('Approved');
    });

    it('user can reject ssp inquiry', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.generalSspInquiry2.id_ssp_inquiry,
        },
      });

      sspInquiryDetailPage.rejectSspInquiry();
      sspInquiryDetailPage.getSspInquiryStatus().contains('Rejected');
    });

    it('user can cancel ssp inquiry', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.generalSspInquiry3.id_ssp_inquiry,
        },
      });

      sspInquiryDetailPage.cancelSspInquiry();
      sspInquiryDetailPage.getSspInquiryStatus().contains('Canceled');
    });

    it('i can see ssp inquiry history', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.generalSspInquiry3.id_ssp_inquiry,
        },
      });

      sspInquiryDetailPage.openSspInquiryHistory();
      sspInquiryDetailPage.getHistoryDetailsTable().should('exist').should('be.visible');
    });

    function assertSspInquiryDetails(params: SspInquiryDetails): void {
      sspInquiryDetailPage.getSspInquiryReferenceCell().should('contain.text', params.reference);
      sspInquiryDetailPage
        .getCustomerCell()
        .should(
          'contain.text',
          `${params.customer.salutation} ${params.customer.firstName} ${params.customer.lastName}`
        );
      sspInquiryDetailPage.getDateCell().should('contain.text', params.date);
      sspInquiryDetailPage.getStatusCell().contains(new RegExp(params.status, 'i')).should('exist');
      sspInquiryDetailPage
        .getCompanyBusinessUnitCell()
        .should('contain.text', `${params.customer.companyName} / ${params.customer.businessUnitName}`);
      sspInquiryDetailPage.getTypeCell().contains(new RegExp(params.type, 'i')).should('exist');
      sspInquiryDetailPage.getSubjectCell().should('contain.text', params.subject);
      sspInquiryDetailPage.getDescriptionCell().should('contain.text', params.description);

      const getColumnIndexByName = (columnName: string): number => {
        const columnNames = ['File name', 'Size', 'Type', 'Actions'];
        return columnNames.indexOf(columnName);
      };

      for (const file of params.files) {
        sspInquiryDetailPage
          .getFileTableRowCell(file.file_name, getColumnIndexByName('File name'))
          .should('contain.text', file.file_name);
        sspInquiryDetailPage.getFileTableRowCell(file.file_name, getColumnIndexByName('Size')).should('exist');
        sspInquiryDetailPage
          .getFileTableRowCell(file.file_name, getColumnIndexByName('Type'))
          .should('contain.text', file.extension);
        sspInquiryDetailPage
          .getFileTableRowCell(file.file_name, getColumnIndexByName('Actions'))
          .should('contain.text', 'Download');
      }
    }

    function assertOrderSspInquiryDetails(params: OrderSspInquiryDetails): void {
      sspInquiryDetailPage.getOrderReferenceCell().should('contain.text', params.order.reference);
      assertSspInquiryDetails(params);
    }
  }
);
