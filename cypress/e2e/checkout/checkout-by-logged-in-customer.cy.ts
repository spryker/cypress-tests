import * as CheckoutHelper from '../../support/helpers/checkout/checkout.helper';
import {CheckoutCustomer} from "../../support/helpers/checkout/types/checkout.customer";
import {CheckoutAddress} from "../../support/helpers/checkout/types/checkout.address";
import {CheckoutProduct} from "../../support/helpers/checkout/types/checkout.product";

describe('Checkout By Logged In Customer', () => {
  let customer: CheckoutCustomer;
  let address: CheckoutAddress;
  let firstProduct: CheckoutProduct, secondProduct: CheckoutProduct;

  before(() => {
    customer = CheckoutHelper.createCustomer(
        'spencor.hopkin@spryker.com',
        'Spencor',
        'Hopkin',
        'change123',
    );
    address = CheckoutHelper.createAddress();
    firstProduct = CheckoutHelper.createProduct(
        '169_25880805',
        '/en/hp-slate-10-pro-ee-169'
    );

    secondProduct = CheckoutHelper.createProduct(
        '156_32018944',
        '/en/acer-iconia-b1-850-156'
    );
  });

  beforeEach(() => {
    CheckoutHelper.login(customer);
    CheckoutHelper.createCart();
  });

  it('should checkout with one concrete product', () => {
    CheckoutHelper.addProductToCart(firstProduct);

    cy.url().should('include', '/en/cart');
    cy.get('[data-qa="cart-item-sku"]', {timeout: 5000}).first().contains(firstProduct.sku);
    cy.get('[data-qa="cart-go-to-checkout"]').click();

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
    cy.get('[data-qa="cart-item-sku"]', {timeout: 5000}).first().contains(firstProduct.sku);
    cy.get('[data-qa="cart-item-sku"]').last().contains(secondProduct.sku);
    cy.get('[data-qa="cart-go-to-checkout"]').click();

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
