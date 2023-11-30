// cypress/support/index.d.ts

declare namespace Cypress {
    interface Chainable {
        /**
         * @example cy.iframe()
         */
        iframe(): Chainable<Element>;

        /**
         * @example cy.reloadUntilFound('/transactions', 'td:contains($4.44)')
         */
        reloadUntilFound(url: string, findSelector: string, getSelector: string, retries: number, retryWait: number): Chainable<Element>;

        /**
         * @example cy.resetCookies()
         */
        resetCookies(): Chainable<Element>;

        /**
         * @example cy.visitBackoffice('/security-gui/login')
         */
        visitBackoffice(url: string): Chainable<Element>;
    }
}
