import { container } from '@utils';
import { ProductRelationsDynamicFixtures, ProductRelationsStaticFixtures } from '@interfaces/yves';
import { CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'product relations',
  { tags: ['@yves', '@merchandising', 'product-relations', 'product', 'spryker-core'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ProductRelationsStaticFixtures;
    let dynamicFixtures: ProductRelationsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    // The up-selling half of the source journey stays where it already lives, in
    // cart-up-selling-products.cy.ts; this spec carries the product detail page half.
    it('given one product carries a related-products relation and another carries none when both detail pages are opened then only the first shows the related products carousel', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      // Act
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.productWithRelatedProduct.sku });

      // Assert
      productPage.getRelatedProductsCarousel().should('be.visible');

      // Act
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.productWithoutRelatedProduct.sku });

      // Assert
      productPage.getRelatedProductsSection().should('not.exist');
    });
  }
);
