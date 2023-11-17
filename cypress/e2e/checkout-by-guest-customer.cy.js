describe('Checkout By Guest Customer', () => {
  it('Checkout with one concrete product', () => {

    // Add a product to my cart
    cy.visit('/en/hp-slate-10-pro-ee-169');
    cy.get('button').contains('Add to Cart').click();

    // Start the checkout process
    cy.url().should('include', '/en/cart');
    cy.contains('HP Slate 10 Pro EE', { timeout: 5000 });
    cy.get('a').contains('Checkout').click();

    // Fill out guest checkout form
    cy.url().should('include', '/en/checkout/customer');
    cy.get('#guest').click({ force: true });
    cy.get('#guestForm_customer_first_name').type('Harry');
    cy.get('#guestForm_customer_last_name').type('Klein');
    cy.get('#guestForm_customer_email').type('harry.klein@spryker.com');
    cy.get('#guestForm_customer_accept_terms').click({ force: true });
    cy.contains('button', 'Submit').click();

    // Fill out the address form
    cy.url().should('include', '/en/checkout/address');
    cy.get('.select__select.js-address__form-select-shippingAddress').select('0');
    cy.get('#addressesForm_shippingAddress_first_name').type('Harry');
    cy.get('#addressesForm_shippingAddress_last_name').type('Klein');
    cy.get('#addressesForm_shippingAddress_address1').type('Julie-Wolfthorn-Str');
    cy.get('#addressesForm_shippingAddress_address2').type('1');
    cy.get('#addressesForm_shippingAddress_zip_code').type('10235');
    cy.get('#addressesForm_shippingAddress_city').type('Berlin');
    cy.get('#addressesForm_billingSameAsShipping').check({ force: true });
    cy.contains('button', 'Next').click();

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

    // Add two products to my cart
    cy.visit('/en/hp-slate-10-pro-ee-169');
    cy.get('button').contains('Add to Cart').click();
    cy.visit('/en/acer-iconia-b1-850-156');
    cy.get('button').contains('Add to Cart').click();

    // Start the checkout process
    cy.url().should('include', '/en/cart');
    cy.contains('HP Slate 10 Pro EE', { timeout: 5000 });
    cy.contains('Acer Iconia B1-850', { timeout: 5000 });
    cy.get('a').contains('Checkout').click();

    // Fill out guest checkout form
    cy.url().should('include', '/en/checkout/customer');
    cy.get('#guest').click({ force: true });
    cy.get('#guestForm_customer_first_name').type('Harry');
    cy.get('#guestForm_customer_last_name').type('Klein');
    cy.get('#guestForm_customer_email').type('harry.klein@spryker.com');
    cy.get('#guestForm_customer_accept_terms').click({ force: true });
    cy.contains('button', 'Submit').click();

    // Fill out the address form
    cy.url().should('include', '/en/checkout/address');
    cy.get('.select__select.js-address__form-select-shippingAddress').select('0');
    cy.get('#addressesForm_shippingAddress_first_name').type('Harry');
    cy.get('#addressesForm_shippingAddress_last_name').type('Klein');
    cy.get('#addressesForm_shippingAddress_address1').type('Julie-Wolfthorn-Str');
    cy.get('#addressesForm_shippingAddress_address2').type('1');
    cy.get('#addressesForm_shippingAddress_zip_code').type('10235');
    cy.get('#addressesForm_shippingAddress_city').type('Berlin');
    cy.get('#addressesForm_billingSameAsShipping').check({ force: true });
    cy.contains('button', 'Next').click();

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
