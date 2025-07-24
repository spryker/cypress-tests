export interface HomeRepository {
  selectStore(storeName: string): Cypress.Chainable;
  getStoreSelectorOption(storeName: string): string;
  getStoreSelectorHeader(): string;
  getNavigationNewLink(newPageLinkText: string): Cypress.Chainable;
}
