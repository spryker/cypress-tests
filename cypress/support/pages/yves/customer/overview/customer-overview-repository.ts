export interface CustomerOverviewRepository {
  getPlacedOrderSuccessMessage(): string;
  getLastViewOrderButton(): Cypress.Chainable;
  getOrderedProductSelector(productName: string): string;
  getFirstShippingAddress(): Cypress.Chainable;
  getViewOrderButton(tableRowIndex: number): Cypress.Chainable;
  getMyFilesLink(): Cypress.Chainable;
  getOrderDetailTableRow(): Cypress.Chainable;
}
