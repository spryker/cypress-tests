import { CartPage } from "../../support/pages/yves/cart/cart.page";
import { CustomerPage } from "../../support/pages/yves/checkout/customer/customer.page";
import { AddressPage } from "../../support/pages/yves/checkout/address/address.page";
import { ShipmentPage } from "../../support/pages/yves/checkout/shipment/shipment.page";
import { PaymentPage } from "../../support/pages/yves/checkout/payment/payment.page";
import { SummaryPage } from "../../support/pages/yves/checkout/summary/summary.page";

describe("checkout by guest customer", () => {
  const cartPage = new CartPage();
  const customerStepPage = new CustomerPage();
  const addressStepPage = new AddressPage();
  const shipmentStepPage = new ShipmentPage();
  const paymentStepPage = new PaymentPage();
  const summaryStepPage = new SummaryPage();
  let fixtures: CheckoutFixtures;

  before(() => {
    cy.fixture("checkout/data").then(
      (data: OrderFixtures) => (fixtures = data),
    );
  });

  beforeEach(() => {
    cy.resetCookies();
  });

  it("should checkout with one concrete product", () => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSkus[0]);

    cartPage.startCheckout();
    customerStepPage.checkoutAsGuest();
    addressStepPage.fillShippingAddress();
    shipmentStepPage.setStandardShippingMethod();
    paymentStepPage.setDummyPaymentMethod();
    summaryStepPage.placeOrder();

    cy.contains("Your order has been placed successfully!");
  });

  it("should checkout with two concrete products to single shipment", () => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSkus[0], 2);
    cartPage.quickAddToCart(fixtures.concreteProductSkus[1], 2);

    cartPage.startCheckout();
    customerStepPage.checkoutAsGuest();
    addressStepPage.fillShippingAddress();
    shipmentStepPage.setStandardShippingMethod();
    paymentStepPage.setDummyPaymentMethod();
    summaryStepPage.placeOrder();

    cy.contains("Your order has been placed successfully!");
  });

  it("should checkout to multi shipment address", () => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSkus[0], 2);
    cartPage.quickAddToCart(fixtures.concreteProductSkus[1], 2);

    cartPage.startCheckout();
    customerStepPage.checkoutAsGuest();
    addressStepPage.fillMultiShippingAddress();
    shipmentStepPage.setStandardShippingMethod();
    paymentStepPage.setDummyPaymentMethod();
    summaryStepPage.placeOrder();

    cy.contains("Your order has been placed successfully!");
  });

  it("should checkout with strict checkout step redirects", () => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSkus[0]);

    cartPage.assertPageLocation();
    cartPage.startCheckout();

    customerStepPage.assertPageLocation();
    customerStepPage.checkoutAsGuest();

    addressStepPage.assertPageLocation();
    addressStepPage.fillShippingAddress();

    shipmentStepPage.assertPageLocation();
    shipmentStepPage.setStandardShippingMethod();

    paymentStepPage.assertPageLocation();
    paymentStepPage.setDummyPaymentMethod();

    summaryStepPage.assertPageLocation();
    summaryStepPage.placeOrder();

    cy.url().should("include", "/checkout/success");
  });
});
