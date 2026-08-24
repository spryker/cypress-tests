import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { ClickAndCollectDynamicFixtures, ClickAndCollectStaticFixtures } from '@interfaces/yves';
import { CartPage, CheckoutSummaryPage, CustomerOverviewPage } from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
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
    // Product offers and service points belong to the marketplace storefronts.
    if (['b2b', 'b2c'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the non-marketplace storefronts have no product offers', () => {});

      return;
    }

    const cartPage = container.get(CartPage);
    const checkoutSummaryPage = container.get(CheckoutSummaryPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ClickAndCollectStaticFixtures;
    let dynamicFixtures: ClickAndCollectDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given an offer collected at a service point when the order is placed then it ships to the service point as a single pickup shipment', (): void => {
      // Arrange
      // Through the API and before the browser session exists: only the API can put a named
      // offer on an item, and a cart filled after login is not the one the storefront shows.
      cy.getCustomerAccessToken(dynamicFixtures.customer.email, staticFixtures.defaultPassword).then(
        (accessToken: string) => {
          cy.createCart(accessToken, {
            name: 'cypress-click-and-collect-cart',
            priceMode: 'GROSS_MODE',
            currency: 'EUR',
            store: 'DE',
          }).then((cartId: string) => {
            cy.addCartItem(accessToken, cartId, {
              sku: dynamicFixtures.product1.sku,
              quantity: 1,
              productOfferReference: dynamicFixtures.pickupOffer.product_offer_reference,
            });
          });
        }
      );

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      cartPage.visit();
      cartPage.assertBodyContainsText(dynamicFixtures.product1.sku);

      // Act
      // The service point is chosen on the address step rather than the product page: picking
      // pickup for the item replaces its delivery address with the service point's.
      checkoutScenario.execute({
        isMultiShipment: true,
        paymentMethod: getPaymentMethodBasedOnEnv(),
        servicePointSelection: {
          productName: dynamicFixtures.product1.sku,
          shipmentTypeKey: staticFixtures.pickupShipmentTypeKey,
          servicePointName: dynamicFixtures.servicePoint.name,
        },
      });

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
      });
    });
  }
);
