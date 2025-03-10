import { container } from '@utils';
import { SspAssetCreatePage, SspAssetEditPage, SspAssetDetailPage, SspAssetListPage } from '@pages/yves';
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

    let staticFixtures: SspAssetStaticFixtures;
    let dynamicFixtures: SspAssetDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach(() => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
    });

    it('should create an asset successfully', () => {
      assetCreatePage.visit();

      assetCreatePage.createAsset({ name: staticFixtures.asset.name });

      cy.contains(assetCreatePage.getAssetCreatedMessage());
    });

    it('should update an asset successfully', () => {
      assetEditPage.visit({
        qs: {
          reference: dynamicFixtures.asset.reference,
        },
      });

      assetEditPage.editAsset({
        name: 'new asset name',
      });

      cy.contains(assetEditPage.getAssetEditedMessage());
    });

    it('should view asset details correctly', () => {
      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.asset.reference,
        },
      });

      assetDetailPage.assertPageLocation();

      assetDetailPage.assertAssetDetails({
        reference: dynamicFixtures.asset.reference,
        name: dynamicFixtures.asset.name,
        note: dynamicFixtures.asset.note,
      });

      cy.contains('Create claim').should('exist');
      cy.contains('Search services').should('exist');
    });

    it('should navigate to edit page from details page', () => {
      assetDetailPage.visit({
        qs: {
          reference: dynamicFixtures.asset.reference,
        },
      });

      assetDetailPage.clickEditButton();

      cy.location('pathname').should('include', '/customer/asset/update');
      cy.location('search').should('include', `reference=${dynamicFixtures.asset.reference}`);
    });

    it('should navigate to asset details from asset list', () => {
      assetListPage.visit();

      assetListPage.getFirstRowReference().then(assetReference => {
        assetListPage.openLatestAssetDetailsPage();

        assetDetailPage.assertPageLocation();

        cy.contains(assetDetailPage.getAssetDetailsReference(assetReference)).should('exist');
      });
    });

    it('should navigate to asset creation from asset list', () => {
      assetListPage.visit();

      assetListPage.clickCreateAssetButton();

      assetCreatePage.assertPageLocation();
    });

    it('should display asset table with correct data', () => {
      // Visit the asset list page
      assetListPage.visit();

      assetListPage.assertTableHeaders(['Reference', 'Image', 'Asset name', 'Serial Number', 'Business Unit', 'Date added']);

      assetListPage.assertTableHasData();
    });
  }
);
