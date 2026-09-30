import { container } from '@utils';
import { OriginalPriceDynamicFixtures, OriginalPriceStaticFixtures } from '@interfaces/yves';
import { CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { retryableBefore } from '../../../support/e2e';

describe('original price', { tags: ['@yves', 'prices', 'product', 'catalog', 'search', 'spryker-core'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: OriginalPriceStaticFixtures;
  let dynamicFixtures: OriginalPriceDynamicFixtures;

  retryableBefore((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
  });

  it('given an abstract product priced above its default price when the catalog is searched then the card shows the default and the original price side by side', (): void => {
    // Arrange
    catalogPage.visit();

    // Act
    catalogPage.searchForProducts({ query: dynamicFixtures.product.abstract_sku });

    // Assert
    catalogPage.getFirstProductItemDefaultPrice().should('contain', staticFixtures.abstractPrice.default);
    catalogPage.getFirstProductItemOriginalPrice().should('contain', staticFixtures.abstractPrice.original);
  });

  it('given a variant carrying prices of its own when it is selected on the product detail page then its default and original price replace the abstract ones', (): void => {
    // Arrange
    catalogPage.visit();
    catalogPage.searchForProducts({ query: dynamicFixtures.product.abstract_sku });
    catalogPage.openFirstProductDetailPageFromResults();

    // Assert
    // Before a variant is resolved the detail page prices the abstract, even though one variant is
    // cheaper than it.
    productPage.getProductDetailPrice().should('contain', staticFixtures.abstractPrice.default);
    productPage.getProductDetailOriginalPrice().should('contain', staticFixtures.abstractPrice.original);

    // Act
    productPage.selectVariantAttribute({
      attributeKey: staticFixtures.variant.attributeKey,
      attributeValue: staticFixtures.variant.attributeValue,
    });

    // Assert
    productPage.getProductDetailPrice().should('contain', staticFixtures.variant.default);
    productPage.getProductDetailOriginalPrice().should('contain', staticFixtures.variant.original);
  });
});
