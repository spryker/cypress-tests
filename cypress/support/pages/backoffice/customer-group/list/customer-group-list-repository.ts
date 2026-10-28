export interface CustomerGroupListRepository {
  getSuccessMessage(): Cypress.Chainable;
  getViewButtonSelector(): string;
}
