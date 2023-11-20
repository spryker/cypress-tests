import {faker} from '@faker-js/faker';
import {Customer} from "./types/customer";
import {Address} from "./types/address";
import {Product} from "./types/product";

export const createCustomer = (
    email?: string,
    firstName?: string,
    lastName?: string,
    password?: string
): Customer => {
    return {
        email: email ?? faker.internet.email(),
        firstName: firstName ?? faker.person.firstName(),
        lastName: lastName ?? faker.person.lastName(),
        password: password ?? faker.internet.password(),
    };
}

export const createProduct = (sku: string, name: string, link: string): Product => {
    return {
        sku: sku,
        name: name,
        link: link,
    };
}

export const createAddress = (address1?: string, address2?: string, zipCode?: string, city?: string): Address => {
    return {
        address1: address1 ?? faker.location.secondaryAddress(),
        address2: address2 ?? faker.location.buildingNumber(),
        zipCode: zipCode ?? faker.location.zipCode(),
        city: city  ?? faker.location.city(),
    };
}

export const addProductToCart = (product: Product) => {
    cy.visit(product.link);
    cy.get('button').contains('Add to Cart').click();
};

export const checkoutAsGuest = (customer: Customer) => {
    cy.url().should('include', '/en/checkout/customer');
    cy.get('#guest').click({force: true});

    cy.get('#guestForm_customer_first_name').type(customer.firstName);
    cy.get('#guestForm_customer_last_name').type(customer.lastName);
    cy.get('#guestForm_customer_email').type(customer.email);
    cy.get('#guestForm_customer_accept_terms').click({force: true});

    cy.contains('button', 'Submit').click();
};

export const createCart = () => {
    cy.visit('/en/multi-cart/create');
    cy.get('#quoteForm_name').type(`[e2e-scenario] Cart #${faker.string.uuid()}`);
    cy.get('form[name=quoteForm] .form__action.button.button--success').click();
};

export const login = (Customer: Customer) => {
    cy.visit('/en/login');
    cy.get('#loginForm_email').type(Customer.email);
    cy.get('#loginForm_password').type(Customer.password);

    cy.get('form[name=loginForm] .form__action.button.button--success').click();
};

export const fillShippingAddress = (customer: Customer, address: Address) => {
    cy.get('.select__select.js-address__form-select-shippingAddress').select('0');
    cy.get('#addressesForm_shippingAddress_first_name').type(customer.firstName);
    cy.get('#addressesForm_shippingAddress_last_name').type(customer.lastName);
    cy.get('#addressesForm_shippingAddress_address1').type(address.address1);
    cy.get('#addressesForm_shippingAddress_address2').type(address.address2);
    cy.get('#addressesForm_shippingAddress_zip_code').type(address.zipCode);
    cy.get('#addressesForm_shippingAddress_city').type(address.city);
    cy.get('#addressesForm_billingSameAsShipping').check({force: true});

    cy.contains('button', 'Next').click();
};

export const setStandardShippingMethod = () => {
    cy.get('#shipmentCollectionForm_shipmentGroups_0_shipment_shipmentSelection_0').click({force: true});
    cy.contains('button', 'Next').click();
};

export const setDummyPaymentMethod = () => {
    cy.get('#paymentForm_paymentSelection_dummyPaymentInvoice').click({force: true});
    cy.get('#paymentForm_dummyPaymentInvoice_date_of_birth').type('12.12.1999');
    cy.contains('button', 'Go to Summary').click();
};

export const placeOrder = () => {
    cy.get('.form__action.button.button--success.js-summary__submit-button').scrollIntoView();
    cy.get('[name="acceptTermsAndConditions"]').check({force: true});
    cy.get('.form__action.button.button--success.js-summary__submit-button').invoke('prop', 'disabled', false);
    cy.contains('button', 'Submit your order').click();
};
