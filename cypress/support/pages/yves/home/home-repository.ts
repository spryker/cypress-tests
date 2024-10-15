export interface HomeRepository {
  getStoreSelect(): Cypress.Chainable;
  getStoreSelectorOption(storeName: string): string;
  getStoreSelectorHeader(): string;
}
