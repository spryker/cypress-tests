export class SalesRepository {
  getViewButtons = () => {
    return cy.get(".btn-view");
  };
}
