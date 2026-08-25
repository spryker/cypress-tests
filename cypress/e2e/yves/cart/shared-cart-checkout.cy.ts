import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { CartPage, CatalogPage, CustomerOverviewPage, MultiCartPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { SharedCartCheckoutDynamicFixtures, SharedCartCheckoutStaticFixtures } from '@interfaces/yves';

describe(
  'shared cart checkout',
  {
    tags: ['@yves', '@cart', 'cart', 'shared-carts', 'multiple-carts', 'persistent-cart-sharing', 'checkout'],
  },
  (): void => {
    // Sharing a cart is a multiple-carts feature, which the B2C storefronts do not carry.
    if (!['suite', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C storefronts have no shared carts', (): void => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const cartPage = container.get(CartPage);
    const multiCartPage = container.get(MultiCartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let dynamicFixtures: SharedCartCheckoutDynamicFixtures;
    let staticFixtures: SharedCartCheckoutStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a cart shared with a colleague at full access when the colleague orders it then the order is placed and keeps the merchant relation', (): void => {
      // Arrange
      // The share form lists colleagues last name first, which is not the order the account pages use.
      const receiverName = `${dynamicFixtures.receiverCustomer.last_name} ${dynamicFixtures.receiverCustomer.first_name}`;

      customerLoginScenario.execute({
        email: dynamicFixtures.ownerCustomer.email,
        password: staticFixtures.defaultPassword,
      });

      const cartName = multiCartPage.createCart();
      multiCartPage.visit();
      multiCartPage.getCartRow(cartName).should('contain.text', staticFixtures.ownerAccessText);

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.addToCart();

      // Act
      multiCartPage.visit();
      multiCartPage.openShareCartPage(cartName);
      multiCartPage.shareCartWithCompanyUser({ name: receiverName, accessLevel: staticFixtures.fullAccessText });

      // Assert
      customerLoginScenario.execute({
        email: dynamicFixtures.receiverCustomer.email,
        password: staticFixtures.defaultPassword,
      });

      multiCartPage.visit();
      multiCartPage.getCartRow(cartName).should('contain.text', staticFixtures.fullAccessText);

      multiCartPage.selectCart({ name: cartName });
      cartPage.visit();
      cartPage
        .getProductCartItems()
        .should('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant.name}`);

      // Full access is only real if the colleague can order the cart, not merely look at it.
      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.receiverAddress.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage
        .getOrderDetailTableBlock()
        .should('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant.name}`);
    });
  }
);
