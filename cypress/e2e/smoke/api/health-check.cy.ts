/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe('health check', { tags: ['@smoke', '@api', 'search', 'catalog', 'spryker-core'] }, () => {
  it('GLUE endpoint should return 200', () => {
    cy.request(Cypress.env().glueUrl + '/catalog-search')
      .its('status')
      .should('eq', 200);
  });

  it('GLUE Backend endpoint should return 200', () => {
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

  it('GLUE Storefront endpoint should return 200', () => {
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
