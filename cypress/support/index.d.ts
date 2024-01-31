// cypress/support/index.d.ts
/// <reference types="@cypress/grep" />

declare namespace Cypress {
  interface Chainable {
    /**
     * @example cy.iframe()
     */
    iframe(): Chainable<Element>;

    /**
     * @example cy.resetYvesCookies()
     */
    resetYvesCookies(): void;

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
    visitBackoffice(url: string, options?: Partial<VisitOptions>): Chainable<Element>;

    /**
     * @example cy.visitMerchantPortal('/security-merchant-portal-gui/login')
     */
    visitMerchantPortal(url: string, options?: Partial<VisitOptions>): Chainable<Element>;

    /**
     * @example cy.reloadUntilFound('/transactions', 'td:contains($4.44)')
     */
    reloadUntilFound(
      url: string,
      findSelector: string,
      getSelector: string | null,
      retries: number | null,
      retryWait: number | null
    ): void;
  }
}
