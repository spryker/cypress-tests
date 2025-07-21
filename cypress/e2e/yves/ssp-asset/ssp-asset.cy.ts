import { container } from '@utils';
import {
  SspAssetCreatePage,
  SspAssetEditPage,
  SspAssetDetailPage,
  SspAssetListPage,
  CompanyUserSelectPage,
} from '@pages/yves';
import { SspAssetStaticFixtures, SspAssetDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario, CheckoutScenario } from '@scenarios/yves';

(['suite', 'b2b-mp', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'ssp asset management',
  { tags: ['@yves', '@ssp-asset', '@ssp', '@sspAssetManagement'] },
  (): void => {
    const assetCreatePage = container.get(SspAssetCreatePage);
    const assetEditPage = container.get(SspAssetEditPage);
    const assetDetailPage = container.get(SspAssetDetailPage);
    const assetListPage = container.get(SspAssetListPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const companyUserSelectPage = container.get(CompanyUserSelectPage);

    let staticFixtures: SspAssetStaticFixtures;
    let dynamicFixtures: SspAssetDynamicFixtures;

    before((): void => {
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

      cy.contains(assetCreatePage.getAssetCreatedMessage());

      assetDetailPage.assertPageLocation();

      assetDetailPage.assertAssetDetails({
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
      assetDetailPage.assertSspAssetAssignments([{ name: dynamicFixtures.businessUnit.name }]);

      assetListPage.visit();

      assetListPage.assertTableData([{ name: staticFixtures.asset.name }, { name: dynamicFixtures.asset.name }]);
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

      cy.contains(assetEditPage.getAssetEditedMessage());

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.asset.reference,
        },
      });

      assetDetailPage.assertAssetDetails({
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
      });

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.asset.reference,
        },
      });

      assetDetailPage.assertPageLocation();

      assetDetailPage.assertSspInquiries([
        { reference: dynamicFixtures.sspInquiry1.reference },
        { reference: dynamicFixtures.sspInquiry3.reference },
      ]);

      assetDetailPage.getViewAllInquiriesLink().should('exist');

      assetDetailPage.assertSspServices([
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

        cy.contains(assetReference).should('exist');
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

      assetListPage.assertTableHeaders(['Reference', 'Image', 'Asset Name', 'Serial number', 'Business Unit Owner']);

      assetListPage.assertTableData([
        dynamicFixtures.assetBU1C1BU2C1BU1C2,
        dynamicFixtures.assetBU2C1,
        dynamicFixtures.assetBU1C1,
      ]);

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.assetBU1C1BU2C1BU1C2.reference,
        },
      });

      assetDetailPage.assertSspAssetAssignments([
        { name: dynamicFixtures.businessUnit1Company1.name },
        { name: dynamicFixtures.businessUnit2Company1.name },
      ]);

      assetListPage.visit();

      if (['b2b'].includes(Cypress.env('repositoryId'))) {
        assetListPage.openFilters();
      }

      assetListPage
        .getAccessTableFilterSelect()
        .select(assetListPage.getAccessTableFilterByBusinessUnitValue(), { force: true });
      assetListPage.getSspAssetFiltersSubmitButton().click();

      assetListPage.assertTableData([dynamicFixtures.assetBU1C1BU2C1BU1C2, dynamicFixtures.assetBU1C1]);

      if (['b2b'].includes(Cypress.env('repositoryId'))) {
        assetListPage.openFilters();
      }

      assetListPage
        .getAccessTableFilterSelect()
        .select(assetListPage.getAccessTableFilterByCompanyValue(), { force: true });
      assetListPage.getSspAssetFiltersSubmitButton().click();

      assetListPage.assertTableData([
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

      assetListPage.assertTableData([dynamicFixtures.assetBU1C1BU2C1BU1C2, dynamicFixtures.assetBU1C1]);

      companyUserSelectPage.visit();
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser2BU2C1.id_company_user,
      });

      assetListPage.visit();

      assetListPage.assertTableData([dynamicFixtures.assetBU2C1, dynamicFixtures.assetBU1C1BU2C1BU1C2]);

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.assetBU1C1BU2C1BU1C2.reference,
        },
      });

      assetDetailPage.assertSspAssetAssignments([{ name: dynamicFixtures.businessUnit2Company1.name }]);
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

      assetListPage.assertTableData([dynamicFixtures.assetBU1C1, dynamicFixtures.assetBU1C1BU2C1BU1C2]);

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.assetBU1C1.reference,
        },
      });

      assetDetailPage.getUnassignLink().click();
      assetDetailPage.getUnassignButton().click();
      cy.contains(assetDetailPage.getUnassignmentErrorMessage()).should('exist');

      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.assetBU1C1BU2C1BU1C2.reference,
        },
      });

      assetDetailPage.getUnassignLink().click();
      assetDetailPage.getUnassignButton().click();

      assetListPage.assertTableData([dynamicFixtures.assetBU1C1]);
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

          assetDetailPage.assertSspServices([
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
