// cypress/support/index.d.ts

declare namespace Cypress {
    interface Chainable {
        /**
         * @example cy.resetCookies()
         */
        resetCookies(): Chainable<Element>;
        /**
         * @example cy.iframe()
         */
        iframe(): Chainable<Element>;
        /**
         * @example cy.visitBackoffice(url)
         */
        visitBackoffice(url: string): Chainable<Element>;
    }
}
