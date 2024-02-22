import { container } from '../../../../support/utils/inversify/inversify.config';
import {CreateOrderByGuestDynamicFixtures} from "../../../../support/types/yves/order-managment/order";
import {
  CartPage,
  CheckoutAddressPage, CheckoutCustomerPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage, CheckoutSummaryPage
} from "../../../../support/pages/yves";

describe('create order by guest', (): void => {
  let dynamicFixtures: CreateOrderByGuestDynamicFixtures;
  let cartPage: CartPage;
  let checkoutCustomerPage: CheckoutCustomerPage;
  let checkoutAddressPage: CheckoutAddressPage;
  let checkoutShipmentPage: CheckoutShipmentPage;
  let checkoutPaymentPage: CheckoutPaymentPage;
  let checkoutSummaryPage: CheckoutSummaryPage;

  before((): void => {
    cy.resetYvesCookies();
    dynamicFixtures = Cypress.env('dynamicFixtures');
    cartPage = container.get(CartPage);
    checkoutCustomerPage = container.get(CheckoutCustomerPage);
    checkoutAddressPage = container.get(CheckoutAddressPage);
    checkoutShipmentPage = container.get(CheckoutShipmentPage);
    checkoutPaymentPage = container.get(CheckoutPaymentPage);
    checkoutSummaryPage = container.get(CheckoutSummaryPage);
  });

  it('should be able to create an order by guest [@regression]', (): void => {
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
