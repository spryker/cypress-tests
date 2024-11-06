export interface CustomerOverviewRepository {
  getPlacedOrderSuccessMessage(): string;
  getLastViewOrderButton(): Cypress.Chainable;
}
