/**
 * Backend API lifecycle for customer groups and their assignment.
 *
 * Uses only static fixtures and the seeded root Back Office user, so the spec is self-contained:
 * every group it creates carries a unique name and is deleted at the end of the flow.
 */
describe('customer groups backend api', { tags: ['@api', '@customer-group', 'customer', 'spryker-core'] }, () => {
  const defaultUsername = 'admin@spryker.com';
  const defaultPassword = 'change123';

  let authToken: string;
  let groupUuid: string;
  let customerReference: string;

  const groupName = `cypress-customer-group-${Date.now()}`;

  const jsonApiHeaders = (): Record<string, string> => ({
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  });

  const customerGroupBody = (attributes: Record<string, unknown>): Record<string, unknown> => ({
    data: {
      type: 'customer-groups',
      attributes: attributes,
    },
  });

  before((): void => {
    cy.request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grantType=password&username=${defaultUsername}&password=${defaultPassword}`,
    }).then((tokenResponse) => {
      expect(tokenResponse.status).to.eq(200);
      authToken = tokenResponse.body.access_token;

      // Nested rather than chained: `jsonApiHeaders()` is evaluated when the request object is
      // built, so a sibling `cy.request()` would be constructed before the token is assigned.
      cy.request({
        method: 'GET',
        url: Cypress.env().glueBackendUrl + '/customers?page[limit]=1',
        headers: jsonApiHeaders(),
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.length, 'the shop must have at least one customer').to.be.greaterThan(0);
        customerReference = response.body.data[0].id;
      });
    });
  });

  it('rejects an unauthenticated request', (): void => {
    cy.request({
      method: 'GET',
      url: Cypress.env().glueBackendUrl + '/customer-groups',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('creates a customer group', (): void => {
    cy.request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/customer-groups',
      headers: jsonApiHeaders(),
      body: customerGroupBody({ name: groupName, description: 'Created by the Cypress API suite.' }),
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.data.attributes.name).to.eq(groupName);
      expect(response.body.data.attributes.uuid).to.not.be.empty;

      groupUuid = response.body.data.attributes.uuid;
    });
  });

  it('rejects a duplicate name case-insensitively', (): void => {
    cy.request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/customer-groups',
      headers: jsonApiHeaders(),
      body: customerGroupBody({ name: groupName.toUpperCase() }),
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(422);
    });
  });

  it('finds the group in the collection by free-text search', (): void => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env().glueBackendUrl}/customer-groups?q=${groupName}`,
      headers: jsonApiHeaders(),
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data.map((item: { id: string }) => item.id)).to.deep.eq([groupUuid]);
    });
  });

  it('renames the group without changing its uuid', (): void => {
    cy.request({
      method: 'PATCH',
      url: `${Cypress.env().glueBackendUrl}/customer-groups/${groupUuid}`,
      headers: jsonApiHeaders(),
      body: customerGroupBody({ name: `${groupName}-renamed` }),
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data.attributes.name).to.eq(`${groupName}-renamed`);
      expect(response.body.data.attributes.uuid).to.eq(groupUuid);
    });
  });

  it('adds a customer to the group', (): void => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env().glueBackendUrl}/customer-groups/${groupUuid}/customers`,
      headers: jsonApiHeaders(),
      body: {
        data: {
          type: 'customer-group-customers',
          attributes: { customerReferences: [customerReference] },
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.request({
      method: 'GET',
      url: `${Cypress.env().glueBackendUrl}/customer-groups/${groupUuid}/customers`,
      headers: jsonApiHeaders(),
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data.map((item: { id: string }) => item.id)).to.deep.eq([customerReference]);
    });
  });

  it('rejects an unknown customer reference', (): void => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env().glueBackendUrl}/customer-groups/${groupUuid}/customers`,
      headers: jsonApiHeaders(),
      body: {
        data: {
          type: 'customer-group-customers',
          attributes: { customerReferences: ['DE--cypress-does-not-exist'] },
        },
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(422);
    });
  });

  it('removes one member', (): void => {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env().glueBackendUrl}/customer-groups/${groupUuid}/customers/${customerReference}`,
      headers: jsonApiHeaders(),
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.request({
      method: 'GET',
      url: `${Cypress.env().glueBackendUrl}/customer-groups/${groupUuid}/customers`,
      headers: jsonApiHeaders(),
    }).then((response) => {
      expect(response.body.data).to.have.length(0);
    });
  });

  it('clears every member of the group', (): void => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env().glueBackendUrl}/customer-groups/${groupUuid}/customers`,
      headers: jsonApiHeaders(),
      body: {
        data: {
          type: 'customer-group-customers',
          attributes: { customerReferences: [customerReference] },
        },
      },
    });

    cy.request({
      method: 'POST',
      url: `${Cypress.env().glueBackendUrl}/customer-groups/${groupUuid}/unassign-customers`,
      headers: jsonApiHeaders(),
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.request({
      method: 'GET',
      url: `${Cypress.env().glueBackendUrl}/customer-groups/${groupUuid}/customers`,
      headers: jsonApiHeaders(),
    }).then((response) => {
      expect(response.body.data).to.have.length(0);
    });
  });

  it('deletes the group', (): void => {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env().glueBackendUrl}/customer-groups/${groupUuid}`,
      headers: jsonApiHeaders(),
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.request({
      method: 'GET',
      url: `${Cypress.env().glueBackendUrl}/customer-groups/${groupUuid}`,
      headers: jsonApiHeaders(),
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
