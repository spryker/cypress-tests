// cypress/support/index.d.ts

declare namespace Cypress {
  interface Cypress {
    mocha: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

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
     * @example cy.loadDynamicFixturesByPayload('suite/yves/checkout/dynamic-checkout-by-guest-customer')
     */
    loadDynamicFixturesByPayload(dynamicFixturesDefaultFilePath: string, retries?: number): Chainable;

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
    reloadUntilFound(
      url: string,
      findSelector: string,
      getSelector: string,
      retries: number,
      retryWait: number,
      commands?: string[]
    ): void;

    /**
     * @example cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout'])
     */
    runCliCommands(commands: string[]): void;

    /**
     * @example cy.confirmCustomerByEmail('test@spryker.com')
     */
    confirmCustomerByEmail(email: string): void;

    /**
     * Get MFA code for a customer by email and type
     * @param email - Customer's email
     * @param type - MFA type (e.g., 'email', 'authenticator')
     * @example
     * cy.getMultiFactorAuthCode('customer@example.com', 'email')
     */
    getMultiFactorAuthCode(email: string, type: string): Chainable<string>;

    /**
     * Clean up an MFA code from the database
     * @param code - The code to clean up
     * @example
     * cy.cleanUpMultiFactorAuthCode('123456')
     */
    cleanUpMultiFactorAuthCode(code: string): void;
  }
}
