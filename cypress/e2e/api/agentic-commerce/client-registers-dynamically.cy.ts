import { ConnectedAppsPage, ConsentPage } from '@pages/yves';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  blockAgenticCommerceClient,
  container,
  isAgenticCommerceCutReached,
  readAuthorizationServerMetadata,
  requestDynamicClientRegistration,
} from '@utils';
import { AgenticCommerceClient, AgenticCommerceDynamicRegistrationStaticFixtures } from '@interfaces/api';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe(
  'client-registers-dynamically',
  { tags: ['@api', '@yves', '@agentic-commerce', '@agentic-commerce-cut-2', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('2')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 2', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const consentPage = container.get(ConsentPage);
    const connectedAppsPage = container.get(ConnectedAppsPage);

    let staticFixtures: AgenticCommerceDynamicRegistrationStaticFixtures;
    let dynamicClient: AgenticCommerceDynamicRegistrationStaticFixtures['dynamicClient'];
    let client: AgenticCommerceClient;
    let softwareId: string;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      ({ dynamicClient } = staticFixtures);
      softwareId = `${dynamicClient.softwareId}-${Date.now()}-${Cypress._.random(1000, 9999)}`;
    });

    after((): void => {
      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    it('authorization server metadata should name the registration endpoint', (): void => {
      readAuthorizationServerMetadata().then((metadataResponse) => {
        expect(metadataResponse.body.registration_endpoint).to.equal(
          `${Cypress.env('glueStorefrontUrl')}/oauth/register`
        );
      });
    });

    it('client should register itself as a public client', (): void => {
      requestDynamicClientRegistration(
        JSON.stringify({
          client_name: dynamicClient.clientName,
          redirect_uris: [staticFixtures.redirectUri],
          software_id: softwareId,
        })
      ).then((registrationResponse) => {
        expect(registrationResponse.status).to.equal(201);
        expect(registrationResponse.headers['cache-control']).to.equal('no-store, private');
        expect(registrationResponse.headers['pragma']).to.equal('no-cache');

        const registration = registrationResponse.body;
        expect(registration.client_id).to.match(UUID_PATTERN);
        expect(registration.client_id_issued_at).to.be.a('number');
        expect(registration.client_name).to.equal(dynamicClient.clientName);
        expect(registration.redirect_uris).to.deep.equal([staticFixtures.redirectUri]);
        expect(registration.grant_types).to.deep.equal(['authorization_code', 'refresh_token']);
        expect(registration.response_types).to.deep.equal(['code']);
        expect(registration.token_endpoint_auth_method).to.equal('none');
        expect(registration.software_id).to.equal(softwareId);

        client = {
          clientId: String(registration.client_id),
          name: dynamicClient.clientName,
          redirectUri: staticFixtures.redirectUri,
          scope: staticFixtures.scope,
        };
      });
    });

    it('customer should see an unverified client without permissions and only be able to deny', (): void => {
      clientAuthorizationScenario.openConsentPage({
        client,
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      consentPage.getConsentBox().should('contain', 'Not verified');
      consentPage
        .getUnverifiedTrustNotice()
        .should('have.text', 'This app registered itself. Check that you trust localhost.');
      consentPage.getClientLogo().should('not.exist');
      consentPage.getNoScopesNotice().should('have.text', 'This app has no permissions configured in this shop.');
      consentPage.getAllowButton().should('not.exist');
      consentPage.getDenyButton().should('be.visible').and('contain', "Don't allow");
    });

    it('client should get access_denied and no connection when the customer denies', (): void => {
      clientAuthorizationScenario
        .execute({
          client,
          email: staticFixtures.customer.email,
          password: staticFixtures.defaultPassword,
          allow: false,
        })
        .then(({ state, response }) => {
          expect(response.error).to.equal('access_denied');
          expect(response.code).to.equal(null);
          expect(response.state).to.equal(state);
          expect(response.issuer).to.equal(Cypress.env('glueStorefrontUrl'));
        });

      connectedAppsPage.visit();
      connectedAppsPage.getList().should('not.contain', client.name);
    });

    it('registration should refuse a body that is not usable client metadata', (): void => {
      const oversizedBody = JSON.stringify({
        client_name: 'x'.repeat(dynamicClient.requestMaxBytes),
        redirect_uris: [staticFixtures.redirectUri],
      });

      [JSON.stringify([staticFixtures.redirectUri]), oversizedBody].forEach((rawBody) => {
        requestDynamicClientRegistration(rawBody).then((registrationResponse) => {
          expect(registrationResponse.status).to.equal(400);
          expect(registrationResponse.body.error).to.equal('invalid_client_metadata');
        });
      });
    });

    // The cut 2 design names `invalid_redirect_uri` for missing `redirect_uris`, so `{}` is refused with it.
    it('registration should refuse an empty client metadata object', (): void => {
      requestDynamicClientRegistration(JSON.stringify({})).then((registrationResponse) => {
        expect(registrationResponse.status).to.equal(400);
        expect(registrationResponse.body.error).to.equal('invalid_redirect_uri');
      });
    });

    it('registration should refuse a redirect URI on a host outside the allowlist', (): void => {
      requestDynamicClientRegistration(
        JSON.stringify({
          client_name: dynamicClient.clientName,
          redirect_uris: [dynamicClient.foreignRedirectUri],
          software_id: softwareId,
        })
      ).then((registrationResponse) => {
        expect(registrationResponse.status).to.equal(400);
        expect(registrationResponse.body.error).to.equal('invalid_redirect_uri');
      });
    });
  }
);
