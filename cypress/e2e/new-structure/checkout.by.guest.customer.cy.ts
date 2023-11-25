import {CartPage} from "../../support/pages/cart/cart.page";

const cartPage = new CartPage();

describe('Checkout By Guest Customer', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit('/', {
            onBeforeLoad(win) {
                win.sessionStorage.clear();
            }
        });
    });

    it('should place order with with one concrete product', () => {
        const firstProductSku = '169_25880805';
        const secondProductSku = '156_32018944';

        cy.visit('/cart');
        cartPage.quickAddToCart(firstProductSku);

        cy.url().should('include', '/en/cart');
        // cartPage.removeProduct(firstProductSku);
        // cartPage.removeProduct(secondProductSku);
        cartPage.changeQuantity(firstProductSku, 3);

        //
        // CheckoutHelper.checkoutAsGuest(customer);
        //
        // cy.url().should('include', '/en/checkout/address');
        // CheckoutHelper.fillShippingAddress(customer, address);
        //
        // cy.url().should('include', '/en/checkout/shipment');
        // CheckoutHelper.setStandardShippingMethod();
        //
        // cy.url().should('include', '/en/checkout/payment');
        // CheckoutHelper.setDummyPaymentMethod();
        //
        // cy.url().should('include', '/en/checkout/summary');
        // CheckoutHelper.placeOrder();
        //
        // cy.contains('Your order has been placed successfully!');
    });
});
