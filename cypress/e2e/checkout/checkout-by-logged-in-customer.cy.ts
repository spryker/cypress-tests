import { LoginPage } from "../../support/pages/login/login.page";
import { MultiCartPage } from "../../support/pages/multi-cart/multi.cart.page";
import { CartPage } from "../../support/pages/cart/cart.page";
import { AddressPage } from "../../support/pages/checkout/address/address.page";
import { ShipmentPage } from "../../support/pages/checkout/shipment/shipment.page";
import { PaymentPage } from "../../support/pages/checkout/payment/payment.page";
import { SummaryPage } from "../../support/pages/checkout/summary/summary.page";

describe('checkout by logged in customer', () => {
    const loginPage = new LoginPage();
    const multiCartPage = new MultiCartPage();

    const cartPage = new CartPage();
    const addressStepPage = new AddressPage();
    const shipmentStepPage = new ShipmentPage();
    const paymentStepPage = new PaymentPage();
    const summaryStepPage = new SummaryPage();
    let fixtures: CheckoutFixtures;

    before(() => {
        cy.fixture('checkout/data').then((data: OrderFixtures) => fixtures = data);
    });

    beforeEach(() => {
        cy.resetCookies();
        loginPage.login(fixtures.customer.email, fixtures.customer.password);
        multiCartPage.createCart();
    });

    it('should checkout with one concrete product', () => {
        cy.visit(cartPage.PAGE_URL);
        cartPage.quickAddToCart(fixtures.concreteProductSkus[0]);

        cartPage.startCheckout();
        addressStepPage.fillShippingAddress();
        shipmentStepPage.setStandardShippingMethod();
        paymentStepPage.setDummyPaymentMethod();
        summaryStepPage.placeOrder();

        cy.contains('Your order has been placed successfully!');
    });

    it('should checkout with two concrete products to single shipment', () => {
        cy.visit(cartPage.PAGE_URL);
        cartPage.quickAddToCart(fixtures.concreteProductSkus[0], 2);
        cartPage.quickAddToCart(fixtures.concreteProductSkus[1], 2);

        cartPage.startCheckout();
        addressStepPage.fillShippingAddress();
        shipmentStepPage.setStandardShippingMethod();
        paymentStepPage.setDummyPaymentMethod();
        summaryStepPage.placeOrder();

        cy.contains('Your order has been placed successfully!');
    });

    it('should checkout to multi shipment address', () => {
        cy.visit(cartPage.PAGE_URL);
        cartPage.quickAddToCart(fixtures.concreteProductSkus[0], 2);
        cartPage.quickAddToCart(fixtures.concreteProductSkus[1], 2);

        cartPage.startCheckout();
        addressStepPage.fillMultiShippingAddress();
        shipmentStepPage.setStandardShippingMethod();
        paymentStepPage.setDummyPaymentMethod();
        summaryStepPage.placeOrder();

        cy.contains('Your order has been placed successfully!');
    });

    it('should checkout with strict checkout step redirects', () => {
        cy.visit(cartPage.PAGE_URL);
        cartPage.quickAddToCart(fixtures.concreteProductSkus[0]);

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
