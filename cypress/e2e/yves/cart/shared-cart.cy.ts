import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { CartPage, CustomerOverviewPage, MultiCartPage, OrderDetailsPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario, CustomerLogoutScenario } from '@scenarios/yves';
import { SharedCartDynamicFixtures, SharedCartStaticFixtures } from '@interfaces/yves';

describe(
  'shared cart',
  {
    tags: [
      '@yves',
      '@cart',
      'cart',
      'shared-carts',
      'multiple-carts',
      'persistent-cart-sharing',
      'checkout',
      'spryker-core',
    ],
  },
  (): void => {
    // Sharing a cart is a multiple-carts feature, which the B2C storefronts do not carry.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C storefronts have no shared carts', (): void => {});

      return;
    }

    const cartPage = container.get(CartPage);
    const multiCartPage = container.get(MultiCartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerLogoutScenario = container.get(CustomerLogoutScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let dynamicFixtures: SharedCartDynamicFixtures;
    let staticFixtures: SharedCartStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a cart shared with a colleague at full access when the colleague orders it then the order is placed and keeps the merchant relation', (): void => {
      // Arrange
      // The share form lists colleagues last name first, which is not the order the account pages use.
      const receiverName = `${dynamicFixtures.receiverCustomer.last_name} ${dynamicFixtures.receiverCustomer.first_name}`;
      const cartName = dynamicFixtures.colleagueSharedQuote.name;

      customerLoginScenario.execute({
        email: dynamicFixtures.ownerCustomer.email,
        password: staticFixtures.defaultPassword,
      });

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
      // contains() rather than contain.text: the B2B themes break the line between the label and the
      // merchant link, which only contains() reads as one space.
      cartPage
        .getProductCartItems()
        .contains(`${staticFixtures.soldByText} ${dynamicFixtures.merchant.name}`)
        .should('exist');

      // Full access is only real if the colleague can order the cart, not merely look at it.
      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.receiverAddress.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
        isMultiShipment: Cypress.env('ENV_IS_SSP_ENABLED') ? true : false,
      });

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage
        .getOrderDetailTableBlock()
        .contains(`${staticFixtures.soldByText} ${dynamicFixtures.merchant.name}`)
        .should('exist');
    });

    it('given a cart shared by external link when an anonymous visitor opens it then the cart is shown as a read-only preview', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.ownerCustomer.email,
        password: staticFixtures.defaultPassword,
      });
      multiCartPage.visit();
      multiCartPage.selectCart({ name: dynamicFixtures.linkSharedQuote.name });
      cartPage.visit();

      // Act
      cartPage.getExternalCartShareLink().then((externalCartShareLink: string) => {
        // The point of the external link is that it works for someone who is not signed in.
        customerLogoutScenario.execute();
        cy.visit(externalCartShareLink);

        // Assert
        cartPage.assertBodyContainsText(
          `${staticFixtures.cartPreviewTitlePrefix} ${dynamicFixtures.linkSharedQuote.name}`
        );
        cartPage.assertBodyContainsText(dynamicFixtures.product.sku);
      });
    });
  }
);
