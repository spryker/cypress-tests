export class Page {
    PAGE_URL = '/';

    getPageLocation = () => {
        return this.PAGE_URL;
    }

    assertPageLocation = () => {
        cy.url().should('include', this.getPageLocation());
    }
}
