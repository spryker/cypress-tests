import * as QuoteRequestHelper from '../../support/helpers/quote.request/quote.request.helper';
import {QuoteRequestCustomer} from "../../support/helpers/quote.request/types/quote.request.customer";
import {faker} from "@faker-js/faker";

describe('Create customer quote request', () => {
    let customer: QuoteRequestCustomer;

    before(() => {
        customer = QuoteRequestHelper.createCustomer(
            'sonia@spryker.com',
            'change123',
        );
    });

    beforeEach(() => {
        QuoteRequestHelper.login(customer);
        QuoteRequestHelper.createCart();
    });

    it('should be able to create quote request', () => {
        QuoteRequestHelper.addProductToCart('/en/hp-slate-10-pro-ee-169');
        QuoteRequestHelper.addProductToCart('/en/acer-iconia-b1-850-156');

        cy.get('[data-qa="component cart-summary"]').find('a').last().click();
        cy.url().should('include', '/en/quote-request/create');

        cy.get('#quote_request_form_latestVersion_metadata_purchase_order_number').type(faker.string.uuid());
        cy.get('form[name=quote_request_form]').submit();
    });
});
