import { container } from '../../../../support/utils/inversify/inversify.config';
import {CreateOrderByGuestDynamicFixtures} from "../../../../support/types/yves/order-managment/order";
import {
  YvesCartPage,
  YvesCheckoutAddressPage, YvesCheckoutCustomerPage,
  YvesCheckoutPaymentPage,
  YvesCheckoutShipmentPage, YvesCheckoutSummaryPage
} from "../../../../support/pages/yves";

describe('create order by guest', (): void => {
  let dynamicFixtures: CreateOrderByGuestDynamicFixtures;
  let cartPage: YvesCartPage;
  let checkoutCustomerPage: YvesCheckoutCustomerPage;
  let checkoutAddressPage: YvesCheckoutAddressPage;
  let checkoutShipmentPage: YvesCheckoutShipmentPage;
  let checkoutPaymentPage: YvesCheckoutPaymentPage;
  let checkoutSummaryPage: YvesCheckoutSummaryPage;

  before((): void => {
    dynamicFixtures = Cypress.env('dynamicFixtures');
    cartPage = container.get(YvesCartPage);
    checkoutCustomerPage = container.get(YvesCheckoutCustomerPage);
    checkoutAddressPage = container.get(YvesCheckoutAddressPage);
    checkoutShipmentPage = container.get(YvesCheckoutShipmentPage);
    checkoutPaymentPage = container.get(YvesCheckoutPaymentPage);
    checkoutSummaryPage = container.get(YvesCheckoutSummaryPage);
  });

  beforeEach((): void => {
    cy.resetYvesCookies();
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
