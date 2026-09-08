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
  params: {
    page?: number;
    perPage?: number;
    filterSku?: string;
    filterSkus?: string[];
    filterAbstractSku?: string;
  } = {},
  failOnStatusCode = true
): Cypress.Chainable {
  // The query string is built by hand rather than via `qs` so the repeated-array form is exact:
  // JSON:API filter keys must be `filter[<resource>.<field>]`, and a key without the resource prefix
  // is rejected upstream with a 400.
  const queryParameters: string[] = [];
  const addParameter = (key: string, value: string | number): void => {
    queryParameters.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  };

  if (params.page) {
    addParameter('page', params.page);
  }
  if (params.perPage) {
    addParameter('perPage', params.perPage);
  }
  if (params.filterSku) {
    addParameter('filter[products.sku]', params.filterSku);
  }
  (params.filterSkus ?? []).forEach((sku) => addParameter('filter[products.skus][]', sku));
  if (params.filterAbstractSku) {
    addParameter('filter[products.abstractSku]', params.filterAbstractSku);
  }

  const url = queryParameters.length ? `${productsUrl()}?${queryParameters.join('&')}` : productsUrl();

  return cy.request({
    method: 'GET',
    url,
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
