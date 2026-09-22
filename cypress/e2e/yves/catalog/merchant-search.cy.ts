import { container } from '@utils';
import { MerchantSearchDynamicFixtures } from '@interfaces/yves';
import { CatalogPage, ProductPage } from '@pages/yves';

describe(
  'merchant search',
  {
    tags: ['@yves', '@marketplace-merchant', 'marketplace-merchant', 'merchant', 'catalog', 'search', 'spryker-core'],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because merchants exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);

    let dynamicFixtures: MerchantSearchDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures } = Cypress.env());

      // The fixture products reach the catalog only once it has been rebuilt. A tree-wide publish
      // times the gateway out, so this stays narrowed to the catalog.
      cy.runCliCommands([
        'console publish:trigger-events -r product_abstract',
        'console queue:worker:start --stop-when-empty',
      ]);
    });

    it("given two merchants offering a product of the same name when the merchant facet is applied then only that merchant's product is listed", (): void => {
      // Arrange
      // Both fixture products carry the same name, so the query returns both of them alongside the
      // catalog's own matches, and the merchant facet is what narrows the list.
      catalogPage.visit();
      catalogPage.searchForProducts({ query: dynamicFixtures.localizedAttribute.name });
      catalogPage.getProductItemBlocks().should('have.length.at.least', 2);

      // Act
      catalogPage.applyFilterValue({ filterName: MERCHANT_FILTER_NAME, filterValue: dynamicFixtures.merchant2.name });

      // Assert
      // Only the second merchant's product carries that merchant, so the facet leaves exactly it.
      catalogPage.getProductItemBlocks().should('have.length', 1);

      catalogPage.openFirstProductDetailPageFromResults();
      productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.merchant2.name);
    });
  }
);

// The storefront names the merchant facet after its product-document field.
const MERCHANT_FILTER_NAME = 'merchant_name';
