import { container } from '@utils';
import { SspAssetDetailPage, CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { SspAssetSpecificCatalogStaticFixtures, SspAssetSpecificCatalogDynamicFixtures } from '@interfaces/yves';

(['suite', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'ssp asset specific catalog',
  { tags: ['@yves', '@ssp-asset', '@ssp', '@sspAssetManagement'] },
  (): void => {
    let staticFixtures: SspAssetSpecificCatalogStaticFixtures;
    let dynamicFixtures: SspAssetSpecificCatalogDynamicFixtures;
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const sspAssetDetailPage = container.get(SspAssetDetailPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);

    before(() => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('should view the catalog page with ssp asset finder', () => {
      catalogPage.visit();
      catalogPage.getSspAssetSelectorBlock().should('not.exist');

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      catalogPage.visit();

      cy.url().should('not.include', `ssp-asset-reference=${dynamicFixtures.sspAsset.reference}`);

      catalogPage.getSspAssetSelectorBlock().should('be.visible');
      catalogPage.getSspAssetNameBlock().invoke('text').should('match', /^\s*$/);
      catalogPage.selectSspAsset({
        name: dynamicFixtures.sspAsset.name,
      });

      cy.url().should('include', `ssp-asset-reference=${dynamicFixtures.sspAsset.reference}`);
    });

    it('should view the catalog page with ssp asset spare parts products', () => {
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

      sspAssetDetailPage.getSspAssetSparePartsButton().click();

      catalogPage.assertPageLocation();

      cy.url().should('include', `ssp-asset-reference=${dynamicFixtures.sspAsset.reference}`);

      catalogPage.getProductItemBlocks().should('have.length', 1);
      catalogPage
        .getProductItemBlocks()
        .first()
        .should('contain', dynamicFixtures.productSpareParts.localized_attributes[0].name);
      catalogPage.getSspAssetNameBlock().should('contain', dynamicFixtures.sspAsset.name);

      catalogPage.getProductItemBlocks().first().click();

      productPage.getSspAssetNameBlock().should('contain', dynamicFixtures.sspAsset.name);
    });

    it('should view the catalog page with ssp asset service products', () => {
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

      sspAssetDetailPage.getSspAssetServicesButton().click();

      catalogPage.assertPageLocation();

      cy.url().should('include', `ssp-asset-reference=${dynamicFixtures.sspAsset.reference}`);

      catalogPage.getProductItemBlocks().should('have.length', 1);
      catalogPage
        .getProductItemBlocks()
        .first()
        .should('contain', dynamicFixtures.productService.localized_attributes[0].name);
      catalogPage.getSspAssetNameBlock().should('contain', dynamicFixtures.sspAsset.name);
    });
  }
);
