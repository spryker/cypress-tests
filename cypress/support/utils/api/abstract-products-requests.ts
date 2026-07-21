import { authHeaders } from './auth';

const abstractProductsUrl = (): string => `${Cypress.env().glueBackendUrl}/abstract-products`;

/**
 * Fetches a single abstract product by SKU (`GET /abstract-products/{sku}`).
 */
export function getAbstractProduct(accessToken: string, sku: string, failOnStatusCode = true): Cypress.Chainable {
  return cy.request({
    method: 'GET',
    url: `${abstractProductsUrl()}/${sku}`,
    headers: authHeaders(accessToken),
    failOnStatusCode,
  });
}

/**
 * Fetches the paginated abstract product collection (`GET /abstract-products`).
 */
export function getAbstractProductCollection(
  accessToken: string,
  params: { page?: number } = {},
  failOnStatusCode = true
): Cypress.Chainable {
  return cy.request({
    method: 'GET',
    url: abstractProductsUrl(),
    qs: params.page ? { page: params.page } : {},
    headers: authHeaders(accessToken),
    failOnStatusCode,
  });
}

/**
 * Fetches an abstract product without an Authorization header — for the 401 case.
 */
export function getAbstractProductWithoutToken(sku: string): Cypress.Chainable {
  return cy.request({
    method: 'GET',
    url: `${abstractProductsUrl()}/${sku}`,
    headers: { 'Content-Type': 'application/json' },
    failOnStatusCode: false,
  });
}
