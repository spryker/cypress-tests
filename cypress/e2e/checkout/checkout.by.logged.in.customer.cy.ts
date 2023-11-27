import {LoginPage} from "../../support/pages/login/login.page";
import {MultiCartPage} from "../../support/pages/multi-cart/multi.cart.page";
import {CartPage} from "../../support/pages/cart/cart.page";
import {AddressPage} from "../../support/pages/checkout/address/address.page";
import {ShipmentPage} from "../../support/pages/checkout/shipment/shipment.page";
import {PaymentPage} from "../../support/pages/checkout/payment/payment.page";
import {SummaryPage} from "../../support/pages/checkout/summary/summary.page";

describe('Checkout By Logged In Customer', () => {
    const loginPage = new LoginPage();
    const multiCartPage = new MultiCartPage();

    const cartPage = new CartPage();
    const addressStepPage = new AddressPage();
    const shipmentStepPage = new ShipmentPage();
    const paymentStepPage = new PaymentPage();
    const summaryStepPage = new SummaryPage();

    beforeEach(() => {
        cy.resetCookies();
        loginPage.login('spencor.hopkin@spryker.com', 'change123');
        multiCartPage.createNewCart();
    });

    it('should place order with one concrete product', () => {
        cy.visit(cartPage.getPageLocation());
        cartPage.quickAddToCart('169_25880805');

        cartPage.startCheckout();
        addressStepPage.fillShippingAddress();
        shipmentStepPage.setStandardShippingMethod();
        paymentStepPage.setDummyPaymentMethod();
        summaryStepPage.placeOrder();

        cy.contains('Your order has been placed successfully!');
    });

    it('should place order with two concrete products to single shipment', () => {
        cy.visit(cartPage.getPageLocation());
        cartPage.quickAddToCart('169_25880805', 2);
        cartPage.quickAddToCart('156_32018944', 2);

        cartPage.startCheckout();
        addressStepPage.fillShippingAddress();
        shipmentStepPage.setStandardShippingMethod();
        paymentStepPage.setDummyPaymentMethod();
        summaryStepPage.placeOrder();

        cy.contains('Your order has been placed successfully!');
    });

    it('should place order to multi shipment address', () => {
        cy.visit(cartPage.getPageLocation());
        cartPage.quickAddToCart('169_25880805', 2);
        cartPage.quickAddToCart('156_32018944', 2);

        cartPage.startCheckout();
        addressStepPage.fillMultiShippingAddress();
        shipmentStepPage.setStandardShippingMethod();

        paymentStepPage.setDummyPaymentMethod();
        summaryStepPage.placeOrder();

        cy.contains('Your order has been placed successfully!');
    });
});
