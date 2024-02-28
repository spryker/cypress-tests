import { container } from '../../../../support/utils/inversify/inversify.config';
import { CreateOrderByGuestDynamicFixtures } from '../../../../support/types/yves/order-managment/order';
import {
  CartPage,
  CheckoutAddressPage,
  CheckoutCustomerPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage,
} from '../../../../support/pages/yves';

describe('create order by guest', { tags: ['@order-management'] }, (): void => {
  const cartPage: CartPage = container.get(CartPage);
  const checkoutCustomerPage: CheckoutCustomerPage = container.get(CheckoutCustomerPage);
  const checkoutAddressPage: CheckoutAddressPage = container.get(CheckoutAddressPage);
  const checkoutShipmentPage: CheckoutShipmentPage = container.get(CheckoutShipmentPage);
  const checkoutPaymentPage: CheckoutPaymentPage = container.get(CheckoutPaymentPage);
  const checkoutSummaryPage: CheckoutSummaryPage = container.get(CheckoutSummaryPage);

  let dynamicFixtures: CreateOrderByGuestDynamicFixtures;

  before((): void => {
    cy.resetYvesCookies();
    dynamicFixtures = Cypress.env('dynamicFixtures');
  });

  it('should be able to create an order by guest', (): void => {
    cartPage.visit();
    cartPage.quickAddToCart(dynamicFixtures.product.sku, 1);
    cartPage.startCheckout();
    checkoutCustomerPage.checkoutAsGuest();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });
});
