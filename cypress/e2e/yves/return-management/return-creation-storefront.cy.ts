import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { ReturnCreationStorefrontDynamicFixtures, ReturnCreationStorefrontStaticFixtures } from '@interfaces/yves';
import { CustomerOverviewPage, OrderDetailsPage, ReturnCreatePage, ReturnViewPage } from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'return creation storefront',
  {
    tags: [
      '@yves',
      '@return-management',
      'return-management',
      'marketplace-return-management',
      'order-management',
      'state-machine',
      'spryker-core',
    ],
  },
  (): void => {
    // The marketplace payment process ships by merchant, so the back office offers no manual Ship
    // event to bring the order to a returnable state.
    if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the marketplace payment process has no manual ship event', () => {});

      return;
    }

    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const returnCreatePage = container.get(ReturnCreatePage);
    const returnViewPage = container.get(ReturnViewPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: ReturnCreationStorefrontStaticFixtures;
    let dynamicFixtures: ReturnCreationStorefrontDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a shipped order of three items when the customer returns two of them then only those move to waiting for return', (): void => {
      // Arrange
      placeCustomerOrder();
      driveOrderToShipped();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      customerOverviewPage.viewLastPlacedOrder();

      // Act
      orderDetailsPage.createReturn();
      returnCreatePage.assertPageLocation();
      returnCreatePage.selectItem(dynamicFixtures.firstReturnedProduct.sku);
      returnCreatePage.selectItem(dynamicFixtures.secondReturnedProduct.sku);
      returnCreatePage.submit();

      // Assert
      returnViewPage.assertPageLocation();
      returnViewPage.assertBodyContainsText(staticFixtures.returnDetailsTitle);
      returnViewPage.getBody().should('contain', dynamicFixtures.firstReturnedProduct.sku);
      returnViewPage.getBody().should('contain', dynamicFixtures.secondReturnedProduct.sku);
      returnViewPage.getBody().should('not.contain', dynamicFixtures.keptProduct.sku);

      // Creating the return fires `start-return`, which is not a manual event: the returned items
      // leave `shipped` on their own, and the item left out of the return stays where it was.
      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.getOrderDetailTableBlock().should('contain', staticFixtures.waitingForReturnState);
      orderDetailsPage.getOrderDetailTableBlock().should('contain', staticFixtures.shippedState);
    });

    function placeCustomerOrder(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
        shouldTriggerOmsInCli: true,
      });
    }

    // `start-return` is offered from the shipped and delivered states only, so the order has to walk
    // the happy path first; every event on the way is manual, and the marketplace process ships by
    // merchant right from `skip picking`, so each shop lists its own events.
    function driveOrderToShipped(): void {
      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        salesIndexPage.visit();
        salesIndexPage.viewByReference(orderReference.trim());

        staticFixtures.orderShippingEvents.forEach((event) => salesDetailPage.triggerOms(event));
      });
    }
  }
);
