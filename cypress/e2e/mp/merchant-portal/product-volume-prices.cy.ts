import { container } from '@utils';
import { ProductVolumePricesDynamicFixtures, ProductVolumePricesStaticFixtures } from '@interfaces/mp';
import { ProductsPage } from '@pages/mp';
import { CartPage, CatalogPage, ProductPage } from '@pages/yves';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'product volume prices',
  {
    tags: [
      '@mp',
      '@merchant-portal',
      'prices',
      'cart',
      'marketplace-cart',
      'marketplace-product',
      'marketplace-merchant-custom-prices',
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
    const cartPage = container.get(CartPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    // A tree-wide publish times the gateway out, so this stays narrowed to what the journey reads.
    const publishAndSyncCommands = [
      'console publish:trigger-events -r product_abstract',
      'console publish:trigger-events -r price_product_abstract',
      'console queue:worker:start --stop-when-empty',
    ];

    let staticFixtures: ProductVolumePricesStaticFixtures;
    let dynamicFixtures: ProductVolumePricesDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a merchant product carrying a volume price when the merchant deletes that price row then the storefront falls back to the default price', (): void => {
      // Arrange
      cy.runCliCommands(publishAndSyncCommands);
      loginAsCustomer();
      openProductDetailPage();

      // The tier is what the storefront charges while the volume price row exists.
      productPage.getProductDetailPrice().should('contain', staticFixtures.unitPrice);
      productPage.setQuantity({ quantity: staticFixtures.volumeTier.quantity });
      productPage.getProductDetailPrice().should('contain', staticFixtures.volumeTier.price);

      productPage.addToCart();
      cartPage.visit();
      cartPage
        .getProductCartItems()
        .filter(`:contains("${dynamicFixtures.merchantProduct.sku}")`)
        .should('have.length', 1)
        .and('contain.text', staticFixtures.volumeTier.price);

      cartPage.clearCartIfNotEmpty();

      // Act
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      productsPage.visit();
      productsPage.find({ query: dynamicFixtures.merchantProduct.abstract_sku }).click();
      productsPage.deletePriceRowByQuantity({ quantity: staticFixtures.volumeTier.threshold });

      cy.runCliCommands(publishAndSyncCommands);

      // Assert
      loginAsCustomer();
      openProductDetailPage();

      productPage.setQuantity({ quantity: staticFixtures.volumeTier.quantity });
      productPage.getProductDetailPrice().should('contain', staticFixtures.unitPrice);

      productPage.addToCart();
      cartPage.visit();
      cartPage
        .getProductCartItems()
        .filter(`:contains("${dynamicFixtures.merchantProduct.sku}")`)
        .should('have.length', 1)
        .and('contain.text', staticFixtures.unitPrice);
    });

    function loginAsCustomer(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    }

    function openProductDetailPage(): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });
    }
  }
);
