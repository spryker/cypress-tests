import { container } from '@utils';
import {
  SspInquiryListPage,
  SspInquiryCreatePage,
  SspInquiryDetailPage,
  OrderDetailsPage,
  SspInquiryOrderPage,
  SspAssetDetailPage,
} from '@pages/yves';
import { SspInquiryStaticFixtures, SspInquiryDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerLogoutScenario } from '@scenarios/yves';

(['suite', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'ssp inquiry management',
  { tags: ['@yves', '@ssp-inquiry', '@ssp', '@SspInquiryManagement', 'ssp-inquiry-management', 'self-service-portal', 'spryker-core'] },
  (): void => {
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

    before((): void => {
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
      sspInquiryCreatePage.createSspInquiry(staticFixtures.generalSspInquiry);

      sspInquiryDetailPage.assertPageLocation();
      cy.contains(sspInquiryCreatePage.getSspInquiryCreatedMessage()).should('exist');

      sspInquiryListPage.visit();

      const sspInquiryReference = sspInquiryListPage.getFirstRowReference();
      sspInquiryListPage.openLatestSspInquiryDetailsPage();

      sspInquiryDetailPage.assertSspInquiryDetails({
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
      sspInquiryCreatePage.createOrderSspInquiry({
        ...staticFixtures.orderSspInquiry,
        orderReference: dynamicFixtures.order.order_reference,
      });

      sspInquiryDetailPage.assertPageLocation();
      cy.contains(sspInquiryCreatePage.getSspInquiryCreatedMessage()).should('exist');

      sspInquiryListPage.visit();
      const sspInquiryReference = sspInquiryListPage.getFirstRowReference();
      sspInquiryListPage.openLatestSspInquiryDetailsPage();

      sspInquiryDetailPage.assertOrderSspInquiryDetails({
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
      sspInquiryCreatePage.createSspAssetSspInquiry({
        ...staticFixtures.sspAssetSspInquiry,
        sspAssetReference: dynamicFixtures.sspAsset.reference,
      });

      sspInquiryDetailPage.assertPageLocation();
      cy.contains(sspInquiryCreatePage.getSspInquiryCreatedMessage()).should('exist');

      sspInquiryListPage.visit();
      const sspInquiryReference = sspInquiryListPage.getFirstRowReference();
      sspInquiryListPage.openLatestSspInquiryDetailsPage();

      sspInquiryDetailPage.assertSspAssetSspInquiryDetails({
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
      sspInquiryCreatePage.createSspInquiry(staticFixtures.generalSspInquiry);

      sspInquiryDetailPage.assertPageLocation();
      sspInquiryDetailPage.clickCancelSspInquiryButton();

      cy.get(sspInquiryDetailPage.getCanceledSspInquiryStatusSelector()).should('exist');
    });

    it('customer should not be able to cancel a ssp inquiry if he is now owner', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspInquiryListPage.visit();

      sspInquiryListPage.clickCreateSspInquiryButton();

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
      sspInquiryListPage.assetPageHasNoSspInquiries();
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
  }
);
