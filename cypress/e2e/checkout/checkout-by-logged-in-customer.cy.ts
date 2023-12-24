import { Page as CheckoutAddressPage } from '../../support/pages/yves/checkout/address/page';
import { Page as CheckoutShipmentPage } from '../../support/pages/yves/checkout/shipment/page';
import { Page as CheckoutPaymentPage } from '../../support/pages/yves/checkout/payment/page';
import { Page as CheckoutSummaryPage } from '../../support/pages/yves/checkout/summary/page';
import { Page as CartPage } from '../../support/pages/yves/cart/page';
import { LoginCustomerScenario } from '../../support/scenarios/login-customer-scenario';
import { container } from '../../support/utils/inversify/inversify.config';

describe('checkout by logged in customer', (): void => {
  let fixtures: CheckoutByLoggedInCustomerFixtures;

  let cartPage: CartPage;
  let checkoutAddressPage: CheckoutAddressPage;
  let checkoutShipmentPage: CheckoutShipmentPage;
  let checkoutPaymentPage: CheckoutPaymentPage;
  let checkoutSummaryPage: CheckoutSummaryPage;
  let loginCustomerScenario: LoginCustomerScenario;

  before((): void => {
    fixtures = Cypress.env('fixtures');

    cartPage = container.get(CartPage);
    checkoutAddressPage = container.get(CheckoutAddressPage);
    checkoutShipmentPage = container.get(CheckoutShipmentPage);
    checkoutPaymentPage = container.get(CheckoutPaymentPage);
    checkoutSummaryPage = container.get(CheckoutSummaryPage);
    loginCustomerScenario = container.get(LoginCustomerScenario);
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
