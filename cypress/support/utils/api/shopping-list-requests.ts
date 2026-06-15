import { authHeaders } from './auth';

const itemsUrl = (shoppingListId: string): string =>
  `${Cypress.env().glueUrl}/shopping-lists/${shoppingListId}/shopping-list-items`;

/**
 * Adds an item to the shopping list (`POST /shopping-lists/{id}/shopping-list-items`).
 */
export function addShoppingListItem(
  accessToken: string,
  shoppingListId: string,
  body: Record<string, unknown>,
  failOnStatusCode = true
): Cypress.Chainable {
  return cy.request({
    method: 'POST',
    url: itemsUrl(shoppingListId),
    headers: authHeaders(accessToken),
    failOnStatusCode,
    body,
  });
}

/**
 * Updates a shopping list item (`PATCH /shopping-lists/{id}/shopping-list-items/{itemId}`).
 */
export function updateShoppingListItem(
  accessToken: string,
  shoppingListId: string,
  itemId: string,
  body: Record<string, unknown>
): Cypress.Chainable {
  return cy.request({
    method: 'PATCH',
    url: `${itemsUrl(shoppingListId)}/${itemId}`,
    headers: authHeaders(accessToken),
    body,
  });
}

/**
 * Deletes a shopping list item (`DELETE /shopping-lists/{id}/shopping-list-items/{itemId}`).
 */
export function deleteShoppingListItem(
  accessToken: string,
  shoppingListId: string,
  itemId: string
): Cypress.Chainable {
  return cy.request({
    method: 'DELETE',
    url: `${itemsUrl(shoppingListId)}/${itemId}`,
    headers: authHeaders(accessToken),
  });
}

/**
 * Reads the shopping list (`GET /shopping-lists/{id}` with optional `include`).
 */
export function getShoppingList(accessToken: string, shoppingListId: string, include?: string): Cypress.Chainable {
  const query = include ? `?include=${include}` : '';

  return cy.request({
    method: 'GET',
    url: `${Cypress.env().glueUrl}/shopping-lists/${shoppingListId}${query}`,
    headers: authHeaders(accessToken),
  });
}
