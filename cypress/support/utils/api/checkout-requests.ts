import { authHeaders } from './auth';

/**
 * Submits the checkout (`POST /checkout?include=orders`) and returns the response.
 */
export function submitCheckout(accessToken: string, body: Record<string, unknown>): Cypress.Chainable {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env().glueUrl}/checkout?include=orders`,
    headers: authHeaders(accessToken),
    body,
  });
}
