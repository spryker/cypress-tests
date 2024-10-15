export class HomeRepository {
  getStoreSelect = (): Cypress.Chainable => cy.get(`header [data-qa="component select _store"] select[name="_store"]`);
  getStoreSelectorOption = (storeName: string): string => `select[name="_store"] option[value="${storeName}"]`;
  getStoreSelectorHeader = (): string => `header [data-qa="component select _store"]`;
}
