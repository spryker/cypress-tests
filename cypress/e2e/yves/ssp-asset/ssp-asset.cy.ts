import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import {
  SspAssetCreatePage,
  SspAssetEditPage,
  SspAssetDetailPage,
  SspAssetListPage,
  CompanyUserSelectPage,
  CatalogPage,
  ProductPage,
  CustomerOverviewPage,
  CartPage,
  OrderDetailsPage,
} from '@pages/yves';
import { SspAssetStaticFixtures, SspAssetDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario, CheckoutScenario } from '@scenarios/yves';

interface AssetDetailsData {
  reference?: string;
  name?: string;
  serialNumber?: string;
  note?: string;
  image?: string;
  businessUnitOwner?: { name: string };
  businessUnitAssignment?: { name: string }[];
}

interface SspServiceData {
  name: string;
  customerFirstName: string;
  customerLastName: string;
  companyName: string;
}

interface SspAssetRow {
  reference?: string;
  name?: string;
}

const assertAssetDetails = (page: SspAssetDetailPage, details: AssetDetailsData): void => {
  if (details.reference) {
    page.getReferenceContainer(details.reference).should('exist');
  }

  if (details.name) {
    page.getAssetTitle().should('contain', details.name);
  }

  if (details.serialNumber) {
    page.getSerialNumberContainer(details.serialNumber).should('exist');
  }

  if (details.note) {
    page.getNoteContainer(details.note).should('exist');
  }

  if (details.image) {
    page.getImageSrc().should('include', 'customer/ssp-asset/view-image?ssp-asset-reference=');
  } else {
    page.getImageSrc().should('not.include', 'customer/ssp-asset/view-image?ssp-asset-reference=');
  }
};

const assertSspInquiries = (page: SspAssetDetailPage, sspInquiries: { reference: string }[]): void => {
  page.getSspAssetInquiriresTable().should('exist');
  page.getSspAssetInquiriresTable().find('tbody tr').its('length').should('eq', sspInquiries.length);

  sspInquiries.forEach((sspInquiry) => {
    page.getSspAssetInquiriresTable().should('contain', sspInquiry.reference);
  });
};

const assertSspServices = (page: SspAssetDetailPage, sspServices: SspServiceData[]): void => {
  page.getSspAssetServicesTable().should('exist');
  page.getSspAssetServicesTable().find('tbody tr').its('length').should('eq', sspServices.length);

  sspServices.forEach((sspService) => {
    page.getSspAssetServicesTable().should('contain', sspService.name);
    page.getSspAssetServicesTable().should('contain', sspService.customerFirstName);
    page.getSspAssetServicesTable().should('contain', sspService.customerLastName);
    page.getSspAssetServicesTable().should('contain', sspService.companyName);
  });
};

const assertSspAssetAssignments = (page: SspAssetDetailPage, assignedBusinessUnits: { name: string }[]): void => {
  page.getSspAssetAssignments().its('length').should('eq', assignedBusinessUnits.length);

  assignedBusinessUnits.forEach((assignedBusinessUnit) => {
    page.getSspAssetAssignments().should('contain', assignedBusinessUnit.name);
  });
};

const assertTableHeaders = (page: SspAssetListPage, expectedHeaders: string[]): void => {
  page.getTableHeaders().each(($header, index) => {
    if (index < expectedHeaders.length && expectedHeaders[index]) {
      cy.wrap($header).contains(new RegExp(expectedHeaders[index], 'i')).should('exist');
    }
  });
};

const assertTableData = (page: SspAssetListPage, sspAssets: SspAssetRow[]): void => {
  page.getRows().its('length').should('eq', sspAssets.length);

  sspAssets.forEach((sspAsset) => {
    if (sspAsset.reference) {
      page.getRows().contains(sspAsset.reference).should('exist');
    }
    if (sspAsset.name) {
      page.getRows().contains(sspAsset.name).should('exist');
    }
  });
};

describe(
  'ssp asset management',
  {
    tags: [
      '@yves',
      '@ssp-asset',
      '@ssp',
      '@sspAssetManagement',
      'ssp-asset-management',
      'self-service-portal',
      'spryker-core',
      'navigation',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }
    const assetCreatePage = container.get(SspAssetCreatePage);
    const assetEditPage = container.get(SspAssetEditPage);
    const assetDetailPage = container.get(SspAssetDetailPage);
    const assetListPage = container.get(SspAssetListPage);
    const cartPage = container.get(CartPage);
    const catalogPage = container.get(CatalogPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const companyUserSelectPage = container.get(CompanyUserSelectPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const productPage = container.get(ProductPage);

    let staticFixtures: SspAssetStaticFixtures;
    let dynamicFixtures: SspAssetDynamicFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('should create an asset successfully', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      assetCreatePage.visit();

      assetListPage.getSspAssetCustomerMenuItem().should('exist');

      assetCreatePage.createAsset({
        name: staticFixtures.asset.name,
        note: staticFixtures.asset.note,
        serialNumber: staticFixtures.asset.serial_number,
        image: staticFixtures.asset.image,
      });

      assetCreatePage.assertBodyContainsText(assetCreatePage.getAssetCreatedMessage());

      assetDetailPage.assertPageLocation();

      assertAssetDetails(assetDetailPage, {
        name: staticFixtures.asset.name,
        note: staticFixtures.asset.note,
        serialNumber: staticFixtures.asset.serial_number,
        image: staticFixtures.asset.image,
        businessUnitOwner: { name: dynamicFixtures.businessUnit.name },
        businessUnitAssignment: [{ name: dynamicFixtures.businessUnit.name }],
      });

      assetDetailPage.getSspAssetServicesButton().should('exist');
      assetDetailPage.getUnassignButton().should('exist');
      assetDetailPage.getEditButton().should('exist');
      assetDetailPage.getSspAssetServicesButton().should('exist');
      assertSspAssetAssignments(assetDetailPage, [{ name: dynamicFixtures.businessUnit.name }]);

      assetListPage.visit();

      assertTableData(assetListPage, [{ name: staticFixtures.asset.name }, { name: dynamicFixtures.asset.name }]);
    });

    it('should update an asset successfully', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      assetEditPage.visit({
        qs: {
          reference: dynamicFixtures.asset.reference,
        },
      });

      assetEditPage.editAsset({
        name: staticFixtures.assetUpdateData.name,
        serialNumber: staticFixtures.assetUpdateData.serial_number,
        note: staticFixtures.assetUpdateData.note,
        image: staticFixtures.assetUpdateData.image,
      });

      assetEditPage.assertBodyContainsText(assetEditPage.getAssetEditedMessage());

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.asset.reference,
        },
      });

      assertAssetDetails(assetDetailPage, {
        name: dynamicFixtures.asset.name,
        serialNumber: dynamicFixtures.asset.serial_number,
      });
    });

    it('should view asset relations correctly', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      checkoutScenario.execute({
        paymentMethod: 'dummyPaymentInvoice',
        idCustomerAddress: 0,
        isMultiShipment: true,
      });

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.asset.reference,
        },
      });

      assetDetailPage.assertPageLocation();

      assertSspInquiries(assetDetailPage, [
        { reference: dynamicFixtures.sspInquiry1.reference },
        { reference: dynamicFixtures.sspInquiry3.reference },
      ]);

      assetDetailPage.getViewAllInquiriesLink().should('exist');

      assertSspServices(assetDetailPage, [
        {
          name: dynamicFixtures.product1.localized_attributes[0].name,
          customerFirstName: dynamicFixtures.customer.first_name,
          customerLastName: dynamicFixtures.customer.last_name,
          companyName: dynamicFixtures.company.name,
        },
        {
          name: dynamicFixtures.product2.localized_attributes[0].name,
          customerFirstName: dynamicFixtures.customer.first_name,
          customerLastName: dynamicFixtures.customer.last_name,
          companyName: dynamicFixtures.company.name,
        },
      ]);
    });

    it('should navigate to ssp asset pages from different sources', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.asset.reference,
        },
      });

      assetDetailPage.getEditButton().click();

      cy.location('pathname').should('include', '/customer/ssp-asset/update');
      cy.location('search').should('include', `reference=${dynamicFixtures.asset.reference}`);
      assetEditPage.getAssetForm().should('exist');

      assetListPage.visit();

      assetListPage.getFirstRowReference().then((assetReference) => {
        assetListPage.openLatestAssetDetailsPage();

        assetDetailPage.assertPageLocation();

        assetListPage.assertBodyContainsText(assetReference).should('exist');
      });

      assetListPage.visit();

      assetListPage.getCreateAssetButton().click();

      assetCreatePage.assertPageLocation();
      assetCreatePage.getAssetForm().should('exist');
    });

    it('should be able to view company assets', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.companyUser1BU1C1.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      assetListPage.visit();

      assertTableHeaders(assetListPage, ['Reference', 'Image', 'Asset Name', 'Serial Number', 'Business Unit Owner']);

      assertTableData(assetListPage, [
        dynamicFixtures.assetBU1C1BU2C1BU1C2,
        dynamicFixtures.assetBU2C1,
        dynamicFixtures.assetBU1C1,
      ]);

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.assetBU1C1BU2C1BU1C2.reference,
        },
      });

      assertSspAssetAssignments(assetDetailPage, [
        { name: dynamicFixtures.businessUnit1Company1.name },
        { name: dynamicFixtures.businessUnit2Company1.name },
      ]);

      assetListPage.visit();

      if (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
        assetListPage.openFilters();
      }

      assetListPage.getSspAssetFiltersSubmitButton().click();

      assertTableData(assetListPage, [
        dynamicFixtures.assetBU1C1BU2C1BU1C2,
        dynamicFixtures.assetBU2C1,
        dynamicFixtures.assetBU1C1,
      ]);

      if (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
        assetListPage.openFilters();
      }

      assetListPage
        .getAccessTableFilterSelect()
        .select(assetListPage.getAccessTableFilterByCompanyValue(), { force: true });
      assetListPage.getSspAssetFiltersSubmitButton().click();

      assertTableData(assetListPage, [
        dynamicFixtures.assetBU1C1BU2C1BU1C2,
        dynamicFixtures.assetBU2C1,
        dynamicFixtures.assetBU1C1,
      ]);
    });

    it('should be able to view business unit assets', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.companyUser2BU1C1.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser2BU1C1.id_company_user,
      });

      assetListPage.visit();

      assertTableData(assetListPage, [dynamicFixtures.assetBU1C1BU2C1BU1C2, dynamicFixtures.assetBU1C1]);

      companyUserSelectPage.visit();
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser2BU2C1.id_company_user,
      });

      assetListPage.visit();

      assertTableData(assetListPage, [dynamicFixtures.assetBU2C1, dynamicFixtures.assetBU1C1BU2C1BU1C2]);

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.assetBU1C1BU2C1BU1C2.reference,
        },
      });

      assertSspAssetAssignments(assetDetailPage, [{ name: dynamicFixtures.businessUnit2Company1.name }]);
    });

    it('should not be able to create asset without permission', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.companyUser2BU1C1.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser2BU1C1.id_company_user,
      });

      assetListPage.visit();

      assetListPage.getCreateAssetButton().should('not.exist');
    });

    it('should not be able to update asset without permission', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.companyUser2BU2C1.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser2BU2C1.id_company_user,
      });

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.assetBU1C1BU2C1BU1C2.reference,
        },
      });

      assetDetailPage.getEditButton().should('not.exist');
    });

    it('should be able to unassign asset', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.companyUser2BU2C1.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser2BU1C1.id_company_user,
      });

      assetListPage.visit();

      assertTableData(assetListPage, [dynamicFixtures.assetBU1C1, dynamicFixtures.assetBU1C1BU2C1BU1C2]);

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.assetBU1C1.reference,
        },
      });

      assetDetailPage.getUnassignLink().click();
      assetDetailPage.getUnassignButton().click();
      assetDetailPage.assertBodyContainsText(assetDetailPage.getUnassignmentErrorMessage()).should('exist');

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.assetBU1C1BU2C1BU1C2.reference,
        },
      });

      assetDetailPage.getUnassignLink().click();
      assetDetailPage.getUnassignButton().click();

      assertTableData(assetListPage, [dynamicFixtures.assetBU1C1]);
    });

    // The flickery test will be fixed later: https://spryker.atlassian.net/browse/SSP-1654
    it.skip('customer should be able to select asset on product detail page and asset details are available on checkout summary and order history', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer3.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product1.sku });
      productPage.selectAsset();
      productPage.addToCart();

      cartPage.getCartItemSummary(0).next().contains(dynamicFixtures.assetBU1C2.name);
      cartPage.getCartItemSummary(0).next().contains('Compatible');

      cartPage.visit();
      cartPage.startCheckout();

      checkoutScenario.execute({
        paymentMethod: 'dummyPaymentInvoice',
        idCustomerAddress: 0,
      });

      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage());

      customerOverviewPage.viewLastPlacedOrder();

      orderDetailsPage.getOrderDetailTableBlock().contains(dynamicFixtures.assetBU1C2.name).should('exist');
    });

    it('should not be able to view assets without permission', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.companyUser4BU1C2.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      cy.intercept('GET', '**/customer/ssp-asset**').as('assetRequest');
      assetListPage.visit();
      cy.url().should('include', 'errorMessage=self_service_portal.asset.access.denied');

      cy.intercept('GET', '**/customer/ssp-asset/details**').as('assetDetailRequest');
      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.assetBU1C1BU2C1BU1C2.reference,
        },
      });
      cy.url().should('include', 'errorMessage=self_service_portal.asset.access.denied');
    });

    it('should display services on SSP asset detail page for volume testing', () => {
      customerLoginScenario.execute({
        email: 'ssp-service@volume.data',
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      // Customer is created by execution of `docker/sdk testing console volume-data:generate -e ServiceSspAssetOrder`.
      // This command creates:
      // - customer `ssp-service@volume.data`.
      // - orders with service product.
      // - service products have relation with ssp assets.
      // Below checks are not executed if customer is not generated.
      cy.url().then((url) => {
        if (url.includes('customer/overview')) {
          assetListPage.visit();

          assetListPage.openLatestAssetDetailsPage();

          assertSspServices(assetDetailPage, [
            { name: '', companyName: '', customerFirstName: '', customerLastName: '' },
            { name: '', companyName: '', customerFirstName: '', customerLastName: '' },
            { name: '', companyName: '', customerFirstName: '', customerLastName: '' },
            { name: '', companyName: '', customerFirstName: '', customerLastName: '' },
          ]);
        } else {
          cy.log('Not on customer overview page after login - skipping remaining test steps');
          assert.isTrue(true, 'Not on customer overview page after login');
        }
      });
    });
  }
);
