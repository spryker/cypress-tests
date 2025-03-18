import { container } from '@utils';
import { SspAssetCreatePage, SspAssetEditPage, SspAssetDetailPage } from '@pages/yves';
import { SspAssetStaticFixtures, SspAssetDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'ssp asset management',
  { tags: ['@yves', '@ssp-asset', '@ssp', '@sspAssetManagement'] },
  (): void => {
    const assetCreatePage = container.get(SspAssetCreatePage);
    const assetEditPage = container.get(SspAssetEditPage);
    const assetDetailPage = container.get(SspAssetDetailPage);
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
  }
);
