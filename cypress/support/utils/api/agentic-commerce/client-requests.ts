import {
  AgenticCommerceAuthorizationResponse,
  AgenticCommerceClient,
  AgenticCommerceClientRegistration,
  AgenticCommerceProofKey,
  AgenticCommerceTokens,
} from '../../../types/api/agentic-commerce';

const AUTHORIZATION_RESPONSE_ALIAS = 'agenticCommerceAuthorizationResponse';

// RFC 7636 appendix B example; a malformed challenge renders an error page instead of redirecting.
const PROBE_PROOF_KEY: AgenticCommerceProofKey = {
  verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
  challenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
};

const resourceUrl = (): string => `${Cypress.env().glueStorefrontUrl}/agentic-commerce`;

/**
 * Registers a pre-registered public client through the console. The dynamic-fixtures endpoint
 * answers 201 even when the command fails, so the registration is confirmed by `/connect/authorize`,
 * which redirects to the login for a known client and shows an error page otherwise.
 */
export function registerAgenticCommerceClient(
  name: string,
  redirectUri: string,
  scope: string
): Cypress.Chainable<AgenticCommerceClient> {
  const runToken = `${Date.now()}-${Cypress._.random(1000, 9999)}`;
  const client: AgenticCommerceClient = {
    clientId: `e2e-${name}-${runToken}`.toLowerCase(),
    name: `${name}-${runToken}`,
    redirectUri,
    scope,
  };

  cy.runCliCommands([
    `vendor/bin/console agentic-commerce:client:register --client-id=${client.clientId} --name=${client.name} --redirect-uri=${redirectUri} --scope=${scope}`,
  ]);

  return requestAuthorizationStart(client).then((response) => {
    if (response.status !== 302) {
      throw new Error(`Client "${client.clientId}" was not registered.`);
    }

    return client;
  });
}

/**
 * Starts an authorization without a browser: `302` to the login for a client that may connect,
 * `200` with an error page for an unknown or blocked client.
 */
export function requestAuthorizationStart(client: AgenticCommerceClient): Cypress.Chainable<Cypress.Response<string>> {
  return cy.request({
    url: buildAuthorizationUrl(client, PROBE_PROOF_KEY, 'authorization-start'),
    followRedirect: false,
    failOnStatusCode: false,
  });
}

export function buildProbeAuthorizationUrl(client: AgenticCommerceClient): string {
  return buildAuthorizationUrl(client, PROBE_PROOF_KEY, 'authorization-start');
}

/**
 * Posts a raw body to the Dynamic Client Registration endpoint (RFC 7591), so a test can also send
 * what is not a JSON object.
 */
export function requestDynamicClientRegistration(
  rawBody: string
): Cypress.Chainable<Cypress.Response<AgenticCommerceClientRegistration>> {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env().glueStorefrontUrl}/oauth/register`,
    headers: { 'Content-Type': 'application/json' },
    body: rawBody,
    failOnStatusCode: false,
  });
}

/**
 * Replaces the scopes the client may ever request, so the consent page can offer more than the
 * `principal-read` scope the client was registered with.
 */
export function setAgenticCommerceScopeCeiling(client: AgenticCommerceClient, scopes: string[]): void {
  const scopeOptions = scopes.map((scope) => `--scope=${scope}`).join(' ');

  cy.runCliCommands([
    `vendor/bin/console agentic-commerce:client:set-scope-ceiling --client-id=${client.clientId} ${scopeOptions}`,
  ]);
}

export function blockAgenticCommerceClient(client: AgenticCommerceClient): void {
  cy.runCliCommands([`vendor/bin/console agentic-commerce:client:block --client-id=${client.clientId}`]);
}

export function createProofKey(): Cypress.Chainable<AgenticCommerceProofKey> {
  return cy.task<AgenticCommerceProofKey>('createProofKey');
}

export function buildAuthorizationUrl(
  client: AgenticCommerceClient,
  proofKey: AgenticCommerceProofKey,
  state: string
): string {
  const query = new URLSearchParams({
    response_type: 'code',
    client_id: client.clientId,
    redirect_uri: client.redirectUri,
    scope: client.scope,
    state,
    code_challenge: proofKey.challenge,
    code_challenge_method: 'S256',
    resource: resourceUrl(),
  });

  return `/connect/authorize?${query.toString()}`;
}

/**
 * The consent page redirects the browser to the client's redirect URI; nothing listens there,
 * so the request is answered here and read back by `readAuthorizationResponse()`.
 */
export function interceptAuthorizationResponse(client: AgenticCommerceClient): void {
  cy.intercept('GET', `${client.redirectUri}*`, {
    statusCode: 200,
    body: '<html><body>Authorization response received by the client.</body></html>',
  }).as(AUTHORIZATION_RESPONSE_ALIAS);
}

export function readAuthorizationResponse(): Cypress.Chainable<AgenticCommerceAuthorizationResponse> {
  return cy.wait(`@${AUTHORIZATION_RESPONSE_ALIAS}`).then((interception) => {
    const parameters = new URL(interception.request.url).searchParams;

    return {
      code: parameters.get('code'),
      error: parameters.get('error'),
      state: parameters.get('state'),
      issuer: parameters.get('iss'),
    };
  });
}

export function exchangeAuthorizationCode(
  client: AgenticCommerceClient,
  code: string,
  proofKey: AgenticCommerceProofKey
): Cypress.Chainable<Cypress.Response<AgenticCommerceTokens>> {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env().glueStorefrontUrl}/oauth/token`,
    form: true,
    failOnStatusCode: false,
    body: {
      grant_type: 'authorization_code',
      code,
      code_verifier: proofKey.verifier,
      redirect_uri: client.redirectUri,
      client_id: client.clientId,
      resource: resourceUrl(),
    },
  });
}

export function refreshTokens(
  client: AgenticCommerceClient,
  refreshToken: string
): Cypress.Chainable<Cypress.Response<AgenticCommerceTokens>> {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env().glueStorefrontUrl}/oauth/token`,
    form: true,
    failOnStatusCode: false,
    body: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: client.clientId,
      resource: resourceUrl(),
    },
  });
}

export function revokeToken(
  client: AgenticCommerceClient,
  token: string
): Cypress.Chainable<Cypress.Response<unknown>> {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env().glueStorefrontUrl}/oauth/revoke`,
    form: true,
    failOnStatusCode: false,
    body: { token, client_id: client.clientId },
  });
}

export function readPrincipal(accessToken?: string): Cypress.Chainable<Cypress.Response<PrincipalResponseBody>> {
  return cy.request({
    url: `${resourceUrl()}/principal`,
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    failOnStatusCode: false,
  });
}

export function readAuthorizationServerMetadata(): Cypress.Chainable<Cypress.Response<Record<string, unknown>>> {
  return cy.request(`${Cypress.env().glueStorefrontUrl}/.well-known/oauth-authorization-server`);
}

export function readResourceMetadata(url: string): Cypress.Chainable<Cypress.Response<Record<string, unknown>>> {
  return cy.request(url);
}

interface PrincipalResponseBody {
  data: {
    type: string;
    attributes: {
      consent: string;
      clientId: string;
      principalType: string;
      principalReference: string;
      scopes: string[];
      store: string;
    };
  };
}
