import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { MultiMerchantOrderDynamicFixtures, MultiMerchantOrderStaticFixtures } from '@interfaces/yves';
import { CartPage, CheckoutSummaryPage, CustomerOverviewPage } from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'multi merchant order',
  {
    tags: [
      '@yves',
      '@checkout',
      'checkout',
      'cart',
      'marketplace-product-offer',
      'product-offer-shipment',
      'marketplace-order-management',
      'spryker-core',
    ],
  },
  (): void => {
    // Product offers belong to the marketplace storefronts; the plain B2B and B2C shops have none.
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

    let staticFixtures: MultiMerchantOrderStaticFixtures;
    let dynamicFixtures: MultiMerchantOrderDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a cart holding the main merchant product and an offer from each of two merchants when the order is placed then it is split into one shipment per merchant', (): void => {
      // Arrange
      // The cart is arranged through the storefront API, not the UI, and before the browser
      // session exists so that logging in picks up the filled cart. Quick-add by SKU puts the
      // plain product in the cart, so every item would belong to the main merchant and there
      // would be nothing to split, and the product detail page - the only UI that can pick a
      // merchant's offer - is reachable only through catalog search, which this stack cannot
      // serve. Only the API can put a named offer on an item, and the offer is the premise of
      // this journey rather than its subject: what is under test is the split and the checkout.
      cy.getCustomerAccessToken(dynamicFixtures.customer.email, staticFixtures.defaultPassword).then(
        (accessToken: string) => {
          // The API runs before any browser session exists, so the customer has no cart yet and
          // one has to be created. POST /carts requires a name.
          cy.createCart(accessToken, {
            name: 'cypress-multi-merchant-cart',
            priceMode: 'GROSS_MODE',
            currency: 'EUR',
            store: 'DE',
          }).then((cartId: string) => {
            cy.addCartItem(accessToken, cartId, { sku: dynamicFixtures.product1.sku, quantity: 1 });
            cy.addCartItem(accessToken, cartId, {
              sku: dynamicFixtures.product2.sku,
              quantity: 1,
              productOfferReference: dynamicFixtures.productOffer1.product_offer_reference,
            });
            cy.addCartItem(accessToken, cartId, {
              sku: dynamicFixtures.product3.sku,
              quantity: 1,
              productOfferReference: dynamicFixtures.productOffer2.product_offer_reference,
            });
          });
        }
      );

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      // Assert
      // The cart names the merchant behind every offer, which is what the split is derived from.
      cartPage.visit();
      cartPage.assertBodyContainsText(`${staticFixtures.soldByText} ${dynamicFixtures.merchant1.name}`);
      cartPage.assertBodyContainsText(`${staticFixtures.soldByText} ${dynamicFixtures.merchant2.name}`);

      // Act
      // No multi-shipment selection: the split here comes from the items' merchants, not from
      // per-item delivery addresses, and setStandardShippingMethod covers every group it produces.
      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        shouldTriggerOmsInCli: true,
        paymentMethod: getPaymentMethodBasedOnEnv(),
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

        salesDetailPage.getOrderItemTables().should('have.length', staticFixtures.expectedShipmentCount);
      });
    });
  }
);
