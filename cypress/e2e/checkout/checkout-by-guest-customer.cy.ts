import * as CheckoutHelper from '../../support/helpers/checkout/checkout.helper';

const customer = CheckoutHelper.createCustomer();
const address = CheckoutHelper.createAddress();
const firstProduct = CheckoutHelper.createProduct(
    '169_25880805',
    'HP Slate 10 Pro EE',
    '/en/hp-slate-10-pro-ee-169'
);

const secondProduct = CheckoutHelper.createProduct(
    '156_32018944',
    'Acer Iconia B1-850',
    '/en/acer-iconia-b1-850-156'
);

describe('Checkout By Guest Customer', () => {
    it('should checkout with one concrete product', () => {

        CheckoutHelper.addProductToCart(firstProduct);

        cy.url().should('include', '/en/cart');
        cy.contains(firstProduct.name, {timeout: 5000});
        cy.get('a').contains('Checkout').click();

        CheckoutHelper.checkoutAsGuest(customer);

        cy.url().should('include', '/en/checkout/address');
        CheckoutHelper.fillShippingAddress(customer, address);

        cy.url().should('include', '/en/checkout/shipment');
        CheckoutHelper.setStandardShippingMethod();

        cy.url().should('include', '/en/checkout/payment');
        CheckoutHelper.setDummyPaymentMethod();

        cy.url().should('include', '/en/checkout/summary');
        CheckoutHelper.placeOrder();

        cy.contains('Your order has been placed successfully!');
    });

    it('should checkout with two concrete products', () => {
        CheckoutHelper.addProductToCart(firstProduct);
        CheckoutHelper.addProductToCart(secondProduct);

        cy.url().should('include', '/en/cart');
        cy.contains(firstProduct.name, {timeout: 5000});
        cy.contains(secondProduct.name, {timeout: 5000});
        cy.get('a').contains('Checkout').click();

        CheckoutHelper.checkoutAsGuest(customer);

        cy.url().should('include', '/en/checkout/address');
        CheckoutHelper.fillShippingAddress(customer, address);

        cy.url().should('include', '/en/checkout/shipment');
        CheckoutHelper.setStandardShippingMethod();

        cy.url().should('include', '/en/checkout/payment');
        CheckoutHelper.setDummyPaymentMethod();

        cy.url().should('include', '/en/checkout/summary');
        CheckoutHelper.placeOrder();

        cy.contains('Your order has been placed successfully!');
    });
});
