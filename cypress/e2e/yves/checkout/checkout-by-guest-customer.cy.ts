import { container } from '../../../support/utils/inversify/inversify.config';
import {CheckoutByGuestCustomerDynamicFixtures} from "../../../support/types/yves/checkout";
import {
  CartPage,
  CheckoutAddressPage,
  CheckoutCustomerPage, CheckoutPaymentPage,
  CheckoutShipmentPage, CheckoutSummaryPage
} from "../../../support/pages/yves";

let cartPage: CartPage;
let checkoutCustomerPage: CheckoutCustomerPage;
let checkoutAddressPage: CheckoutAddressPage;
let checkoutShipmentPage: CheckoutShipmentPage;
let checkoutPaymentPage: CheckoutPaymentPage;
let checkoutSummaryPage: CheckoutSummaryPage;
let dynamicFixtures: CheckoutByGuestCustomerDynamicFixtures;

describe('checkout by guest customer', (): void => {
  before((): void => {
    cy.resetYvesCookies();
    dynamicFixtures = Cypress.env('dynamicFixtures');

    cartPage = container.get(CartPage);
    checkoutCustomerPage = container.get(CheckoutCustomerPage);
    checkoutAddressPage = container.get(CheckoutAddressPage);
    checkoutShipmentPage = container.get(CheckoutShipmentPage);
    checkoutPaymentPage = container.get(CheckoutPaymentPage);
    checkoutSummaryPage = container.get(CheckoutSummaryPage);
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

  it('should checkout with two concrete products to single shipment [@regression]', (): void => {
    cartPage.quickAddToCart(dynamicFixtures.productTwo.sku, 2);
    completeGuestCheckoutProcess();

    cy.contains('Your order has been placed successfully!');
  });

  it('should checkout to multi shipment address [@regression]', (): void => {
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
});

const completeGuestCheckoutProcess = () => {
  cartPage.startCheckout();
  checkoutCustomerPage.checkoutAsGuest();
  checkoutAddressPage.fillShippingAddress();
  checkoutShipmentPage.setStandardShippingMethod();
  checkoutPaymentPage.setDummyPaymentMethod();
  checkoutSummaryPage.placeOrder();
}
