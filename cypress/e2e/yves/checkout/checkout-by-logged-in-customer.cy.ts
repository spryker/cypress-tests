import {container} from '../../../support/utils/inversify/inversify.config';
import {
  CheckoutByLoggedInCustomerDynamicFixtures,
  CheckoutByLoggedInCustomerStaticFixtures
} from "../../../support/types/yves/checkout";
import {
  YvesCartPage,
  YvesCheckoutAddressPage,
  YvesCheckoutPaymentPage,
  YvesCheckoutShipmentPage,
  YvesCheckoutSummaryPage
} from "../../../support/pages/yves";
import {YvesLoginCustomerScenario} from "../../../support/scenarios/yves";


describe('checkout by logged in customer', (): void => {
  let staticFixtures: CheckoutByLoggedInCustomerStaticFixtures;
  let dynamicFixtures: CheckoutByLoggedInCustomerDynamicFixtures;

  let cartPage: YvesCartPage;
  let checkoutAddressPage: YvesCheckoutAddressPage;
  let checkoutShipmentPage: YvesCheckoutShipmentPage;
  let checkoutPaymentPage: YvesCheckoutPaymentPage;
  let checkoutSummaryPage: YvesCheckoutSummaryPage;
  let loginCustomerScenario: YvesLoginCustomerScenario;

  before((): void => {
    cy.resetYvesCookies();
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    cartPage = container.get(YvesCartPage);
    checkoutAddressPage = container.get(YvesCheckoutAddressPage);
    checkoutShipmentPage = container.get(YvesCheckoutShipmentPage);
    checkoutPaymentPage = container.get(YvesCheckoutPaymentPage);
    checkoutSummaryPage = container.get(YvesCheckoutSummaryPage);
    loginCustomerScenario = container.get(YvesLoginCustomerScenario);
  });

  beforeEach((): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.customer.password);
    cartPage.visit();
  });

  it('should checkout with one concrete product', (): void => {
    cartPage.quickAddToCart(dynamicFixtures.productOne.sku);

    cartPage.startCheckout();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with two concrete products to single shipment', (): void => {
    cartPage.quickAddToCart(dynamicFixtures.productOne.sku, 2);
    cartPage.quickAddToCart(dynamicFixtures.productTwo.sku, 2);

    cartPage.startCheckout();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout to multi shipment address', (): void => {
    cartPage.quickAddToCart(dynamicFixtures.productOne.sku, 2);
    cartPage.quickAddToCart(dynamicFixtures.productTwo.sku, 2);

    cartPage.startCheckout();
    checkoutAddressPage.fillMultiShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with strict checkout step redirects', (): void => {
    cartPage.quickAddToCart(dynamicFixtures.productOne.sku);

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
