import { container } from '@utils';
import { MerchantSearchDynamicFixtures } from '@interfaces/yves';
import { CatalogPage, ProductPage } from '@pages/yves';

describe(
  'merchant search',
  {
    tags: [
      '@yves',
      '@marketplace-merchant',
      'marketplace-merchant',
      'merchant',
      'catalog',
      'search',
      'spryker-core',
    ],
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

      // The fixture products only become findable once the catalog has been published and synced.
      cy.runCliCommands([
        'console publish:trigger-events -r product_abstract',
        'console queue:worker:start --stop-when-empty',
      ]);
    });

    it('given products offered by two merchants when the catalog is searched by merchant name then the results are the products that merchant sells', (): void => {
      // Arrange
      catalogPage.visit();

      // Act
      catalogPage.searchForProducts({ query: dynamicFixtures.merchant1.name });
      catalogPage.openFirstProductDetailPageFromResults();

      // Assert
      productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.merchant1.name);
    });

    it('given products offered by two merchants when the merchant facet is applied then the results are the products that merchant sells', (): void => {
      // Arrange
      catalogPage.visit();
      catalogPage.searchForProducts({ query: dynamicFixtures.product2.abstract_sku });

      // Act
      catalogPage.applyFilterValue({ filterName: 'Merchant', filterValue: dynamicFixtures.merchant2.name });
      catalogPage.openFirstProductDetailPageFromResults();

      // Assert
      productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.merchant2.name);
    });
  }
);
