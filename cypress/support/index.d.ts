// cypress/support/index.d.ts

declare namespace Cypress {
  interface Chainable {
    /**
     * @example cy.iframe()
     */
    iframe($iframe: JQueryWithSelector<HTMLElement>): unknown;

    /**
     * @example cy.resetYvesCookies()
     */
    resetYvesCookies(): void;

    /**
     * @example cy.loadDynamicFixturesByPayload('suite/yves/checkout/dynamic/checkout-by-guest-customer')
     */
    loadDynamicFixturesByPayload(dynamicFixturesDefaultFilePath: string): Chainable;

    /**
     * @example cy.resetBackofficeCookies()
     */
    resetBackofficeCookies(): void;

    /**
     * @example cy.resetMerchantPortalCookies()
     */
    resetMerchantPortalCookies(): void;

    /**
     * @example cy.visitBackoffice('/security-gui/login')
     */
    visitBackoffice(url: string, options?: Partial<VisitOptions>): Chainable<AUTWindow>;

    /**
     * @example cy.visitMerchantPortal('/security-merchant-portal-gui/login')
     */
    visitMerchantPortal(url: string, options?: Partial<VisitOptions>): Chainable<AUTWindow>;

    /**
     * @example cy.reloadUntilFound('/transactions', 'td:contains($4.44)')
     */
    reloadUntilFound(url: string, findSelector: string, getSelector: string, retries: number, retryWait: number): void;
  }
}
