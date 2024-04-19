describe('API health check', { tags: '@smoke' }, () => {
  it('should return 200', () => {
    cy.request(Cypress.env().glueUrl + '/catalog-search')
      .its('status')
      .should('eq', 200);
  });
});
