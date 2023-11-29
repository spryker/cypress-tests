export class MailCatcherService {
    static verifyCustomerEmail = (email: string) => {
        cy.visit(Cypress.env().mailCatcherUrl);
        cy.get('#search').type(email + '{enter}');
        cy.contains('span', 'Thank you for signing up with Spryker Shop!').click();
        cy.get('.active > a').click();
        cy.get('#preview-html').iframe().contains('Validate your email address').invoke('removeAttr', 'target').click();
    }
}
