import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { CartApprovalProcessDynamicFixtures, CartApprovalProcessStaticFixtures } from '@interfaces/yves';
import {
  CartPage,
  CheckoutAddressPage,
  MultiCartPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage,
  OrderPage,
} from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'cart approval process',
  { tags: ['@yves', '@checkout', 'checkout', 'cart', 'company-account', 'quote-approval', 'spryker-core'] },
  (): void => {
    // The approval process belongs to company accounts, which the B2C storefronts do not have.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C storefronts have no company accounts', () => {});

      return;
    }

    const cartPage = container.get(CartPage);
    const multiCartPage = container.get(MultiCartPage);
    const checkoutAddressPage = container.get(CheckoutAddressPage);
    const checkoutShipmentPage = container.get(CheckoutShipmentPage);
    const checkoutPaymentPage = container.get(CheckoutPaymentPage);
    const checkoutSummaryPage = container.get(CheckoutSummaryPage);
    const orderPage = container.get(OrderPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: CartApprovalProcessStaticFixtures;
    let dynamicFixtures: CartApprovalProcessDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a cart above the buyer spend limit when the approver approves the request then the buyer can place the order', (): void => {
      // Arrange
      // withoutSession, because this journey deliberately switches between two customers and a
      // restored session snapshot would carry the previous one's cart and permissions.
      customerLoginScenario.execute({
        email: dynamicFixtures.buyer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
        resetSession: true,
      });
      // Both customers accumulate carts across runs, and a cart waiting for approval is shared
      // rather than made active, so every leg has to pick this run's cart out of the list first.
      multiCartPage.visit();
      multiCartPage.selectCart({ name: dynamicFixtures.quote.name });
      cartPage.visit();
      cartPage.startCheckout();
      checkoutAddressPage.fillShippingAddress({ idCustomerAddress: dynamicFixtures.buyerAddress.id_customer_address });
      checkoutShipmentPage.setStandardShippingMethod();
      checkoutPaymentPage.setPaymentMethod(getPaymentMethodBasedOnEnv());

      // Act
      // The buyer's place-order permission is capped below the cart total, so the summary step
      // offers an approval request instead of letting the order through.
      checkoutSummaryPage.requestApproval(dynamicFixtures.approverCompanyUser.id_company_user);

      // Assert
      checkoutSummaryPage.getApprovalStatus().should('contain', staticFixtures.waitingStatus);
      checkoutSummaryPage.getCancelApprovalRequestButton().should('exist');

      // Act
      // A cart waiting for approval is shared with the approver, but it is not their active cart:
      // it has to be picked out of the shared list first, or the approver checks out an empty one.
      customerLoginScenario.execute({
        email: dynamicFixtures.approver.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
        resetSession: true,
      });
      multiCartPage.visit();
      multiCartPage.selectCart({ name: dynamicFixtures.quote.name });
      cartPage.visit();
      // The cart is locked while it waits, which is what the reset-lock form on it marks.
      cartPage.getLockedCartResetForm().should('exist');
      cartPage.approveCart();

      // Assert
      cartPage.getApprovalStatus().should('contain', staticFixtures.approvedStatus);

      // Act
      customerLoginScenario.execute({
        email: dynamicFixtures.buyer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
        resetSession: true,
      });
      multiCartPage.visit();
      multiCartPage.selectCart({ name: dynamicFixtures.quote.name });
      cartPage.visit();
      cartPage.startCheckout();
      checkoutSummaryPage.placeOrder();

      // Assert
      checkoutSummaryPage.getPlacedOrderReference().then((orderReference: string) => {
        orderPage.visit();
        orderPage.getOrderHistoryRow(orderReference).should('exist');
      });
    });
  }
);
