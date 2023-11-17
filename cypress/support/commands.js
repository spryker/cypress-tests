// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('amLoggedInCustomer', (email, password) => {
    cy.visit('/en/login');
    cy.get('#loginForm_email').type(email);
    cy.get('#loginForm_password').type(password);
    cy.get('form[name=loginForm] .form__action.button.button--success').click();
    cy.url().should('include', '/en/customer/overview');
});

Cypress.Commands.add('amUsingSeparateMultiCart', () => {
    cy.visit('/en/multi-cart/create');
    cy.get('#quoteForm_name').type(`[e2e-scenario] Cart#${new Date().getTime()}${Math.floor(Math.random() * 900 + 100)}`);
    cy.get('form[name=quoteForm] .form__action.button.button--success').click();
});

Cypress.Commands.add('haveFilledShippingAddressForm', (firstName, lastName, address1, address2, zipCode, city) => {
    cy.get('.select__select.js-address__form-select-shippingAddress').select('0');
    cy.get('#addressesForm_shippingAddress_first_name').type(firstName);
    cy.get('#addressesForm_shippingAddress_last_name').type(lastName);
    cy.get('#addressesForm_shippingAddress_address1').type(address1);
    cy.get('#addressesForm_shippingAddress_address2').type(address2);
    cy.get('#addressesForm_shippingAddress_zip_code').type(zipCode);
    cy.get('#addressesForm_shippingAddress_city').type(city);
    cy.get('#addressesForm_billingSameAsShipping').check({ force: true });
    cy.contains('button', 'Next').click();
});
