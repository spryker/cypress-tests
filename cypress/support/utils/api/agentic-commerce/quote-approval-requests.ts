import { authHeaders } from '../auth';

const QUOTE_APPROVAL_STATUS_WAITING = 'waiting';

const storefrontUrl = (path: string): string => `${Cypress.env().glueStorefrontUrl}${path}`;

const storefrontHeaders = (accessToken: string): Record<string, string> => ({
  ...authHeaders(accessToken),
  Accept: 'application/vnd.api+json',
});

const postStorefront = (
  accessToken: string,
  path: string,
  type: string,
  attributes: Record<string, unknown>
): Cypress.Chainable<Cypress.Response<StorefrontItemBody>> =>
  cy.request({
    method: 'POST',
    url: storefrontUrl(path),
    headers: storefrontHeaders(accessToken),
    failOnStatusCode: false,
    body: { data: { type, attributes } },
  });

const getStorefront = (
  accessToken: string,
  path: string
): Cypress.Chainable<Cypress.Response<StorefrontCollectionBody>> =>
  cy.request({
    method: 'GET',
    url: storefrontUrl(path),
    headers: storefrontHeaders(accessToken),
    failOnStatusCode: false,
  });

/**
 * Lists who may approve the cart (`GET /carts/{cartUuid}/quote-approvers`).
 */
export function getQuoteApprovers(
  accessToken: string,
  cartUuid: string
): Cypress.Chainable<Cypress.Response<StorefrontCollectionBody>> {
  return getStorefront(accessToken, `/carts/${cartUuid}/quote-approvers`);
}

/**
 * Sends the cart for approval (`POST /carts/{cartUuid}/quote-approvals`) with the approver and the
 * same checkout data the `checkout` resource takes.
 */
export function requestQuoteApproval(
  accessToken: string,
  cartUuid: string,
  attributes: QuoteApprovalRequestAttributes
): Cypress.Chainable<Cypress.Response<StorefrontItemBody>> {
  return postStorefront(accessToken, `/carts/${cartUuid}/quote-approvals`, 'quote-approvals', { ...attributes });
}

/**
 * Reads the cart's approvals and, in `meta.cartApprovalStatus`, the cart's approval status
 * (`GET /carts/{cartUuid}/quote-approvals`).
 */
export function getQuoteApprovals(
  accessToken: string,
  cartUuid: string
): Cypress.Chainable<Cypress.Response<StorefrontCollectionBody>> {
  return getStorefront(accessToken, `/carts/${cartUuid}/quote-approvals`);
}

/**
 * Cancels an approval request (`POST /carts/{cartUuid}/quote-approvals/{quoteApprovalId}/cancel`).
 */
export function cancelQuoteApproval(
  accessToken: string,
  cartUuid: string,
  quoteApprovalId: string
): Cypress.Chainable<Cypress.Response<StorefrontItemBody>> {
  return postStorefront(
    accessToken,
    `/carts/${cartUuid}/quote-approvals/${quoteApprovalId}/cancel`,
    'quote-approval-cancel',
    {}
  );
}

/**
 * Cancels every approval of the cart that still waits, so the cart is unlocked again; for `after` hooks.
 */
export function cancelWaitingQuoteApprovals(accessToken: string, cartUuid: string): void {
  getQuoteApprovals(accessToken, cartUuid).then((response) => {
    (response.body?.data ?? [])
      .filter((quoteApproval) => quoteApproval.attributes?.status === QUOTE_APPROVAL_STATUS_WAITING)
      .forEach((quoteApproval) => cancelQuoteApproval(accessToken, cartUuid, String(quoteApproval.id)));
  });
}

/**
 * Creates a draft quote request from the cart (`POST /quote-requests`).
 */
export function createQuoteRequest(
  accessToken: string,
  cartUuid: string
): Cypress.Chainable<Cypress.Response<StorefrontItemBody>> {
  return postStorefront(accessToken, '/quote-requests', 'quote-requests', { cartUuid });
}

/**
 * Sends the quote request to the sales representative
 * (`POST /quote-requests/{quoteRequestReference}/quote-request-send-to-user`).
 */
export function sendQuoteRequestToUser(
  accessToken: string,
  quoteRequestReference: string
): Cypress.Chainable<Cypress.Response<StorefrontItemBody>> {
  return postStorefront(
    accessToken,
    `/quote-requests/${quoteRequestReference}/quote-request-send-to-user`,
    'quote-request-send-to-user',
    {}
  );
}

/**
 * Cancels the quote request (`POST /quote-requests/{quoteRequestReference}/quote-request-cancel`).
 */
export function cancelQuoteRequest(
  accessToken: string,
  quoteRequestReference: string
): Cypress.Chainable<Cypress.Response<StorefrontItemBody>> {
  return postStorefront(
    accessToken,
    `/quote-requests/${quoteRequestReference}/quote-request-cancel`,
    'quote-request-cancel',
    {}
  );
}

export interface QuoteApprovalRequestAttributes {
  approverCompanyUserUuid: string;
  billingAddress: Record<string, unknown>;
  shippingAddress: Record<string, unknown>;
  shipment: { idShipmentMethod: number };
  payments: Array<Record<string, unknown>>;
}

export interface StorefrontResource {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
}

export interface StorefrontError {
  code: string;
  status: number;
  detail: string;
}

export interface StorefrontItemBody {
  data: StorefrontResource;
  errors?: StorefrontError[];
}

export interface StorefrontCollectionBody {
  data: StorefrontResource[];
  meta?: Record<string, unknown>;
  errors?: StorefrontError[];
}

/**
 * Sends a state-changing request only once per test, so a retried test asserts the response of its first attempt
 * instead of repeating a change that already happened.
 */
export function requestOnce<T>(
  recordedResponse: Cypress.Response<T> | undefined,
  sendRequest: () => Cypress.Chainable<Cypress.Response<T>>
): Cypress.Chainable<Cypress.Response<T>> {
  if (recordedResponse !== undefined) {
    return cy.wrap(recordedResponse, { log: false });
  }

  return sendRequest();
}

/**
 * Returns a value an earlier test was expected to set, or fails with its name instead of building an `undefined` URL.
 */
export function requireTestValue(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} is not set: the earlier test that sets it did not pass.`);
  }

  return value;
}
