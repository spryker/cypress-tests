import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { CartPage, CustomerOverviewPage, OrderDetailsPage, QuickOrderPage, ShoppingListPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { QuickOrderToCheckoutDynamicFixtures, QuickOrderToCheckoutStaticFixtures } from '@interfaces/yves';

describe(
  'quick order to checkout',
  {
    tags: ['@yves', '@quick-order', 'cart', 'checkout', 'reorder', 'order-management', 'marketplace-product-offer'],
  },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('runs only where quick order can reach products sold by competing merchants', (): void => {});

      return;
    }

    const quickOrderPage = container.get(QuickOrderPage);
    const cartPage = container.get(CartPage);
    const shoppingListPage = container.get(ShoppingListPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let dynamicFixtures: QuickOrderToCheckoutDynamicFixtures;
    let staticFixtures: QuickOrderToCheckoutStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('company user should be able to quick order two merchant products, buy them and reorder them', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      shoppingListPage.visit();
      shoppingListPage.createShoppingList(staticFixtures.shoppingListName);

      // Each product is sold by a merchant of its own, so every destination below has to carry both
      // merchants for the quick order to have kept the relation.
      const orderedProducts = [
        { product: dynamicFixtures.product1, merchant: dynamicFixtures.merchant1 },
        { product: dynamicFixtures.product2, merchant: dynamicFixtures.merchant2 },
      ];
      const pastedOrder = [
        `${dynamicFixtures.product1.sku},${staticFixtures.firstProductQuantity}`,
        `${dynamicFixtures.product2.sku},${staticFixtures.secondProductQuantity}`,
      ].join('\n');

      // Act
      quickOrderPage.visit();
      quickOrderPage.verifyPastedOrder(pastedOrder);
      quickOrderPage.addRowsToCart();

      // Assert
      cartPage.visit();
      assertSkusPresent(cartPage.getProductCartItems());
      assertMerchantsPresent(cartPage.getProductCartItems());

      // The same rows must reach a shopping list just as they reached the cart.
      quickOrderPage.visit();
      quickOrderPage.verifyPastedOrder(pastedOrder);
      quickOrderPage.addRowsToShoppingList(staticFixtures.shoppingListName);
      assertSkusPresent(shoppingListPage.getShoppingListItemsTable());
      assertMerchantsPresent(shoppingListPage.getShoppingListItemsTable());

      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // The placed order lists products by name rather than by sku, so the merchant line is what
      // carries the relation through this step.
      customerOverviewPage.viewLastPlacedOrder();
      assertMerchantsPresent(orderDetailsPage.getOrderDetailTableBlock());

      // Reordering has to reproduce the order, merchants included.
      orderDetailsPage.reorderAll();
      cartPage.visit();
      assertSkusPresent(cartPage.getProductCartItems());
      assertMerchantsPresent(cartPage.getProductCartItems());

      function assertSkusPresent(block: Cypress.Chainable): void {
        orderedProducts.forEach(({ product }): void => {
          block.should('contain.text', product.sku);
        });
      }

      function assertMerchantsPresent(block: Cypress.Chainable): void {
        orderedProducts.forEach(({ merchant }): void => {
          block.should('contain.text', `${staticFixtures.soldByText} ${merchant.name}`);
        });
      }
    });
  }
);
