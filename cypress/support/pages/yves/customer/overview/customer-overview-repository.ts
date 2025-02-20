export interface CustomerOverviewRepository {
  getPlacedOrderSuccessMessage(): string;
  getLastViewOrderButton(): Cypress.Chainable;
  getOrderedProductSpan(productName: string): string;
  getViewOrderButton(tableRowIndex: number): Cypress.Chainable;
  getMyFilesLink(): Cypress.Chainable;
}
