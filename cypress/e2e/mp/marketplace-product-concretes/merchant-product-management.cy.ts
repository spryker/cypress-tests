import { container } from '@utils';
import { MerchantProductManagementDynamicFixtures, MerchantProductManagementStaticFixtures } from '@interfaces/mp';
import { ProductsPage } from '@pages/mp';
import { CatalogPage, ProductPage } from '@pages/yves';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describe(
  'merchant product management',
  {
    tags: [
      '@mp',
      '@merchant-product-concretes',
      'product',
      'marketplace-product',
      'marketplace-merchantportal-core',
      'marketplace-merchant-portal-product-management',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because merchant products exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const productsPage = container.get(ProductsPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    // A tree-wide publish times the gateway out, so this stays narrowed to the catalog.
    const publishAndSyncCommands = [
      'console publish:trigger-events -r product_abstract',
      'console queue:worker:start --stop-when-empty',
    ];

    let staticFixtures: MerchantProductManagementStaticFixtures;
    let dynamicFixtures: MerchantProductManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a merchant product with one variant when the merchant adds another concrete then the storefront offers both variants', (): void => {
      // Arrange
      const addedConcrete = staticFixtures.addedConcrete;
      const abstractSku = dynamicFixtures.variantProduct.abstract_sku;

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      // Act
      productsPage.openProduct({ query: abstractSku });
      productsPage.openConcreteProductsTab();
      productsPage.addConcreteProducts({ attributeValues: [addedConcrete.attributeValue] });

      // A concrete product reaches the storefront only once it is active, stocked and searchable.
      productsPage.openProduct({ query: abstractSku });
      productsPage.openConcreteProductsTab();
      productsPage.openConcreteProduct({ rowText: addedConcrete.attributeValue });
      productsPage.activateConcreteProduct({
        stockQuantity: addedConcrete.stockQuantity,
        searchableLocales: addedConcrete.searchableLocales,
      });
      productsPage.save();
      productsPage.assertBodyContainsText(PRODUCT_SAVED_MESSAGE);

      cy.runCliCommands(publishAndSyncCommands);

      // Assert
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: abstractSku });
      productPage.getVariantAttributeOptions(VARIANT_ATTRIBUTE_KEY).should('have.length.at.least', 2);
    });
  }
);

const PRODUCT_SAVED_MESSAGE = 'The Product is saved.';

// The super attribute the fixture product varies on.
const VARIANT_ATTRIBUTE_KEY = 'color';
