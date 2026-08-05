import { container } from '@utils';
import { CartUpSellingProductsDynamicFixtures, CartUpSellingProductsStaticFixtures } from '@interfaces/yves';
import { CartUpSellingProductsPage, CartPage, CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'cart up-selling products',
  { tags: ['@yves', '@cart', 'cart', 'product', 'product-relation', 'up-selling', 'spryker-core'] },
  (): void => {
    const cartUpSellingProductsPage = container.get(CartUpSellingProductsPage);
    const cartPage = container.get(CartPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: CartUpSellingProductsStaticFixtures;
    let dynamicFixtures: CartUpSellingProductsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    // Ported from Codeception CartUpSellingProductsCest::testAddToCartItemAndCheckUpsellingItemsExist.
    // The source was skipped; this runs live now that the up-selling fixture helper is registered.
    it('should show the up-selling carousel on the cart page after adding the base product', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.addToCart();

      cartPage.visit();
      cartUpSellingProductsPage.getUpSellingCarousel().should('be.visible');
      cartUpSellingProductsPage.getUpSellingProductItems().should('have.length.at.least', 1);
    });
  }
);
