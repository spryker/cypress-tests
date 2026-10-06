import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { OfferAvailabilityDynamicFixtures, OfferAvailabilityStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

// `cancel` is a manual event on every cancellable state, so nothing fires it on its own — the back
// office has to trigger it. `grace period started`, where a fresh order sits, is reserved, which is
// what takes the ordered quantity out of the offer's availability until the order leaves that state.
const CANCEL_OMS_STATE = 'Cancel';

// Every add puts a single item in the cart, and a refused quantity change leaves the line on it.
const QUANTITY_IN_CART = 1;

describe(
  'offer availability',
  {
    tags: [
      '@yves',
      '@product-offer',
      'availability',
      'cart',
      'checkout',
      'state-machine',
      'marketplace-product-offer',
      'product-offer-shipment-availability',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because product offers exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: OfferAvailabilityStaticFixtures;
    let dynamicFixtures: OfferAvailabilityDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given an offer with a limited stock when part of it is ordered and that order is then cancelled then the offer availability falls and is restored with it', (): void => {
      // Arrange
      const remainingAfterOrder = staticFixtures.initialStock - staticFixtures.orderedQuantity;

      loginAsCustomer();
      putOfferInCart();

      // Act
      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
        shouldTriggerOmsInCli: true,
      });
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });

      // Assert
      // The order reserves what it took from the offer's own stock, so raising the line to the full
      // stock is refused and the line keeps the quantity it already had. Read through the cart's
      // quantity field: the detail page caps an over-availability quantity silently.
      putOfferInCart();
      cartPage.changeQuantity({ sku: dynamicFixtures.merchantProduct.sku, quantity: staticFixtures.initialStock });
      cartPage.assertBodyContainsText(`only has availability of ${remainingAfterOrder}`);
      cartPage
        .getCartItemChangeQuantityField(dynamicFixtures.merchantProduct.sku)
        .should('have.value', String(QUANTITY_IN_CART));

      // Act
      cancelLastOrderInBackoffice();

      // Assert
      // Cancelled is not a reserved state, so the offer's whole stock is available again and the
      // quantity that was just capped now holds.
      loginAsCustomer();
      putOfferInCart();
      cartPage.changeQuantity({ sku: dynamicFixtures.merchantProduct.sku, quantity: staticFixtures.initialStock });
      cartPage
        .getCartItemChangeQuantityField(dynamicFixtures.merchantProduct.sku)
        .should('have.value', String(staticFixtures.initialStock));
    });

    function loginAsCustomer(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    }

    // The offer has to be picked in the buy box rather than quick-added, because the availability
    // under test is the offer's own and not the product's.
    function putOfferInCart(): void {
      // Emptied first: the storefront adds each add-to-cart as its own line rather than incrementing
      // an existing one, so a leftover line would make the quantity field ambiguous.
      cartPage.visit();
      cartPage.clearCartIfNotEmpty();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });

      productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.merchant.name);
      productPage.selectSoldByProductOffer({
        productOfferReference: dynamicFixtures.productOffer.product_offer_reference,
      });
      productPage.addToCart();

      cartPage.visit();
      cartPage.getProductCartItems().should('contain.text', dynamicFixtures.merchantProduct.sku);
    }

    function cancelLastOrderInBackoffice(): void {
      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        salesIndexPage.visit();
        salesIndexPage.viewByReference(orderReference.trim());
        salesDetailPage.triggerOms({ state: CANCEL_OMS_STATE, shouldTriggerOmsInCli: true });
      });
    }
  }
);
