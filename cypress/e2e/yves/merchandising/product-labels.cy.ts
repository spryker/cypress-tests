import { container } from '@utils';
import { ProductLabelsDynamicFixtures, ProductLabelsStaticFixtures } from '@interfaces/yves';
import { CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'product labels',
  { tags: ['@yves', '@merchandising', 'product-labels', 'product', 'search', 'catalog', 'spryker-core'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ProductLabelsStaticFixtures;
    let dynamicFixtures: ProductLabelsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a published label is assigned to a product when the catalog listing and the detail page are opened then both render the label', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      // Act
      catalogPage.visit();
      catalogPage.searchForProducts({ query: dynamicFixtures.labelledProduct.abstract_sku });

      // Assert
      catalogPage.getProductItemBlocks().first().should('contain', staticFixtures.labelName);

      // Act
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.labelledProduct.abstract_sku });

      // Assert
      productPage.getProductLabels().should('contain', staticFixtures.labelName);
    });
  }
);
