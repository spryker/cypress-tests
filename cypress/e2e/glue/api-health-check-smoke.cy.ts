/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe('API health check smoke', { tags: '@smoke' }, () => {
  it('should return 200', () => {
    cy.request(Cypress.env().glueUrl + '/catalog-search')
      .its('status')
      .should('eq', 200);
  });
});
