import { authHeaders } from './auth';

const cartUrl = (cartId: string): string => `${Cypress.env().glueUrl}/carts/${cartId}`;

/**
 * Adds an item to the cart (`POST /carts/{cartId}/items?include=items`).
 */
export function addCartItem(
  accessToken: string,
  cartId: string,
  body: Record<string, unknown>,
  failOnStatusCode = true
): Cypress.Chainable {
  return cy.request({
    method: 'POST',
    url: `${cartUrl(cartId)}/items?include=items`,
    headers: authHeaders(accessToken),
    failOnStatusCode,
    body,
  });
}

/**
 * Updates a cart item (`PATCH /carts/{cartId}/items/{itemId}?include=items`).
 */
export function updateCartItem(
  accessToken: string,
  cartId: string,
  itemId: string,
  body: Record<string, unknown>
): Cypress.Chainable {
  return cy.request({
    method: 'PATCH',
    url: `${cartUrl(cartId)}/items/${itemId}?include=items`,
    headers: authHeaders(accessToken),
    body,
  });
}

/**
 * Deletes a cart item (`DELETE /carts/{cartId}/items/{itemId}`).
 */
export function deleteCartItem(accessToken: string, cartId: string, itemId: string): Cypress.Chainable {
  return cy.request({
    method: 'DELETE',
    url: `${cartUrl(cartId)}/items/${itemId}`,
    headers: authHeaders(accessToken),
  });
}

/**
 * Reads the cart with its items (`GET /carts/{cartId}?include=items`).
 */
export function getCart(accessToken: string, cartId: string): Cypress.Chainable {
  return cy.request({
    method: 'GET',
    url: `${cartUrl(cartId)}?include=items`,
    headers: authHeaders(accessToken),
  });
}
