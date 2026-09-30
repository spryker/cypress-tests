import { container } from '@utils';
import {
  MerchantProductOriginalPriceDynamicFixtures,
  MerchantProductOriginalPriceStaticFixtures,
} from '@interfaces/yves';
import { CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { retryableBefore } from '../../../support/e2e';

describe(
  'merchant product original price',
  {
    tags: [
      '@yves',
      'prices',
      'product',
      'catalog',
      'search',
      'marketplace-product',
      'marketplace-merchant-custom-prices',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because merchant products exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: MerchantProductOriginalPriceStaticFixtures;
    let dynamicFixtures: MerchantProductOriginalPriceDynamicFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('given a merchant product priced below its original price when the catalog is searched then the card and the detail page both show the two prices', (): void => {
      // Arrange
      catalogPage.visit();

      // Act
      catalogPage.searchForProducts({ query: dynamicFixtures.merchantProduct.abstract_sku });

      // Assert
      catalogPage.getFirstProductItemDefaultPrice().should('contain', staticFixtures.abstractPrice.default);
      catalogPage.getFirstProductItemOriginalPrice().should('contain', staticFixtures.abstractPrice.original);

      // Act
      catalogPage.openFirstProductDetailPageFromResults();

      // Assert
      productPage.getProductDetailPrice().should('contain', staticFixtures.abstractPrice.default);
      productPage.getProductDetailOriginalPrice().should('contain', staticFixtures.abstractPrice.original);
    });
  }
);
