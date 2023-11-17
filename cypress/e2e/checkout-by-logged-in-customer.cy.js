describe('Checkout By Logged In Customer', () => {
  it('Checkout with one concrete product', () => {

    // Login as a spencor.hopkin@spryker.com
    cy.amLoggedInCustomer('spencor.hopkin@spryker.com', 'change123');

    // Create new cart to avoid conflicts with other tests
    cy.amUsingSeparateMultiCart();

    // Add a product to my cart
    cy.visit('/en/hp-slate-10-pro-ee-169');
    cy.get('button').contains('Add to Cart').click();

    // Start the checkout process
    cy.url().should('include', '/en/cart');
    cy.contains('HP Slate 10 Pro EE', { timeout: 5000 });
    cy.get('a').contains('Checkout').click();

    // Fill out the address form
    cy.url().should('include', '/en/checkout/address');
    cy.haveFilledShippingAddressForm('Spencor', 'Hopkin', '123 Main St', '12c', '10001', 'New York');

    // Select a shipment method
    cy.url().should('include', '/en/checkout/shipment');
    cy.get('#shipmentCollectionForm_shipmentGroups_0_shipment_shipmentSelection_0').click({ force: true });
    cy.contains('button', 'Next').click();

    // Select a payment method
    cy.url().should('include', '/en/checkout/payment');
    cy.get('#paymentForm_paymentSelection_dummyPaymentInvoice').click({ force: true });
    cy.get('#paymentForm_dummyPaymentInvoice_date_of_birth').type('01.01.2000');
    cy.contains('button', 'Go to Summary').click();

    // Finalize checkout
    cy.url().should('include', '/en/checkout/summary');
    cy.get('.form__action.button.button--success.js-summary__submit-button').scrollIntoView();
    cy.get('[name="acceptTermsAndConditions"]').check({force: true});
    cy.get('.form__action.button.button--success.js-summary__submit-button').invoke('prop', 'disabled', false);
    cy.contains('button', 'Submit your order').click();
  });

  it('should checkout with two concrete products', () => {

    // Login as a spencor.hopkin@spryker.com
    cy.amLoggedInCustomer('spencor.hopkin@spryker.com', 'change123');

    // Create new cart to avoid conflicts with other tests
    cy.amUsingSeparateMultiCart();

    // Add a product to my cart
    cy.visit('/en/hp-slate-10-pro-ee-169');
    cy.get('button').contains('Add to Cart').click();
    cy.visit('/en/acer-iconia-b1-850-156');
    cy.get('button').contains('Add to Cart').click();

    // Start the checkout process
    cy.url().should('include', '/en/cart');
    cy.contains('HP Slate 10 Pro EE', { timeout: 5000 });
    cy.contains('Acer Iconia B1-850', { timeout: 5000 });
    cy.get('a').contains('Checkout').click();

    // Fill out the address form
    cy.url().should('include', '/en/checkout/address');
    cy.haveFilledShippingAddressForm('Spencor', 'Hopkin', '123 Main St', '12c', '10001', 'New York');

    // Select a shipment method
    cy.url().should('include', '/en/checkout/shipment');
    cy.get('#shipmentCollectionForm_shipmentGroups_0_shipment_shipmentSelection_0').click({ force: true });
    cy.contains('button', 'Next').click();

    // Select a payment method
    cy.url().should('include', '/en/checkout/payment');
    cy.get('#paymentForm_paymentSelection_dummyPaymentInvoice').click({ force: true });
    cy.get('#paymentForm_dummyPaymentInvoice_date_of_birth').type('01.01.2000');
    cy.contains('button', 'Go to Summary').click();

    // Finalize checkout
    cy.url().should('include', '/en/checkout/summary');
    cy.get('.form__action.button.button--success.js-summary__submit-button').scrollIntoView();
    cy.get('[name="acceptTermsAndConditions"]').check({force: true});
    cy.get('.form__action.button.button--success.js-summary__submit-button').invoke('prop', 'disabled', false);
    cy.contains('button', 'Submit your order').click();
  });
});
