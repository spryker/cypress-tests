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
    let pastedOrder: string;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      // Each product is sold by a merchant of its own, so every destination has to carry both
      // merchants for the quick order to have kept the relation.
      pastedOrder = [
        `${dynamicFixtures.product1.sku},${staticFixtures.firstProductQuantity}`,
        `${dynamicFixtures.product2.sku},${staticFixtures.secondProductQuantity}`,
      ].join('\n');
    });

    it('given a pasted quick order of two products sold by different merchants when it is added to the cart then the cart keeps both merchants', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      quickOrderPage.visit();
      quickOrderPage.verifyPastedOrder(pastedOrder);

      // Act
      quickOrderPage.addRowsToCart();

      // Assert
      cartPage.visit();
      cartPage
        .getProductCartItems()
        .should('contain.text', dynamicFixtures.product1.sku)
        .and('contain.text', dynamicFixtures.product2.sku)
        .and('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant1.name}`)
        .and('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant2.name}`);
    });

    it('given a pasted quick order of two products sold by different merchants when it is added to a shopping list then the list keeps both merchants', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      quickOrderPage.visit();
      quickOrderPage.verifyPastedOrder(pastedOrder);

      // Act
      quickOrderPage.addRowsToShoppingList(dynamicFixtures.shoppingList.name);

      // Assert
      shoppingListPage
        .getShoppingListItemsTable()
        .should('contain.text', dynamicFixtures.product1.sku)
        .and('contain.text', dynamicFixtures.product2.sku)
        .and('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant1.name}`)
        .and('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant2.name}`);
    });

    it('given an order of offers from two merchants when it is reordered then the cart keeps both merchants', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.reorderCustomer.email,
        password: staticFixtures.defaultPassword,
      });
      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.reorderAddress.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // The placed order lists products by name rather than by sku, so the merchant line is what
      // carries the relation through this step.
      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage
        .getOrderDetailTableBlock()
        .should('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant1.name}`)
        .and('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant2.name}`);

      // Act
      orderDetailsPage.reorderAll();

      // Assert
      cartPage.visit();
      cartPage
        .getProductCartItems()
        .should('contain.text', dynamicFixtures.product1.sku)
        .and('contain.text', dynamicFixtures.product2.sku)
        .and('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant1.name}`)
        .and('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant2.name}`);
    });
  }
);
