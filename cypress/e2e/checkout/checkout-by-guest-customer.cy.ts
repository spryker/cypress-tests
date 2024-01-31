import { container } from '../../support/utils/inversify/inversify.config';
import { YvesCartPage } from '../../support/pages/yves/cart/yves-cart-page';
import { YvesCheckoutCustomerPage } from '../../support/pages/yves/checkout/customer/yves-checkout-customer-page';
import { YvesCheckoutAddressPage } from '../../support/pages/yves/checkout/address/yves-checkout-address-page';
import { YvesCheckoutShipmentPage } from '../../support/pages/yves/checkout/shipment/yves-checkout-shipment-page';
import { YvesCheckoutPaymentPage } from '../../support/pages/yves/checkout/payment/yves-checkout-payment-page';
import { YvesCheckoutSummaryPage } from '../../support/pages/yves/checkout/summary/yves-checkout-summary-page';

describe('checkout by guest customer', (): void => {
  const cartPage: YvesCartPage = container.get(YvesCartPage);
  const checkoutCustomerPage: YvesCheckoutCustomerPage = container.get(YvesCheckoutCustomerPage);
  const checkoutAddressPage: YvesCheckoutAddressPage = container.get(YvesCheckoutAddressPage);
  const checkoutShipmentPage: YvesCheckoutShipmentPage = container.get(YvesCheckoutShipmentPage);
  const checkoutPaymentPage: YvesCheckoutPaymentPage = container.get(YvesCheckoutPaymentPage);
  const checkoutSummaryPage: YvesCheckoutSummaryPage = container.get(YvesCheckoutSummaryPage);

  let fixtures: CheckoutByGuestCustomerFixtures;

  before((): void => {
    fixtures = Cypress.env('fixtures');
  });

  beforeEach((): void => {
    cy.resetYvesCookies();
  });

  it('should checkout with one concrete product', (): void => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSkus[0]);

    cartPage.startCheckout();
    checkoutCustomerPage.checkoutAsGuest();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with two concrete products to single shipment', (): void => {
    cy.visit(cartPage.PAGE_URL);

    cartPage.quickAddToCart(fixtures.concreteProductSkus[0], 2);
    cartPage.quickAddToCart(fixtures.concreteProductSkus[1], 2);

    cartPage.startCheckout();
    checkoutCustomerPage.checkoutAsGuest();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout to multi shipment address', { tags: ['@smoke'] }, (): void => {
    cy.visit(cartPage.PAGE_URL);

    cartPage.quickAddToCart(fixtures.concreteProductSkus[0], 2);
    cartPage.quickAddToCart(fixtures.concreteProductSkus[1], 2);

    cartPage.startCheckout();
    checkoutCustomerPage.checkoutAsGuest();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with strict checkout step redirects', (): void => {
    cy.visit(cartPage.PAGE_URL);

    cartPage.quickAddToCart(fixtures.concreteProductSkus[0]);

    cartPage.assertPageLocation();
    cartPage.startCheckout();

    checkoutCustomerPage.assertPageLocation();
    checkoutCustomerPage.checkoutAsGuest();

    checkoutAddressPage.assertPageLocation();
    checkoutAddressPage.fillShippingAddress();

    checkoutShipmentPage.assertPageLocation();
    checkoutShipmentPage.setStandardShippingMethod();

    checkoutPaymentPage.assertPageLocation();
    checkoutPaymentPage.setDummyPaymentMethod();

    checkoutSummaryPage.assertPageLocation();
    checkoutSummaryPage.placeOrder();

    cy.url().should('include', '/checkout/success');
  });
});
