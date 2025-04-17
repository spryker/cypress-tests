import { container } from '@utils';
import {
    SspAssetCreatePage,
    SspAssetEditPage,
    SspAssetDetailPage,
    SspAssetListPage,
    CompanyUserSelectPage,
    CartPage,
    ProductPage, CatalogPage
} from '@pages/yves';
import { SspAssetStaticFixtures, SspAssetDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'ssp asset management',
  { tags: ['@yves', '@ssp-asset', '@ssp', '@sspAssetManagement'] },
  (): void => {
    const assetCreatePage = container.get(SspAssetCreatePage);
    const assetEditPage = container.get(SspAssetEditPage);
    const assetDetailPage = container.get(SspAssetDetailPage);
    const assetListPage = container.get(SspAssetListPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const companyUserSelectPage = container.get(CompanyUserSelectPage);
    const cartPage = container.get(CartPage);
    const productPage = container.get(ProductPage);
    const catalogPage = container.get(CatalogPage);

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

    it('should allow selecting an asset during cart process', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer3.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      cy.wait(3000);

      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product1.sku });


      // Verify and interact with asset functionality
      // Using proper selectors that match what's in the application
      cy.get('[data-qa="asset-finder"]').should('be.visible');

      // Search for asset using the asset finder component
      cy.get('[data-qa="asset-finder"]').type(dynamicFixtures.assetBU1C1BU2C1BU1C2.name);

      cy.wait(3000);

      cy.get('[data-qa="asset-fnder-dropdown-element"]').first().parent().click();

      //
      // // Select the asset from search results
      // cy.get('[data-qa="asset-item"]').contains(dynamicFixtures.asset.name).click();
      //
      // // Verify asset is selected
      // cy.get('[data-qa="selected-asset-name"]').should('contain', dynamicFixtures.asset.name);
      //
      // // Proceed to checkout
      // cy.get('[data-qa="checkout-button"]').click();
      //
      // // Complete checkout process using direct DOM interactions
      // // Fill address form
      // cy.get('[data-qa="address-form"]').should('be.visible');
      // cy.get('[data-qa="next-button"]').click();
      //
      // // Select shipment method
      // cy.get('[data-qa="shipment-method"]').first().click();
      // cy.get('[data-qa="next-button"]').click();
      //
      // // Select payment method
      // cy.get('[data-qa="payment-method"]').first().click();
      // cy.get('[data-qa="next-button"]').click();
      //
      // // Verify asset in summary page
      // cy.get('[data-qa="checkout-summary"]').should('be.visible');
      // cy.get('[data-qa="checkout-summary-asset"]').should('contain', dynamicFixtures.asset.name);
      //
      // // Place order
      // cy.get('[data-qa="place-order-button"]').click();
      //
      // // Verify order was placed successfully
      // cy.get('[data-qa="order-success"]').should('be.visible');
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

    it('should allow changing an asset in the cart', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      // Add product to cart
      productPage.visit();
      productPage.addToCart();

      // Go to cart
      cartPage.visit();

      // Select initial asset using direct DOM selectors
      cy.get('[data-qa="asset-finder-button"]').click();
      cy.get('[data-qa="asset-finder-search-input"]').type(dynamicFixtures.asset.name);
      cy.get('[data-qa="asset-finder-search-button"]').click();
      cy.get('[data-qa="asset-item"]').contains(dynamicFixtures.asset.name).click();

      // Verify initial asset is selected
      cy.get('[data-qa="selected-asset-name"]').should('contain', dynamicFixtures.asset.name);

      // Change to a different asset
      cy.get('[data-qa="change-asset-button"]').click();
      cy.get('[data-qa="asset-finder-search-input"]').clear().type(staticFixtures.asset.name);
      cy.get('[data-qa="asset-finder-search-button"]').click();
      cy.get('[data-qa="asset-item"]').contains(staticFixtures.asset.name).click();

      // Verify new asset is selected
      cy.get('[data-qa="selected-asset-name"]').should('contain', staticFixtures.asset.name);
    });

    it('should handle case when no assets are available', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      // Add product to cart
      productPage.visit();
      productPage.addToCart();

      // Go to cart
      cartPage.visit();

      // Search for non-existent asset
      cy.get('[data-qa="asset-finder-button"]').click();
      cy.get('[data-qa="asset-finder-search-input"]').type('nonexistent-asset-123456');
      cy.get('[data-qa="asset-finder-search-button"]').click();

      // Verify no results message
      cy.get('[data-qa="no-assets-found"]').should('be.visible');
      cy.get('[data-qa="no-assets-found"]').should('contain', 'No assets found');
    });

    it('should view asset details from cart', () => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      // Add product to cart
      productPage.visit();
      productPage.addToCart();

      // Go to cart
      cartPage.visit();

      // Select asset
      cy.get('[data-qa="asset-finder-button"]').click();
      cy.get('[data-qa="asset-finder-search-input"]').type(dynamicFixtures.asset.name);
      cy.get('[data-qa="asset-finder-search-button"]').click();
      cy.get('[data-qa="asset-item"]').contains(dynamicFixtures.asset.name).click();

      // View asset details
      cy.get('[data-qa="view-asset-details"]').click();

      // Verify asset details modal
      cy.get('[data-qa="asset-details-modal"]').should('be.visible');
      cy.get('[data-qa="asset-details-name"]').should('contain', dynamicFixtures.asset.name);
      cy.get('[data-qa="asset-details-reference"]').should('contain', dynamicFixtures.asset.reference);
      cy.get('[data-qa="asset-details-serial-number"]').should('contain', dynamicFixtures.asset.serial_number);

      // Close modal
      cy.get('[data-qa="close-asset-details"]').click();
      cy.get('[data-qa="asset-details-modal"]').should('not.exist');
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
