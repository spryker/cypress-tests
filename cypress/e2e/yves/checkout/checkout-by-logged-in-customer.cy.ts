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

let staticFixtures: CheckoutByLoggedInCustomerStaticFixtures;
let dynamicFixtures: CheckoutByLoggedInCustomerDynamicFixtures;
let cartPage: CartPage;
let checkoutAddressPage: CheckoutAddressPage;
let checkoutShipmentPage: CheckoutShipmentPage;
let checkoutPaymentPage: CheckoutPaymentPage;
let checkoutSummaryPage: CheckoutSummaryPage;
let loginCustomerScenario: CustomerLoginScenario;

describe('checkout by logged in customer', (): void => {
  before((): void => {
    cy.resetYvesCookies();
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    cartPage = container.get(CartPage);
    checkoutAddressPage = container.get(CheckoutAddressPage);
    checkoutShipmentPage = container.get(CheckoutShipmentPage);
    checkoutPaymentPage = container.get(CheckoutPaymentPage);
    checkoutSummaryPage = container.get(CheckoutSummaryPage);
    loginCustomerScenario = container.get(CustomerLoginScenario);
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

  it('should checkout to multi shipment address', (): void => {
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
});

const completeCustomerCheckoutProcessWithSingleShipment = () => {
  cartPage.startCheckout();
  checkoutAddressPage.fillShippingAddress();
  checkoutShipmentPage.setStandardShippingMethod();
  checkoutPaymentPage.setDummyPaymentMethod();
  checkoutSummaryPage.placeOrder();
}
