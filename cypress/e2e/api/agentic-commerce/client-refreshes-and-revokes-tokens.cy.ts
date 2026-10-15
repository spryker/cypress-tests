import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  blockAgenticCommerceClient,
  container,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  readPrincipal,
  refreshTokens,
  registerAgenticCommerceClient,
  revokeToken,
} from '@utils';
import { AgenticCommerceClient, AgenticCommerceStaticFixtures } from '@interfaces/api';

describe(
  'client-refreshes-and-revokes-tokens',
  { tags: ['@api', '@yves', '@agentic-commerce', '@agentic-commerce-cut-1', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('1')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 1', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);

    let staticFixtures: AgenticCommerceStaticFixtures;
    let client: AgenticCommerceClient;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerAgenticCommerceClient('ClientRefreshes', staticFixtures.redirectUri, staticFixtures.scope).then(
        (registeredClient) => {
          client = registeredClient;
        }
      );
    });

    after((): void => {
      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    it('client should refresh its tokens and lose access after revoking the refresh token', (): void => {
      clientAuthorizationScenario
        .execute({ client, email: staticFixtures.customer.email, password: staticFixtures.defaultPassword })
        .then(({ proofKey, response }) => exchangeAuthorizationCode(client, String(response.code), proofKey))
        .then((tokenResponse) =>
          refreshTokens(client, tokenResponse.body.refresh_token).then((refreshResponse) => {
            expect(refreshResponse.status).to.equal(200);
            expect(refreshResponse.body.refresh_token).not.to.equal(tokenResponse.body.refresh_token);
            expect(refreshResponse.body.scope).to.equal(staticFixtures.scope);

            return refreshResponse.body;
          })
        )
        .then((refreshedTokens) => {
          readPrincipal(refreshedTokens.access_token).its('status').should('equal', 200);

          revokeToken(client, refreshedTokens.refresh_token).its('status').should('equal', 200);

          readPrincipal(refreshedTokens.access_token).its('status').should('equal', 401);
          refreshTokens(client, refreshedTokens.refresh_token).its('status').should('equal', 400);
        });
    });
  }
);
