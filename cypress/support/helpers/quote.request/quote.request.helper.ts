import {faker} from '@faker-js/faker';
import {QuoteRequestCustomer} from "./types/quote.request.customer";

export const createCustomer = (email: string, password: string): QuoteRequestCustomer => {
    return {
        email: email ?? faker.internet.email(),
        password: password ?? faker.internet.password(),
    };
}

export const login = (customer: QuoteRequestCustomer) => {
    cy.visit('/en/login');
    cy.get('#loginForm_email').type(customer.email);
    cy.get('#loginForm_password').type(customer.password);

    cy.get('form[name=loginForm]').submit();
};

export const createCart = () => {
    cy.visit('/en/multi-cart/create');
    cy.get('#quoteForm_name').type(`[e2e-scenario] Cart #${faker.string.uuid()}`);
    cy.get('form[name=quoteForm]').submit();
};

export const addProductToCart = (link: string) => {
    cy.visit(link);
    cy.get('button').contains('Add to Cart').click();
};
