import { container } from '../../support/utils/inversify/inversify.config';
import { YvesCartPage } from '../../support/pages/yves/cart/yves-cart-page';
import { YvesCheckoutAddressPage } from '../../support/pages/yves/checkout/address/yves-checkout-address-page';
import { YvesCheckoutShipmentPage } from '../../support/pages/yves/checkout/shipment/yves-checkout-shipment-page';
import { YvesCheckoutPaymentPage } from '../../support/pages/yves/checkout/payment/yves-checkout-payment-page';
import { YvesCheckoutSummaryPage } from '../../support/pages/yves/checkout/summary/yves-checkout-summary-page';
import { YvesLoginCustomerScenario } from '../../support/scenarios/yves/yves-login-customer-scenario';

describe('checkout by logged in customer', (): void => {
  let fixtures: CheckoutByLoggedInCustomerFixtures;

  let cartPage: YvesCartPage;
  let checkoutAddressPage: YvesCheckoutAddressPage;
  let checkoutShipmentPage: YvesCheckoutShipmentPage;
  let checkoutPaymentPage: YvesCheckoutPaymentPage;
  let checkoutSummaryPage: YvesCheckoutSummaryPage;
  let loginCustomerScenario: YvesLoginCustomerScenario;

  before((): void => {
    fixtures = Cypress.env('fixtures');

    cartPage = container.get(YvesCartPage);
    checkoutAddressPage = container.get(YvesCheckoutAddressPage);
    checkoutShipmentPage = container.get(YvesCheckoutShipmentPage);
    checkoutPaymentPage = container.get(YvesCheckoutPaymentPage);
    checkoutSummaryPage = container.get(YvesCheckoutSummaryPage);
    loginCustomerScenario = container.get(YvesLoginCustomerScenario);
  });

  beforeEach((): void => {
    cy.resetYvesCookies();
    loginCustomerScenario.execute(fixtures.customer);
  });

  it('should checkout with one concrete product', (): void => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSkus[0]);

    cartPage.startCheckout();
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
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout to multi shipment address', (): void => {
    cy.visit(cartPage.PAGE_URL);

    cartPage.quickAddToCart(fixtures.concreteProductSkus[0], 2);
    cartPage.quickAddToCart(fixtures.concreteProductSkus[1], 2);

    cartPage.startCheckout();
    checkoutAddressPage.fillMultiShippingAddress();
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
