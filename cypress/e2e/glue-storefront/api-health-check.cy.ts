describe('API health check', { tags: '@smoke' }, () => {
  it('should return 200', () => {
    cy.request({
      method: 'GET',
      url: Cypress.env().glueStorefrontUrl + '/stores',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    })
      .its('status')
      .should('eq', 200);
  });
});
