import {container} from '../../../support/utils/inversify/inversify.config';
import {
  CheckoutByLoggedInCustomerDynamicFixtures,
  CheckoutByLoggedInCustomerStaticFixtures
} from "../../../support/types/yves/checkout";
import {
  CartPage,
  CheckoutAddressPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage
} from "../../../support/pages/yves";
import {CustomerLoginScenario} from "../../../support/scenarios/yves";

describe('checkout by logged in customer', {tags: ['@checkout']}, (): void => {
  const cartPage: CartPage = container.get(CartPage);
  const checkoutAddressPage: CheckoutAddressPage = container.get(CheckoutAddressPage);
  const checkoutShipmentPage: CheckoutShipmentPage = container.get(CheckoutShipmentPage);
  const checkoutPaymentPage: CheckoutPaymentPage = container.get(CheckoutPaymentPage);
  const checkoutSummaryPage: CheckoutSummaryPage = container.get(CheckoutSummaryPage);
  const loginCustomerScenario: CustomerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: CheckoutByLoggedInCustomerStaticFixtures;
  let dynamicFixtures: CheckoutByLoggedInCustomerDynamicFixtures;

  before((): void => {
    cy.resetYvesCookies();
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.customer.password);
    cartPage.visit();
    cartPage.quickAddToCart(dynamicFixtures.productOne.sku);
  });

  it('should checkout with one concrete product', (): void => {
    completeCustomerCheckoutProcessWithSingleShipment();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with two concrete products to single shipment', (): void => {
    cartPage.quickAddToCart(dynamicFixtures.productTwo.sku, 2);
    completeCustomerCheckoutProcessWithSingleShipment();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout to multi shipment address', { tags: ['@smoke'] }, (): void => {
    cartPage.quickAddToCart(dynamicFixtures.productTwo.sku, 2);

    cartPage.startCheckout();
    checkoutAddressPage.fillMultiShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with strict checkout step redirects', (): void => {
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

  const completeCustomerCheckoutProcessWithSingleShipment = () => {
    cartPage.startCheckout();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();
  }
});
