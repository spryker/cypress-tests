import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { ClickAndCollectDynamicFixtures, ClickAndCollectStaticFixtures } from '@interfaces/yves';
import {
  CartPage,
  CheckoutAddressPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage,
  CustomerOverviewPage,
} from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'click and collect',
  {
    tags: [
      '@yves',
      '@checkout',
      'checkout',
      'cart',
      'marketplace-product-offer',
      'product-offer-shipment',
      'spryker-core',
    ],
  },
  (): void => {
    // Only the suite picks the shipment type and service point on the address step. The marketplace
    // B2B shop hides the shipment type choices there and takes them from the product page instead;
    // the other shops have no service point finder at all.
    if (!['suite'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because only suite chooses the pickup service point on the address step', () => {});

      return;
    }

    const cartPage = container.get(CartPage);
    const checkoutAddressPage = container.get(CheckoutAddressPage);
    const checkoutShipmentPage = container.get(CheckoutShipmentPage);
    const checkoutPaymentPage = container.get(CheckoutPaymentPage);
    const checkoutSummaryPage = container.get(CheckoutSummaryPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ClickAndCollectStaticFixtures;
    let dynamicFixtures: ClickAndCollectDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      // This drives the checkout steps itself rather than going through CheckoutScenario, so it
      // repeats that scenario's recurring-order stub: without it the summary form is re-rendered
      // and submit stays disabled.
      cy.intercept('POST', '**/recurring-order/clear', { statusCode: 200, body: '' });
    });

    it('given an offer collected at a service point when the order is placed then it ships to the service point as a single pickup shipment', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      cartPage.visit();
      cartPage.assertBodyContainsText(dynamicFixtures.product1.sku);

      // Act
      // A single-item cart gets the single-shipment address form, not the multi-shipment one, so
      // the shipment type and the service point are chosen directly on it.
      cartPage.startCheckout();

      checkoutAddressPage.selectPickupAtServicePoint({
        shipmentTypeKey: staticFixtures.pickupShipmentTypeKey,
        servicePointName: dynamicFixtures.servicePoint.name,
      });
      // Pickup does not offer billing-same-as-shipping - there is no shipping address to
      // mirror, the goods go to the store - so a billing address has to be entered.
      checkoutAddressPage.typeBillingAddress(staticFixtures.billingAddress);
      checkoutAddressPage.submitAddressStep();

      // A pickup group is offered only the shipment methods of the pickup shipment type, and the
      // fixture brings its own so that every shop has one to choose.
      checkoutShipmentPage.setShippingMethod(dynamicFixtures.pickupShipmentMethod.name);
      checkoutPaymentPage.setPaymentMethod(getPaymentMethodBasedOnEnv());
      checkoutSummaryPage.placeOrder();

      cy.url({ timeout: 15000 }).should('not.include', '/checkout/summary');

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });

      checkoutSummaryPage.getPlacedOrderReference().then((orderReference: string) => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });
        salesIndexPage.visit();
        salesIndexPage.viewByReference(orderReference);

        // Collecting at one service point is one shipment, and it ships to that point's address
        // rather than to any address of the customer's.
        salesDetailPage.getOrderItemTables().should('have.length', staticFixtures.expectedShipmentCount);
        salesDetailPage.getShipmentDeliveryAddresses().should('contain', dynamicFixtures.servicePointAddress.address1);
        salesDetailPage.getShipmentShippingMethods().should('contain', dynamicFixtures.pickupShipmentMethod.name);
      });
    });
  }
);
