import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { SplitDeliveryDynamicFixtures, SplitDeliveryStaticFixtures } from '@interfaces/yves';
import { CheckoutSummaryPage, CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario, ProductAddToCartScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('split delivery', { tags: ['@yves', '@checkout', 'checkout', 'shipment', 'spryker-core'] }, (): void => {
  const customerLoginScenario = container.get(CustomerLoginScenario);
  const productAddToCartScenario = container.get(ProductAddToCartScenario);
  const checkoutScenario = container.get(CheckoutScenario);
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const orderDetailsPage = container.get(OrderDetailsPage);
  const checkoutSummaryPage = container.get(CheckoutSummaryPage);
  const userLoginScenario = container.get(UserLoginScenario);
  const salesIndexPage = container.get(SalesIndexPage);
  const salesDetailPage = container.get(SalesDetailPage);

  let staticFixtures: SplitDeliveryStaticFixtures;
  let dynamicFixtures: SplitDeliveryDynamicFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('should create one shipment per delivery address when the cart is split', (): void => {
    // Arrange
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    productAddToCartScenario.execute({ sku: dynamicFixtures.product1.sku });
    productAddToCartScenario.execute({ sku: dynamicFixtures.product2.sku });
    productAddToCartScenario.execute({ sku: dynamicFixtures.product3.sku });

    // Act
    // Each item gets its own generated delivery address, which is what splits the order.
    checkoutScenario.execute({
      isMultiShipment: true,
      shouldTriggerOmsInCli: true,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });

    customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
      timeout: 15000,
    });

    // Assert
    customerOverviewPage.viewLastPlacedOrder();
    orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      salesIndexPage.visit();
      salesIndexPage.viewByReference(orderReference);

      salesDetailPage.getOrderItemTables().should('have.length', staticFixtures.expectedShipmentCount);
    });
  });
  // Guest checkout is not offered by the B2B storefronts, so the guest half of this journey can only
  // run where a guest may reach the cart at all.
  const guestIt = ['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it;

  guestIt('guest should checkout with a distinct delivery address per item', (): void => {
    // Arrange
    // No login, and no seeded quote: a guest cart has to be built from the storefront.
    productAddToCartScenario.execute({ sku: dynamicFixtures.product1.sku });
    productAddToCartScenario.execute({ sku: dynamicFixtures.product2.sku });
    productAddToCartScenario.execute({ sku: dynamicFixtures.product3.sku });

    // Act
    // fillMultiShippingAddress generates a fresh address per address item, so the three items
    // are what produce three different delivery addresses.
    checkoutScenario.execute({
      isGuest: true,
      isMultiShipment: true,
      shouldTriggerOmsInCli: true,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });

    customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
      timeout: 15000,
    });

    // Assert
    checkoutSummaryPage.getPlacedOrderReference().then((orderReference: string) => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      salesIndexPage.visit();
      salesIndexPage.viewByReference(orderReference);

      salesDetailPage.getOrderItemTables().should('have.length', staticFixtures.expectedShipmentCount);
      salesDetailPage
        .getShipmentDeliveryAddresses()
        .should('have.length', staticFixtures.expectedShipmentCount)
        .then(($addresses: JQuery<HTMLElement>) => {
          const addresses = $addresses.toArray().map((element: HTMLElement) => element.innerText.trim());

          expect(new Set(addresses).size, 'each shipment carries its own delivery address').to.equal(
            staticFixtures.expectedShipmentCount
          );
        });
    });
  });
});
