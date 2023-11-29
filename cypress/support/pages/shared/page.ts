export class Page {
    PAGE_URL = '';

    assertPageLocation = () => {
        cy.url().should('include', this.PAGE_URL);
    }
}
