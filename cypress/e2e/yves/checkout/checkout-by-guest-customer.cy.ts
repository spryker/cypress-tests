import { container } from '../../../support/utils/inversify/inversify.config';
import {CheckoutByGuestCustomerDynamicFixtures} from "../../../support/types/yves/checkout";
import {
  YvesCartPage,
  YvesCheckoutAddressPage,
  YvesCheckoutCustomerPage, YvesCheckoutPaymentPage,
  YvesCheckoutShipmentPage, YvesCheckoutSummaryPage
} from "../../../support/pages/yves";


describe('checkout by guest customer', (): void => {
  let dynamicFixtures: CheckoutByGuestCustomerDynamicFixtures;
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

  it('should checkout with one concrete product', (): void => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(dynamicFixtures.productOne.sku);

    cartPage.startCheckout();
    checkoutCustomerPage.checkoutAsGuest();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with two concrete products to single shipment [@regression]', (): void => {
    cy.visit(cartPage.PAGE_URL);

    cartPage.quickAddToCart(dynamicFixtures.productOne.sku, 2);
    cartPage.quickAddToCart(dynamicFixtures.productTwo.sku, 2);

    cartPage.startCheckout();
    checkoutCustomerPage.checkoutAsGuest();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout to multi shipment address [@regression]', (): void => {
    cy.visit(cartPage.PAGE_URL);

    cartPage.quickAddToCart(dynamicFixtures.productOne.sku, 2);
    cartPage.quickAddToCart(dynamicFixtures.productTwo.sku, 2);

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

    cartPage.quickAddToCart(dynamicFixtures.productOne.sku);

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
