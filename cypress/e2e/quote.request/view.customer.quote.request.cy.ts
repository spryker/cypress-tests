import * as QuoteRequestHelper from '../../support/helpers/quote.request/quote.request.helper';
import {QuoteRequestCustomer} from "../../support/helpers/quote.request/types/quote.request.customer";

describe('View customer quote request', () => {
    let customer: QuoteRequestCustomer;

    before(() => {
        customer = QuoteRequestHelper.createCustomer(
            'sonia@spryker.com',
            'change123',
        );
    });

    beforeEach(() => {
        QuoteRequestHelper.login(customer);
    });

    it('should be able to view quote request list page', () => {
        cy.get('[data-id="sidebar-quote-request"]')
            .contains('Quote Requests')
            .click();

        cy.url().should('include', '/en/quote-request');

        cy.get('[data-qa="component quote-request-view-table"]').as('rfq-table');
        cy.get('@rfq-table').contains('th','#Reference');
        cy.get('@rfq-table').contains('th','Owner');
        cy.get('@rfq-table').contains('th','Total');
        cy.get('@rfq-table').contains('th','Date');
        cy.get('@rfq-table').contains('th','Actions');
    });

    it('should be able to view quote request detail page', () => {
        cy.get('[data-id="sidebar-quote-request"]').click();

        cy.get('[data-qa="component quote-request-view-table"]').find('tr').last().find('a').click();
        cy.url().should('include', '/en/quote-request/details/DE--21-1');

        cy.get('[data-qa="component breadcrumb"]').as('rfq-breadcrumb');
        cy.get('@rfq-breadcrumb').contains('a','Home');
        cy.get('@rfq-breadcrumb').contains('a','Customer Account');
        cy.get('@rfq-breadcrumb').contains('a','Quote Request');
        cy.get('@rfq-breadcrumb').contains('li','DE--21-1');
    });
});
