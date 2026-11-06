/**
 * Backend API for the shop-wide "hide from not-logged-in customers" setting.
 *
 * The spec flips one content type and restores it afterwards, so it leaves the shop as it found it.
 */
describe('customer access backend api', { tags: ['@api', '@customer-access', 'customer', 'spryker-core'] }, () => {
  const defaultUsername = 'admin@spryker.com';
  const defaultPassword = 'change123';
  const contentType = 'price';

  let authToken: string;
  let originalIsRestricted: boolean;

  const jsonApiHeaders = (): Record<string, string> => ({
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  });

  const patchBody = (isRestricted: boolean): Record<string, unknown> => ({
    data: {
      type: 'customer-access',
      attributes: {
        contentTypeAccess: [{ contentType: contentType, isRestricted: isRestricted }],
      },
    },
  });

  const findContentType = (body: {
    data: { attributes: { contentTypeAccess: { contentType: string; isRestricted: boolean }[] } };
  }): { contentType: string; isRestricted: boolean } | undefined =>
    body.data.attributes.contentTypeAccess.find((entry) => entry.contentType === contentType);

  before((): void => {
    cy.request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grantType=password&username=${defaultUsername}&password=${defaultPassword}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      authToken = response.body.access_token;
    });
  });

  it('returns every configured content type', (): void => {
    cy.request({
      method: 'GET',
      url: Cypress.env().glueBackendUrl + '/customer-access',
      headers: jsonApiHeaders(),
    }).then((response) => {
      expect(response.status).to.eq(200);

      const entry = findContentType(response.body);
      expect(entry, `${contentType} must be configured`).to.not.be.undefined;

      originalIsRestricted = (entry as { isRestricted: boolean }).isRestricted;
    });
  });

  it('flips one content type and leaves the others untouched', (): void => {
    cy.request({
      method: 'GET',
      url: Cypress.env().glueBackendUrl + '/customer-access',
      headers: jsonApiHeaders(),
    }).then((getResponse) => {
      const before = getResponse.body.data.attributes.contentTypeAccess.filter(
        (entry: { contentType: string }) => entry.contentType !== contentType
      );

      cy.request({
        method: 'PATCH',
        url: Cypress.env().glueBackendUrl + '/customer-access',
        headers: jsonApiHeaders(),
        body: patchBody(!originalIsRestricted),
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect((findContentType(response.body) as { isRestricted: boolean }).isRestricted).to.eq(!originalIsRestricted);

        const after = response.body.data.attributes.contentTypeAccess.filter(
          (entry: { contentType: string }) => entry.contentType !== contentType
        );
        expect(after).to.deep.eq(before);
      });
    });
  });

  it('rejects an unknown content type', (): void => {
    cy.request({
      method: 'PATCH',
      url: Cypress.env().glueBackendUrl + '/customer-access',
      headers: jsonApiHeaders(),
      body: {
        data: {
          type: 'customer-access',
          attributes: {
            contentTypeAccess: [{ contentType: 'cypress-not-a-content-type', isRestricted: true }],
          },
        },
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(422);
    });
  });

  after((): void => {
    if (authToken === undefined || originalIsRestricted === undefined) {
      return;
    }

    cy.request({
      method: 'PATCH',
      url: Cypress.env().glueBackendUrl + '/customer-access',
      headers: jsonApiHeaders(),
      body: patchBody(originalIsRestricted),
    });
  });
});
