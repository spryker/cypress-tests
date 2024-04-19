describe('API health check', { tags: '@smoke' }, () => {
  it('should return 201', () => {
    const dummyBody = {
      data: {
        type: 'dynamic-fixtures',
        attributes: {
          operations: [
            {
              type: 'transfer',
              name: 'LocaleTransfer',
              key: 'localeDE',
              arguments: { locale_name: 'de_DE' },
            },
          ],
        },
      },
    };

    cy.request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: dummyBody,
    })
      .its('status')
      .should('eq', 201);
  });
});
