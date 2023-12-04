import { Page as CheckoutCustomerPage } from '../../support/pages/yves/checkout/customer/page';
import { Page as CheckoutAddressPage } from '../../support/pages/yves/checkout/address/page';
import { Page as CheckoutShipmentPage } from '../../support/pages/yves/checkout/shipment/page';
import { Page as CheckoutPaymentPage } from '../../support/pages/yves/checkout/payment/page';
import { Page as CheckoutSummaryPage } from '../../support/pages/yves/checkout/summary/page';
import { Page as CartPage } from '../../support/pages/yves/cart/page';
import { CheckoutFixture } from '../../support';

describe('checkout by guest customer', () => {
  const cartPage = new CartPage();
  const checkoutCustomerPage = new CheckoutCustomerPage();
  const checkoutAddressPage = new CheckoutAddressPage();
  const checkoutShipmentPage = new CheckoutShipmentPage();
  const checkoutPaymentPage = new CheckoutPaymentPage();
  const checkoutSummaryPage = new CheckoutSummaryPage();

  beforeEach(() => {
    cy.resetCookies();
  });

  it('should checkout with one concrete product', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('checkout').then((fixtures: CheckoutFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSkus[0]);
    });

    cartPage.startCheckout();
    checkoutCustomerPage.checkoutAsGuest();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with two concrete products to single shipment', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('checkout').then((fixtures: CheckoutFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSkus[0], 2);
      cartPage.quickAddToCart(fixtures.concreteProductSkus[1], 2);
    });

    cartPage.startCheckout();
    checkoutCustomerPage.checkoutAsGuest();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout to multi shipment address', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('checkout').then((fixtures: CheckoutFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSkus[0], 2);
      cartPage.quickAddToCart(fixtures.concreteProductSkus[1], 2);
    });

    cartPage.startCheckout();
    checkoutCustomerPage.checkoutAsGuest();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with strict checkout step redirects', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('checkout').then((fixtures: CheckoutFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSkus[0]);
    });

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
