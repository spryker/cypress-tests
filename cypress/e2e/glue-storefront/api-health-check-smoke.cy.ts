/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe('API health check smoke', { tags: '@smoke' }, () => {
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
