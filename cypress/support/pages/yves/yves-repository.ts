export interface YvesRepository {
  selectLocale(localeName: string): Cypress.Chainable;
  getLocaleOptionsSelector(): string;
  getLocaleAttributeName(): string;
}
