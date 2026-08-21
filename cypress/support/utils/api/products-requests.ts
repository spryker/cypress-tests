import { authHeaders } from './auth';

const productsUrl = (): string => `${Cypress.env().glueBackendUrl}/products`;

const RESOURCE_TYPE = 'products';

// The backend API is JSON:API — write bodies must be wrapped as { data: { type, attributes } }
// and sent with the vnd.api+json content type.
function jsonApiHeaders(accessToken: string): Record<string, string> {
  return { ...authHeaders(accessToken), 'Content-Type': 'application/vnd.api+json' };
}

function toJsonApiBody(attributes: Record<string, unknown>): Record<string, unknown> {
  return { data: { type: RESOURCE_TYPE, attributes } };
}

export function getProduct(accessToken: string, sku: string, failOnStatusCode = true): Cypress.Chainable {
  return cy.request({
    method: 'GET',
    url: `${productsUrl()}/${sku}`,
    headers: authHeaders(accessToken),
    failOnStatusCode,
  });
}

export function getProductCollection(
  accessToken: string,
  params: { page?: number; filterSku?: string; filterAbstractSku?: string } = {},
  failOnStatusCode = true
): Cypress.Chainable {
  const qs: Record<string, string | number> = {};

  if (params.page) {
    qs.page = params.page;
  }
  if (params.filterSku) {
    qs['filter[sku]'] = params.filterSku;
  }
  if (params.filterAbstractSku) {
    qs['filter[abstractSku]'] = params.filterAbstractSku;
  }

  return cy.request({
    method: 'GET',
    url: productsUrl(),
    qs,
    headers: authHeaders(accessToken),
    failOnStatusCode,
  });
}

export function getProductWithoutToken(sku: string): Cypress.Chainable {
  return cy.request({
    method: 'GET',
    url: `${productsUrl()}/${sku}`,
    headers: { 'Content-Type': 'application/json' },
    failOnStatusCode: false,
  });
}

export function createProduct(
  accessToken: string,
  body: Record<string, unknown>,
  failOnStatusCode = true
): Cypress.Chainable {
  return cy.request({
    method: 'POST',
    url: productsUrl(),
    headers: jsonApiHeaders(accessToken),
    body: toJsonApiBody(body),
    failOnStatusCode,
  });
}

export function updateProduct(
  accessToken: string,
  sku: string,
  body: Record<string, unknown>,
  failOnStatusCode = true
): Cypress.Chainable {
  return cy.request({
    method: 'PATCH',
    url: `${productsUrl()}/${sku}`,
    headers: jsonApiHeaders(accessToken),
    body: toJsonApiBody(body),
    failOnStatusCode,
  });
}
