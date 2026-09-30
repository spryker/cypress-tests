import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { AvailabilityCalculationDynamicFixtures, AvailabilityCalculationStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario, ProductAddToCartScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

// `cancel` is a manual event on every cancellable state, so nothing fires it on its own — the back
// office has to trigger it. `grace period started`, where a fresh order sits, is reserved, which is
// what takes the ordered quantity out of availability until the order leaves that state.
const CANCEL_OMS_STATE = 'Cancel';

// Every add puts a single item in the cart, and a refused quantity change leaves the line on it.
const QUANTITY_IN_CART = 1;

describe(
  'availability calculation',
  {
    tags: ['@yves', 'availability', 'product', 'cart', 'checkout', 'state-machine', 'spryker-core'],
  },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const productAddToCartScenario = container.get(ProductAddToCartScenario);

    let staticFixtures: AvailabilityCalculationStaticFixtures;
    let dynamicFixtures: AvailabilityCalculationDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a product with a limited stock when part of it is ordered and that order is then cancelled then availability falls and is restored with it', (): void => {
      // Arrange
      const remainingAfterOrder = staticFixtures.initialStock - staticFixtures.orderedQuantity;

      loginAsCustomer();
      putOneInCart();

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
      // The order reserves what it took, so raising the line to the full stock is refused and the
      // line keeps the quantity it already had. Read through the cart's own quantity field: the
      // detail page caps an over-availability quantity silently.
      putOneInCart();
      cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: staticFixtures.initialStock });
      cartPage.assertBodyContainsText(`only has availability of ${remainingAfterOrder}`);
      cartPage
        .getCartItemChangeQuantityField(dynamicFixtures.product.sku)
        .should('have.value', String(QUANTITY_IN_CART));

      // Act
      cancelLastOrderInBackoffice();

      // Assert
      // Cancelled is not a reserved state, so the whole stock is available again and the quantity
      // that was just capped now holds.
      loginAsCustomer();
      putOneInCart();
      cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: staticFixtures.initialStock });
      cartPage
        .getCartItemChangeQuantityField(dynamicFixtures.product.sku)
        .should('have.value', String(staticFixtures.initialStock));
    });

    function loginAsCustomer(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    }

    // The add itself goes through the cart's quick-add form, which is what leaves the checkout with
    // an address step it can drive. Quick-add resolves the sku against the suggestion index and does
    // not wait for it, so the product is confirmed to be offered there first.
    function putOneInCart(): void {
      // Emptied first: the storefront adds each add-to-cart as its own line rather than incrementing
      // an existing one, so a leftover line would make the quantity field ambiguous.
      cartPage.visit();
      cartPage.clearCartIfNotEmpty();

      catalogPage.visit();
      catalogPage.searchSuggestionsFor({ query: dynamicFixtures.product.sku });
      catalogPage.getSuggestedProducts().should('exist');

      productAddToCartScenario.execute({ sku: dynamicFixtures.product.sku });

      cartPage.visit();
      cartPage.getProductCartItems().should('contain.text', dynamicFixtures.product.sku);
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
