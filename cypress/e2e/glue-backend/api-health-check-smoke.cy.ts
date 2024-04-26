/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe('API health check smoke', { tags: '@smoke' }, () => {
  it('should return 200', () => {
    cy.request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grantType=password&username=admin@spryker.com&password=change123`,
    })
      .its('status')
      .should('eq', 200);
  });
});
