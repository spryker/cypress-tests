// cypress/support/index.d.ts

declare namespace Cypress {
    interface Chainable {
        /**
         * @example cy.amLoggedInCustomer('user@example.com', 'password123')
         */
        amLoggedInCustomer(email: string, password: string): Chainable<Element>;

        /**
         * @example cy.amUsingSeparateMultiCart()
         */
        amUsingSeparateMultiCart(): Chainable<Element>;

        /**
         * @example cy.haveFilledShippingAddressForm(firstName, lastName, address1, address2, zipCode, city)
         */
        haveFilledShippingAddressForm(firstName: string, lastName: string, address1: string, address2: string, zipCode: string, city: string): Chainable<Element>;
    }
}
