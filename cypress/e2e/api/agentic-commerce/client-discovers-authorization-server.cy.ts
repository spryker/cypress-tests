import {
  isAgenticCommerceCutReached,
  readAuthorizationServerMetadata,
  readPrincipal,
  readResourceMetadata,
} from '@utils';
import { AgenticCommerceStaticFixtures } from '@interfaces/api';

describe(
  'client-discovers-authorization-server',
  { tags: ['@api', '@agentic-commerce', '@agentic-commerce-cut-1', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('1')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 1', () => {});
      return;
    }

    let staticFixtures: AgenticCommerceStaticFixtures;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
    });

    it('client without a token should be pointed to the authorization server', (): void => {
      readPrincipal().then((principalResponse) => {
        expect(principalResponse.status).to.equal(401);

        const resourceMetadataUrl = /resource_metadata="([^"]+)"/.exec(
          String(principalResponse.headers['www-authenticate'])
        )?.[1];
        expect(resourceMetadataUrl).to.be.a('string');

        readResourceMetadata(String(resourceMetadataUrl)).then((resourceMetadataResponse) => {
          expect(resourceMetadataResponse.body.authorization_servers).to.deep.equal([Cypress.env('glueStorefrontUrl')]);
          expect(resourceMetadataResponse.body.scopes_supported).to.include(staticFixtures.scope);
        });
      });
    });

    it('authorization server metadata should name the endpoints the client needs', (): void => {
      readAuthorizationServerMetadata().then((metadataResponse) => {
        expect(metadataResponse.body.issuer).to.equal(Cypress.env('glueStorefrontUrl'));
        expect(metadataResponse.body.authorization_endpoint).to.equal(`${Cypress.config('baseUrl')}/connect/authorize`);
        expect(metadataResponse.body.token_endpoint).to.equal(`${Cypress.env('glueStorefrontUrl')}/oauth/token`);
        expect(metadataResponse.body.revocation_endpoint).to.equal(`${Cypress.env('glueStorefrontUrl')}/oauth/revoke`);
        expect(metadataResponse.body.code_challenge_methods_supported).to.deep.equal(['S256']);
        expect(metadataResponse.body.scopes_supported).to.include(staticFixtures.scope);
      });
    });
  }
);

describe(
  'client-without-token-is-pointed-to-the-metadata',
  { tags: ['@api', '@agentic-commerce', '@agentic-commerce-cut-3', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('3')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 3', () => {});
      return;
    }

    let staticFixtures: AgenticCommerceStaticFixtures;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
    });

    it('the challenge should name the metadata of the resource and the scopes it needs', (): void => {
      readPrincipal().then((principalResponse) => {
        expect(principalResponse.status).to.equal(401);
        expect(principalResponse.headers['www-authenticate']).to.equal(
          `Bearer resource_metadata="${Cypress.env('glueStorefrontUrl')}/.well-known/oauth-protected-resource/agentic-commerce", ` +
            `scope="${staticFixtures.scope}"`
        );
      });
    });

    it('the metadata of the resource should list the scopes the challenge names', (): void => {
      readPrincipal().then((principalResponse) => {
        const resourceMetadataUrl = /resource_metadata="([^"]+)"/.exec(
          String(principalResponse.headers['www-authenticate'])
        )?.[1];
        expect(resourceMetadataUrl).to.be.a('string');

        readResourceMetadata(String(resourceMetadataUrl)).then((resourceMetadataResponse) => {
          expect(resourceMetadataResponse.status).to.equal(200);
          expect(resourceMetadataResponse.body.resource).to.equal(
            `${Cypress.env('glueStorefrontUrl')}/agentic-commerce`
          );
          expect(resourceMetadataResponse.body.authorization_servers).to.deep.equal([Cypress.env('glueStorefrontUrl')]);
          expect(resourceMetadataResponse.body.bearer_methods_supported).to.deep.equal(['header']);
          expect(resourceMetadataResponse.body.scopes_supported).to.deep.equal([staticFixtures.scope]);
        });
      });
    });

    it('a path that belongs to no declared resource should have no metadata', (): void => {
      cy.request({
        url: `${Cypress.env('glueStorefrontUrl')}/.well-known/oauth-protected-resource/no-such-resource`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });

    it('authorization server metadata should keep listing the scope of the resource', (): void => {
      readAuthorizationServerMetadata().then((metadataResponse) => {
        expect(metadataResponse.body.scopes_supported).to.include(staticFixtures.scope);
      });
    });
  }
);
