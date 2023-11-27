export class MailCatcherService {
    url: string;

    constructor() {
        // @ts-ignore
        this.url = Cypress.config('service').mailCatcherUrl;
    }

    verifyCustomerRegistration = (email: string) => {
        cy.visit(this.url);
        cy.get('#search').type(email + '{enter}');
        cy.contains('span', 'Thank you for signing up with Spryker Shop!').click();
        cy.get('.active > a').click();
        cy.get('#preview-html').iframe().contains('Validate your email address').invoke('removeAttr', 'target').click();
    }
}
