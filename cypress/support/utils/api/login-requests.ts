/**
 * Requests a Backend API access token with the password grant (`POST /token`).
 * Does not fail on an error status, so a test can send wrong credentials.
 */
export function requestBackendApiAccessToken(
  username: string,
  password: string
): Cypress.Chainable<Cypress.Response<unknown>> {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env().glueBackendUrl}/token`,
    form: true,
    body: { grantType: 'password', username, password },
    failOnStatusCode: false,
  });
}

/**
 * Requests a Glue API customer access token (`POST /access-tokens`).
 * Does not fail on an error status, so a test can send wrong credentials.
 */
export function requestCustomerAccessToken(
  email: string,
  password: string
): Cypress.Chainable<Cypress.Response<unknown>> {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env().glueUrl}/access-tokens`,
    headers: { 'Content-Type': 'application/json' },
    body: { data: { type: 'access-tokens', attributes: { username: email, password } } },
    failOnStatusCode: false,
  });
}

/**
 * Requests a Glue API agent access token (`POST /agent-access-tokens`).
 * Does not fail on an error status, so a test can send wrong credentials.
 */
export function requestAgentAccessToken(
  username: string,
  password: string
): Cypress.Chainable<Cypress.Response<unknown>> {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env().glueUrl}/agent-access-tokens`,
    headers: { 'Content-Type': 'application/json' },
    body: { data: { type: 'agent-access-tokens', attributes: { username, password } } },
    failOnStatusCode: false,
  });
}
