import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { SplitDeliveryDynamicFixtures, SplitDeliveryStaticFixtures } from '@interfaces/yves';
import { CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario, ProductAddToCartScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('split delivery', { tags: ['@yves', '@checkout', 'checkout', 'shipment', 'spryker-core'] }, (): void => {
  const customerLoginScenario = container.get(CustomerLoginScenario);
  const productAddToCartScenario = container.get(ProductAddToCartScenario);
  const checkoutScenario = container.get(CheckoutScenario);
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const orderDetailsPage = container.get(OrderDetailsPage);
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
});
