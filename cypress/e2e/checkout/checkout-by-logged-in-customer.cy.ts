import { CartPage } from '../../support/pages/yves/cart/cart.page';
import { AddressPage } from '../../support/pages/yves/checkout/address/address.page';
import { ShipmentPage } from '../../support/pages/yves/checkout/shipment/shipment.page';
import { PaymentPage } from '../../support/pages/yves/checkout/payment/payment.page';
import { SummaryPage } from '../../support/pages/yves/checkout/summary/summary.page';
import { LoginAsCustomerWithNewCartScenario } from '../../support/scenarios/cart/login-as-customer-with-new-cart.scenario';
import { CheckoutFixture } from '../../support';

describe('checkout by logged in customer', () => {
  const cartPage = new CartPage();
  const addressStepPage = new AddressPage();
  const shipmentStepPage = new ShipmentPage();
  const paymentStepPage = new PaymentPage();
  const summaryStepPage = new SummaryPage();

  beforeEach(() => {
    cy.resetCookies();

    cy.fixture('checkout').then((fixtures: CheckoutFixture) => {
      LoginAsCustomerWithNewCartScenario.execute(fixtures.customer);
    });
  });

  it('should checkout with one concrete product', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('checkout').then((fixtures: CheckoutFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSkus[0]);
    });

    cartPage.startCheckout();
    addressStepPage.fillShippingAddress();
    shipmentStepPage.setStandardShippingMethod();
    paymentStepPage.setDummyPaymentMethod();
    summaryStepPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with two concrete products to single shipment', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('checkout').then((fixtures: CheckoutFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSkus[0], 2);
      cartPage.quickAddToCart(fixtures.concreteProductSkus[1], 2);
    });

    cartPage.startCheckout();
    addressStepPage.fillShippingAddress();
    shipmentStepPage.setStandardShippingMethod();
    paymentStepPage.setDummyPaymentMethod();
    summaryStepPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout to multi shipment address', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('checkout').then((fixtures: CheckoutFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSkus[0], 2);
      cartPage.quickAddToCart(fixtures.concreteProductSkus[1], 2);
    });

    cartPage.startCheckout();
    addressStepPage.fillMultiShippingAddress();
    shipmentStepPage.setStandardShippingMethod();
    paymentStepPage.setDummyPaymentMethod();
    summaryStepPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with strict checkout step redirects', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('checkout').then((fixtures: CheckoutFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSkus[0]);
    });

    cartPage.assertPageLocation();
    cartPage.startCheckout();

    addressStepPage.assertPageLocation();
    addressStepPage.fillShippingAddress();

    shipmentStepPage.assertPageLocation();
    shipmentStepPage.setStandardShippingMethod();

    paymentStepPage.assertPageLocation();
    paymentStepPage.setDummyPaymentMethod();

    summaryStepPage.assertPageLocation();
    summaryStepPage.placeOrder();

    cy.url().should('include', '/checkout/success');
  });
});
