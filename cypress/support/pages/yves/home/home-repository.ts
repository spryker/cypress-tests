export class HomeRepository {
  getStoreSelect = (): Cypress.Chainable => cy.get('header [data-qa="component select _store"] select[name="_store"]');
}
