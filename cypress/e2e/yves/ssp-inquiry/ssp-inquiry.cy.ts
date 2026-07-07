import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import {
  SspInquiryListPage,
  SspInquiryCreatePage,
  SspInquiryDetailPage,
  OrderDetailsPage,
  SspInquiryOrderPage,
  SspAssetDetailPage,
  SspInquiryDetails,
  OrderSspInquiryDetails,
  SspAssetSspInquiryDetails,
} from '@pages/yves';
import { SspInquiryStaticFixtures, SspInquiryDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerLogoutScenario } from '@scenarios/yves';

describe(
  'ssp inquiry management',
  {
    tags: [
      '@yves',
      '@ssp-inquiry',
      '@ssp',
      '@SspInquiryManagement',
      'ssp-inquiry-management',
      'self-service-portal',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp ', () => {});
      return;
    }
    const sspInquiryListPage = container.get(SspInquiryListPage);
    const sspInquiryCreatePage = container.get(SspInquiryCreatePage);
    const sspInquiryDetailPage = container.get(SspInquiryDetailPage);
    const sspAssetDetailPage = container.get(SspAssetDetailPage);
    const orderDetailPage = container.get(OrderDetailsPage);
    const sspInquiryOrderPage = container.get(SspInquiryOrderPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerLogoutScenario = container.get(CustomerLogoutScenario);

    let staticFixtures: SspInquiryStaticFixtures;
    let dynamicFixtures: SspInquiryDynamicFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should be able to create and view a general ssp inquiry', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();
      sspInquiryListPage.clickCreateSspInquiryButton();

      staticFixtures.generalSspInquiry.availableTypes = staticFixtures.sspInquiryTypes.general;
      sspInquiryCreatePage.assertPageLocation();
      assertAvailableTypes(staticFixtures.generalSspInquiry.availableTypes);
      sspInquiryCreatePage.createSspInquiry(staticFixtures.generalSspInquiry);

      sspInquiryDetailPage.assertPageLocation();
      sspInquiryCreatePage.assertBodyContainsText(sspInquiryCreatePage.getSspInquiryCreatedMessage()).should('exist');

      sspInquiryListPage.visit();

      const sspInquiryReference = sspInquiryListPage.getFirstRowReference();
      sspInquiryListPage.openLatestSspInquiryDetailsPage();

      assertSspInquiryDetails({
        reference: sspInquiryReference,
        type: staticFixtures.generalSspInquiry.type,
        subject: staticFixtures.generalSspInquiry.subject,
        description: staticFixtures.generalSspInquiry.description,
        status: staticFixtures.generalSspInquiry.status,
        files: staticFixtures.generalSspInquiry.files,
        date: new Date()
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          })
          .replace(/([a-zA-Z]+)\s/, '$1. '),
        customer: {
          firstName: dynamicFixtures.customer.first_name,
          lastName: dynamicFixtures.customer.last_name,
          email: dynamicFixtures.customer.email,
          companyName: dynamicFixtures.company.name,
          businessUnitName: dynamicFixtures.businessUnit.name,
        },
      });
    });

    it('customer should be able to create and view an order ssp inquiry', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      orderDetailPage.visit({
        qs: {
          id: dynamicFixtures.order.id_sales_order,
        },
      });
      sspInquiryOrderPage.clickCreateSspInquiryButton();

      sspInquiryCreatePage.assertPageLocation();
      staticFixtures.orderSspInquiry.availableTypes = staticFixtures.sspInquiryTypes.order;
      sspInquiryCreatePage.getOrderReferenceInput().should('have.value', dynamicFixtures.order.order_reference);
      assertAvailableTypes(staticFixtures.orderSspInquiry.availableTypes);
      sspInquiryCreatePage.createOrderSspInquiry({
        ...staticFixtures.orderSspInquiry,
        orderReference: dynamicFixtures.order.order_reference,
      });

      sspInquiryDetailPage.assertPageLocation();
      sspInquiryCreatePage.assertBodyContainsText(sspInquiryCreatePage.getSspInquiryCreatedMessage()).should('exist');

      sspInquiryListPage.visit();
      const sspInquiryReference = sspInquiryListPage.getFirstRowReference();
      sspInquiryListPage.openLatestSspInquiryDetailsPage();

      assertOrderSspInquiryDetails({
        reference: sspInquiryReference,
        type: staticFixtures.orderSspInquiry.type,
        subject: staticFixtures.orderSspInquiry.subject,
        description: staticFixtures.orderSspInquiry.description,
        status: staticFixtures.orderSspInquiry.status,
        files: staticFixtures.orderSspInquiry.files,
        date: new Date()
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          })
          .replace(/([a-zA-Z]+)\s/, '$1. '),
        customer: {
          firstName: dynamicFixtures.customer.first_name,
          lastName: dynamicFixtures.customer.last_name,
          email: dynamicFixtures.customer.email,
          companyName: dynamicFixtures.company.name,
          businessUnitName: dynamicFixtures.businessUnit.name,
        },
        orderReference: dynamicFixtures.order.order_reference,
      });
    });

    it('customer should be able to create and view ssp asset inquiry', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspAssetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.sspAsset.reference,
        },
      });

      sspAssetDetailPage.clickCreateClaimButton();

      sspInquiryCreatePage.assertPageLocation();
      staticFixtures.sspAssetSspInquiry.availableTypes = staticFixtures.sspInquiryTypes.ssp_asset;
      sspInquiryCreatePage.getSspAssetReferenceInput().should('have.value', dynamicFixtures.sspAsset.reference);
      assertAvailableTypes(staticFixtures.sspAssetSspInquiry.availableTypes);
      sspInquiryCreatePage.createSspAssetSspInquiry({
        ...staticFixtures.sspAssetSspInquiry,
        sspAssetReference: dynamicFixtures.sspAsset.reference,
      });

      sspInquiryDetailPage.assertPageLocation();
      sspInquiryCreatePage.assertBodyContainsText(sspInquiryCreatePage.getSspInquiryCreatedMessage()).should('exist');

      sspInquiryListPage.visit();
      const sspInquiryReference = sspInquiryListPage.getFirstRowReference();
      sspInquiryListPage.openLatestSspInquiryDetailsPage();

      assertSspAssetSspInquiryDetails({
        reference: sspInquiryReference,
        type: staticFixtures.sspAssetSspInquiry.type,
        subject: staticFixtures.sspAssetSspInquiry.subject,
        description: staticFixtures.sspAssetSspInquiry.description,
        status: staticFixtures.sspAssetSspInquiry.status,
        files: staticFixtures.sspAssetSspInquiry.files,
        date: new Date()
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          })
          .replace(/([a-zA-Z]+)\s/, '$1. '),
        customer: {
          firstName: dynamicFixtures.customer.first_name,
          lastName: dynamicFixtures.customer.last_name,
          email: dynamicFixtures.customer.email,
          companyName: dynamicFixtures.company.name,
          businessUnitName: dynamicFixtures.businessUnit.name,
        },
        sspAssetReference: dynamicFixtures.sspAsset.reference,
      });
    });

    it('customer should be able to cancel a general ssp inquiry', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();

      sspInquiryListPage.clickCreateSspInquiryButton();

      staticFixtures.generalSspInquiry.availableTypes = staticFixtures.sspInquiryTypes.general;
      assertAvailableTypes(staticFixtures.generalSspInquiry.availableTypes);
      sspInquiryCreatePage.createSspInquiry(staticFixtures.generalSspInquiry);

      sspInquiryDetailPage.assertPageLocation();
      sspInquiryDetailPage.clickCancelSspInquiryButton();

      sspInquiryDetailPage.getCanceledSspInquiryStatus().should('exist');
    });

    it('customer should not be able to cancel a ssp inquiry if he is now owner', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();

      sspInquiryListPage.clickCreateSspInquiryButton();

      assertAvailableTypes(staticFixtures.generalSspInquiry.availableTypes);
      sspInquiryCreatePage.createSspInquiry(staticFixtures.generalSspInquiry);

      sspInquiryDetailPage.assertPageLocation();

      customerLogoutScenario.execute();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();
      sspInquiryListPage.openLatestSspInquiryDetailsPage();

      sspInquiryDetailPage.getCancelSspInquiryButton().should('not.exist');
    });

    it('customer with corresponding permission can see ssp inquiries created by other customers withing the same business unit', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();

      sspInquiryListPage.clickCreateSspInquiryButton();

      assertAvailableTypes(staticFixtures.generalSspInquiry.availableTypes);
      sspInquiryCreatePage.createSspInquiry(staticFixtures.generalSspInquiry);

      sspInquiryDetailPage.assertPageLocation();

      customerLogoutScenario.execute();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();

      sspInquiryListPage.openLatestSspInquiryDetailsPage();

      sspInquiryDetailPage.assertPageLocation();
    });

    it('customer with corresponding permission can see ssp inquiries created by other customers withing the same company', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();

      sspInquiryListPage.clickCreateSspInquiryButton();

      assertAvailableTypes(staticFixtures.generalSspInquiry.availableTypes);
      sspInquiryCreatePage.createSspInquiry(staticFixtures.generalSspInquiry);

      customerLogoutScenario.execute();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer6.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();

      sspInquiryListPage.openLatestSspInquiryDetailsPage();

      sspInquiryDetailPage.assertPageLocation();
    });

    it("customer without corresponding permission shoudn't see ssp inquiries created by other customers withing the same business unit", (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer3.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();

      sspInquiryListPage.clickCreateSspInquiryButton();

      assertAvailableTypes(staticFixtures.generalSspInquiry.availableTypes);
      sspInquiryCreatePage.createSspInquiry(staticFixtures.generalSspInquiry);

      sspInquiryDetailPage.assertPageLocation();

      customerLogoutScenario.execute();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer4.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();
      sspInquiryListPage.assertPageLocation();
      sspInquiryListPage.submitSspInquirySearchForm();
      sspInquiryListPage.getSspInquiryDetailLinks().should('not.exist');
    });

    it('customer should not be able to create a ssp inquiry if he has no permission', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer4.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();

      sspInquiryListPage.getCreateSspInquiryButton().should('not.exist');
    });

    function assertAvailableTypes(availableTypes?: Array<{ key: string }>): void {
      if (availableTypes) {
        sspInquiryCreatePage.getTypeOptions().should('have.length', availableTypes.length);
        availableTypes.forEach((type, index) => {
          sspInquiryCreatePage.getTypeOptions().eq(index).should('have.value', type.key);
        });
      }
    }

    function assertSspInquiryDetails(params: SspInquiryDetails): void {
      sspInquiryDetailPage.getSspInquiryDetailsReference(params.reference).should('exist');
      sspInquiryDetailPage.getSspInquiryDetailsDate(params.date).should('exist');
      sspInquiryDetailPage.getSspInquiryDetailsStatus(params.status).should('exist');
      sspInquiryDetailPage.getSspInquiryDetailsType(params.type.value).should('exist');
      sspInquiryDetailPage.getSspInquiryDetailsSubject(params.subject).should('exist');
      sspInquiryDetailPage.getSspInquiryDetailsDescription(params.description).should('exist');
      sspInquiryDetailPage.getSspInquiryDetailsCustomerFirstName(params.customer.firstName).should('exist');
      sspInquiryDetailPage.getSspInquiryDetailsCustomerLastName(params.customer.lastName).should('exist');
      sspInquiryDetailPage.getSspInquiryDetailsCustomerEmail(params.customer.email).should('exist');
      sspInquiryDetailPage
        .getSspInquiryDetailsCompanyAndBusinessUnitName(params.customer.companyName, params.customer.businessUnitName)
        .should('exist');

      const getColumnIndexByName = (columnName: string): number => {
        const columnNames = ['File name', 'Size', 'Type', 'Actions'];
        return columnNames.indexOf(columnName);
      };

      const extractFileName = (filePath: string): string => {
        return filePath.split('/').pop() || '';
      };

      for (const file of params.files) {
        const fileName = extractFileName(file.name);
        sspInquiryDetailPage
          .getFileTableRowCell(fileName, getColumnIndexByName('File name'))
          .should('contain.text', fileName);
        sspInquiryDetailPage
          .getFileTableRowCell(fileName, getColumnIndexByName('Size'))
          .should('contain.text', file.size);
        sspInquiryDetailPage
          .getFileTableRowCell(fileName, getColumnIndexByName('Type'))
          .should('contain.text', file.extension);
        sspInquiryDetailPage
          .getFileTableRowCell(fileName, getColumnIndexByName('Actions'))
          .find(sspInquiryDetailPage.getFileDownloadActionSelector())
          .should('exist');
      }
    }

    function assertOrderSspInquiryDetails(params: OrderSspInquiryDetails): void {
      sspInquiryDetailPage.getSspInquiryDetailsOrderReferenceText(params.orderReference);
      assertSspInquiryDetails(params);
    }

    function assertSspAssetSspInquiryDetails(params: SspAssetSspInquiryDetails): void {
      sspInquiryDetailPage.getSspInquiryDetailsSspAssetReferenceText(params.reference);
      assertSspInquiryDetails(params);
    }
  }
);
