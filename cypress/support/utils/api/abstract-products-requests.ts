import { authHeaders } from './auth';

const abstractProductsUrl = (): string => `${Cypress.env().glueBackendUrl}/abstract-products`;

export function getAbstractProduct(accessToken: string, sku: string, failOnStatusCode = true): Cypress.Chainable {
  return cy.request({
    method: 'GET',
    url: `${abstractProductsUrl()}/${sku}`,
    headers: authHeaders(accessToken),
    failOnStatusCode,
  });
}

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

export function getAbstractProductWithoutToken(sku: string): Cypress.Chainable {
  return cy.request({
    method: 'GET',
    url: `${abstractProductsUrl()}/${sku}`,
    headers: { 'Content-Type': 'application/json' },
    failOnStatusCode: false,
  });
}
