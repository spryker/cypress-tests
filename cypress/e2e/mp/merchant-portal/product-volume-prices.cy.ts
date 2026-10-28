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

    let staticFixtures: ProductVolumePricesStaticFixtures;
    let dynamicFixtures: ProductVolumePricesDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      // A tree-wide publish times the gateway out, so this stays narrowed to what the storefront reads.
      cy.runCliCommands([
        `console publish:trigger-events -r product_abstract -i ${dynamicFixtures.merchantProduct.fk_product_abstract}`,
        `console publish:trigger-events -r price_product_abstract -i ${dynamicFixtures.merchantProduct.fk_product_abstract}`,
        'console queue:worker:start --stop-when-empty',
      ]);
    });

    it('given a merchant product carrying a volume price when the merchant deletes that price row then the product no longer lists it', (): void => {
      // Arrange
      const abstractSku = dynamicFixtures.editableProduct.abstract_sku;

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      // Act
      productsPage.openProduct({ query: abstractSku });
      productsPage.deletePriceRowByQuantity({ quantity: staticFixtures.volumeTier.threshold });

      // Assert
      productsPage.openProduct({ query: abstractSku });
      productsPage.getPriceRowsByQuantity({ quantity: staticFixtures.volumeTier.threshold }).should('have.length', 0);
    });

    it('given a merchant product carrying a volume price when a customer orders more than its threshold then the storefront charges the volume price', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      cartPage.visit();
      cartPage.clearCartIfNotEmpty();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });
      productPage.getProductDetailPrice().should('contain', staticFixtures.unitPrice);

      // Act
      productPage.setQuantity({ quantity: staticFixtures.volumeTier.quantity });

      // Assert
      productPage.getProductDetailPrice().should('contain', staticFixtures.volumeTier.price);

      // Act
      productPage.addToCart();

      // Assert
      cartPage.visit();
      cartPage
        .getCartItemsChargingUnitPrice({
          sku: dynamicFixtures.merchantProduct.sku,
          unitPrice: staticFixtures.volumeTier.price,
          quantity: staticFixtures.volumeTier.quantity,
        })
        .should('have.length', 1);
    });
  }
);
