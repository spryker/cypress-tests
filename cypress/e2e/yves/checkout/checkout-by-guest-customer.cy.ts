import { container } from '../../../support/utils/inversify/inversify.config';
import {CheckoutByGuestCustomerDynamicFixtures} from "../../../support/types/yves/checkout";
import {
  CartPage,
  CheckoutAddressPage,
  CheckoutCustomerPage, CheckoutPaymentPage,
  CheckoutShipmentPage, CheckoutSummaryPage
} from "../../../support/pages/yves";

describe('checkout by guest customer', {tags: ['@checkout']}, (): void => {
  const cartPage: CartPage = container.get(CartPage);
  const checkoutCustomerPage: CheckoutCustomerPage = container.get(CheckoutCustomerPage);
  const checkoutAddressPage: CheckoutAddressPage = container.get(CheckoutAddressPage);
  const checkoutShipmentPage: CheckoutShipmentPage = container.get(CheckoutShipmentPage);
  const checkoutPaymentPage: CheckoutPaymentPage = container.get(CheckoutPaymentPage);
  const checkoutSummaryPage: CheckoutSummaryPage = container.get(CheckoutSummaryPage);

  let dynamicFixtures: CheckoutByGuestCustomerDynamicFixtures;

  before((): void => {
    cy.resetYvesCookies();
    dynamicFixtures = Cypress.env('dynamicFixtures');
  });

  beforeEach((): void => {
    cartPage.visit();
    cartPage.quickAddToCart(dynamicFixtures.productOne.sku, 2);
  });

  it('should checkout with one concrete product', (): void => {
    cartPage.quickAddToCart(dynamicFixtures.productOne.sku);
    completeGuestCheckoutProcess();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with two concrete products to single shipment', (): void => {
    cartPage.quickAddToCart(dynamicFixtures.productTwo.sku, 2);
    completeGuestCheckoutProcess();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout to multi shipment address', { tags: ['@smoke'] }, (): void => {
    cartPage.quickAddToCart(dynamicFixtures.productTwo.sku, 2);
    completeGuestCheckoutProcess();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout with strict checkout step redirects', (): void => {
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

  const completeGuestCheckoutProcess = () => {
    cartPage.startCheckout();
    checkoutCustomerPage.checkoutAsGuest();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();
  }
});
