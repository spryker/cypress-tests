import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { OrderCancellationDynamicFixtures, OrderCancellationStaticFixtures } from '@interfaces/yves';
import { CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

const ORDER_CANCELLED_MESSAGE = 'Order was canceled successfully.';

const CANCELLED_ITEM_STATE = 'Canceled';

// The back office labels an item's manual events with ucfirst() of the event name, so the
// item-level button reads differently from the order-level one for the same event.
const SKIP_GRACE_PERIOD_ITEM_EVENT = 'Skip grace period';

const PAY_ITEM_EVENT = 'Pay';

describe(
  'order cancellation',
  {
    tags: [
      '@yves',
      '@order-management',
      'order-management',
      'marketplace-order-management',
      'state-machine',
      'spryker-core-back-office',
      'spryker-core',
      'cart',
      'checkout',
    ],
  },
  (): void => {
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: OrderCancellationStaticFixtures;
    let dynamicFixtures: OrderCancellationDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given every item of an order is cancellable when the customer cancels it then the order is cancelled', (): void => {
      // Arrange
      placeCustomerOrder(dynamicFixtures.wholeOrderCustomer.email, dynamicFixtures.wholeOrderAddress);
      customerOverviewPage.viewLastPlacedOrder();

      // Act
      orderDetailsPage.cancelOrder();

      // Assert
      orderDetailsPage.assertBodyContainsText(ORDER_CANCELLED_MESSAGE);
      orderDetailsPage.getOrderDetailTableBlock().contains(CANCELLED_ITEM_STATE).should('exist');
      orderDetailsPage.getCancelOrderButton().should('not.exist');
    });

    it('given one item of an order left the cancellable states when the customer opens it then cancelling is not offered', (): void => {
      // Arrange
      placeCustomerOrder(dynamicFixtures.mixedStateCustomer.email, dynamicFixtures.mixedStateAddress);
      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.getCancelOrderButton().should('exist');

      // Act
      orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
        advanceOrderItemPastCancellableStates(orderReference.trim(), dynamicFixtures.advancedItemProduct.sku);

        customerLoginScenario.execute({
          email: dynamicFixtures.mixedStateCustomer.email,
          password: staticFixtures.defaultPassword,
        });
        customerOverviewPage.viewLastPlacedOrder();

        // Assert
        orderDetailsPage.getCancelOrderButton().should('not.exist');
      });
    });

    function placeCustomerOrder(email: string, address: { id_customer_address: number }): void {
      customerLoginScenario.execute({ email: email, password: staticFixtures.defaultPassword });

      checkoutScenario.execute({
        idCustomerAddress: address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
        shouldTriggerOmsInCli: true,
      });
    }

    // `pay` is the first happy event past the last cancellable state in both the dummy and the
    // marketplace processes, and it is reachable only once the grace period has been skipped.
    // Driving it on one item alone is what leaves the order's other item cancellable.
    function advanceOrderItemPastCancellableStates(orderReference: string, sku: string): void {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.viewByReference(orderReference);

      salesDetailPage.triggerOmsForOrderItem({ sku: sku, state: SKIP_GRACE_PERIOD_ITEM_EVENT });
      salesDetailPage.triggerOmsForOrderItem({ sku: sku, state: PAY_ITEM_EVENT });
    }
  }
);
