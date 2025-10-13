import { container } from '@utils';
import { OrderAmendmentCancelDynamicFixtures, OrderAmendmentStaticFixtures } from '@interfaces/yves';
import { CartPage, CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

/**
 * Order Amendment checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4545871873/Initialisation+Order+Amendment+Process}
 */
describe(
  'order amendment cancel',
  {
    tags: [
      '@yves',
      '@order-amendment',
      'product',
      'marketplace-product',
      'marketplace-merchant-portal-product-management',
      'order-management',
      'marketplace-order-management',
      'state-machine',
      'order-amendment',
      'non-splittable-products',
      'cart',
      'checkout',
      'spryker-core',
    ],
  },
  (): void => {
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const cartPage = container.get(CartPage);

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: OrderAmendmentStaticFixtures;
    let dynamicFixtures: OrderAmendmentCancelDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should be able to cancel order amendment', (): void => {
      placeCustomerOrder();
      customerOverviewPage.viewLastPlacedOrder();

      orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
        orderDetailsPage.editOrder();
        cartPage.assertCartName(isB2c() ? 'In Your Cart' : `Editing Order ${orderReference}`);

        cartPage.assertCancelOrderAmendmentButton();
        cartPage.cancelOrderAmendment();

        cartPage.visit();
        cartPage.assertCartName(isB2c() ? 'Cart' : 'Shopping cart');

        customerOverviewPage.viewLastPlacedOrder();
        orderDetailsPage.containsOrderState('New');
      });
    });

    function placeCustomerOrder(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        shouldTriggerOmsInCli: true,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });
    }

    function getPaymentMethodBasedOnEnv(): string {
      return ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
        ? 'dummyMarketplacePaymentInvoice'
        : 'dummyPaymentInvoice';
    }

    function isB2c(): boolean {
      return ['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'));
    }
  }
);
