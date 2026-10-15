import { ConnectedAppsPage, ConsentPage } from '@pages/yves';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  blockAgenticCommerceClient,
  container,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  readPrincipal,
  registerAgenticCommerceClient,
} from '@utils';
import { AgenticCommerceClient, AgenticCommerceStaticFixtures } from '@interfaces/api';

describe(
  'company-user-connects-client',
  { tags: ['@yves', '@api', '@agentic-commerce', '@agentic-commerce-cut-1', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('1')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 1', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const consentPage = container.get(ConsentPage);
    const connectedAppsPage = container.get(ConnectedAppsPage);

    let staticFixtures: AgenticCommerceStaticFixtures;
    let client: AgenticCommerceClient;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerAgenticCommerceClient('CompanyUserConnects', staticFixtures.redirectUri, staticFixtures.scope).then(
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

    it('company user should be offered to act as the company user', (): void => {
      clientAuthorizationScenario.openConsentPage({
        client,
        email: staticFixtures.companyUser.email,
        password: staticFixtures.defaultPassword,
      });

      consentPage.getPrincipalSelect().find('option').should('have.length', 1);
      consentPage.getPrincipalSelect().should('contain', staticFixtures.companyUser.companyName);
    });

    it('company user should connect the client and the client should act as the company user', (): void => {
      clientAuthorizationScenario
        .execute({ client, email: staticFixtures.companyUser.email, password: staticFixtures.defaultPassword })
        .then(({ proofKey, response }) => {
          exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
            expect(tokenResponse.status).to.equal(200);

            readPrincipal(tokenResponse.body.access_token).then((principalResponse) => {
              expect(principalResponse.status).to.equal(200);
              expect(principalResponse.body.data.attributes.principalType).to.equal('company_user');
            });
          });
        });

      connectedAppsPage.visit();
      connectedAppsPage.getConnectedAppPrincipal(client.name).should('contain', staticFixtures.companyUser.companyName);
    });
  }
);
