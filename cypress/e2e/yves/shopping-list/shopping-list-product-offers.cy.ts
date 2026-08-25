import { container } from '@utils';
import { CartPage, CatalogPage, ProductPage, ShoppingListPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { ShoppingListProductOffersDynamicFixtures, ShoppingListProductOffersStaticFixtures } from '@interfaces/yves';

describe(
  'shopping list product offers',
  {
    tags: [
      '@yves',
      '@shopping-list',
      'shopping-lists',
      'marketplace-shopping-lists',
      'cart',
      'product',
      'marketplace-product',
      'marketplace-product-offer',
    ],
  },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('runs only where a product can carry competing merchant offers on a shopping list', (): void => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const shoppingListPage = container.get(ShoppingListPage);
    const cartPage = container.get(CartPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let dynamicFixtures: ShoppingListProductOffersDynamicFixtures;
    let staticFixtures: ShoppingListProductOffersStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should be able to keep two merchant offers of one product on a shopping list and in the cart', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      shoppingListPage.visit();
      shoppingListPage.createShoppingList(staticFixtures.shoppingListName);

      // The same product is on sale from two merchants, so every step below has to stay tied to the
      // offer it started from rather than to the product.
      const competingOffers = [
        { offer: dynamicFixtures.productOffer1, merchant: dynamicFixtures.merchant1 },
        { offer: dynamicFixtures.productOffer2, merchant: dynamicFixtures.merchant2 },
      ];

      // Act
      competingOffers.forEach(({ offer }): void => {
        catalogPage.visit();
        catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
        productPage.selectSoldByProductOffer({ productOfferReference: offer.product_offer_reference });
        shoppingListPage.getAddToShoppingListProductOfferInput().should('have.value', offer.product_offer_reference);

        shoppingListPage.addDisplayedProductToShoppingList(staticFixtures.shoppingListName);
      });

      // Assert
      shoppingListPage.visit();
      shoppingListPage.openShoppingList(staticFixtures.shoppingListName);

      competingOffers.forEach(({ merchant }): void => {
        shoppingListPage
          .getShoppingListItemsTable()
          .should('contain.text', `${staticFixtures.soldByText} ${merchant.name}`);
      });

      shoppingListPage.addAllAvailableProductsToCart();
      cartPage.visit();

      competingOffers.forEach(({ merchant }): void => {
        cartPage.getProductCartItems().should('contain.text', `${staticFixtures.soldByText} ${merchant.name}`);
      });
    });
  }
);
