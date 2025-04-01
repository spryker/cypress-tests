import { container } from '@utils';
import {
  SspAssetCreatePage,
  SspAssetEditPage,
  SspAssetDetailPage,
  SspAssetListPage,
  CompanyUserSelectPage,
} from '@pages/yves';
import { SspAssetStaticFixtures, SspAssetDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

(['suite', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'ssp asset management',
  { tags: ['@yves', '@ssp-asset', '@ssp', '@sspAssetManagement'] },
  (): void => {
    const assetCreatePage = container.get(SspAssetCreatePage);
    const assetEditPage = container.get(SspAssetEditPage);
    const assetDetailPage = container.get(SspAssetDetailPage);
    const assetListPage = container.get(SspAssetListPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
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

      cy.location('pathname').should('include', '/customer/asset/update');
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

      assetListPage.assertTableHeaders(['Reference', 'Image', 'Asset Name', 'Serial Number', 'Business Unit Owner']);

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

      assetListPage
        .getAccessTableFilterSelect()
        .select(assetListPage.getAccessTableFilterByBusinessUnitValue(), { force: true });
      assetListPage.getSspAssetFiltersSubmitButton().click();

      assetListPage.assertTableData([dynamicFixtures.assetBU1C1BU2C1BU1C2, dynamicFixtures.assetBU1C1]);

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
  }
);
