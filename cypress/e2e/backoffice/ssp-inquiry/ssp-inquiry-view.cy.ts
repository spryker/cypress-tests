import { container } from '@utils';
import { SspInquiryStaticFixtures, SspInquiryDynamicFixtures } from '@interfaces/backoffice';
import { SspInquiryDetailPage } from '@pages/backoffice';
import { SspInquiryListPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

(['suite', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
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
    const sspInquiryDetailPage = container.get(SspInquiryDetailPage);
    const sspInquiryListPage = container.get(SspInquiryListPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: SspInquiryStaticFixtures;
    let dynamicFixtures: SspInquiryDynamicFixtures;

    before((): void => {
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

      sspInquiryDetailPage.assertSspInquiryDetails({
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
        store: dynamicFixtures.generalSspInquiry.store.name,
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

      sspInquiryDetailPage.assertOrderSspInquiryDetails({
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
        store: dynamicFixtures.orderSspInquiry.store.name,
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
      cy.contains('This is a test comment.').should('exist');
    });

    it('should visit the ssp inquiry list page', () => {
      sspInquiryListPage.visit();

      sspInquiryDetailPage.assertSspInquiryTableIsNotEmpty();
      sspInquiryDetailPage.assertSspInquiryTableColumnsExist();
      sspInquiryDetailPage.assertViewSspInquiryTableLinksExist();
    });

    it('user can approve ssp inquiry', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.generalSspInquiry.id_ssp_inquiry,
        },
      });

      sspInquiryDetailPage.approveSspInquiry();
      sspInquiryDetailPage.assertSspInquiryStatusChangedToApproved();
    });

    it('user can reject ssp inquiry', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.generalSspInquiry2.id_ssp_inquiry,
        },
      });

      sspInquiryDetailPage.rejectSspInquiry();
      sspInquiryDetailPage.assertSspInquiryStatusChangedToRejected();
    });

    it('user can cancel ssp inquiry', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.generalSspInquiry3.id_ssp_inquiry,
        },
      });

      sspInquiryDetailPage.cancelSspInquiry();
      sspInquiryDetailPage.assertSspInquiryStatusChangedToCanceled();
    });

    it('i can see ssp inquiry history', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.generalSspInquiry3.id_ssp_inquiry,
        },
      });

      sspInquiryDetailPage.openSspInquiryHistory();
      sspInquiryDetailPage.assertSspInquiryHistoryIsNotEmpty();
    });
  }
);
