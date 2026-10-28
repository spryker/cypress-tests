import {
  buildProbeAuthorizationUrl,
  requestAuthorizationStart,
  blockAgenticCommerceClient,
  container,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  readPrincipal,
  registerAgenticCommerceClient,
} from '@utils';
import { ClientListPage, KillSwitchPage } from '@pages/backoffice';
import { AuthorizationErrorPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import { AgenticCommerceClient, AgenticCommerceStaticFixtures, AgenticCommerceTokens } from '@interfaces/api';

describe(
  'admin-blocks-and-unblocks-client',
  {
    tags: [
      '@backoffice',
      '@yves',
      '@api',
      '@agentic-commerce',
      '@agentic-commerce-cut-6a-1',
      'agentic-commerce',
      'acl',
    ],
  },
  (): void => {
    if (!isAgenticCommerceCutReached('6a-1')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 6a-1', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const clientListPage = container.get(ClientListPage);
    const killSwitchPage = container.get(KillSwitchPage);
    const authorizationErrorPage = container.get(AuthorizationErrorPage);

    let staticFixtures: AgenticCommerceStaticFixtures;
    let dynamicFixtures: AdminBlocksAndUnblocksClientDynamicFixtures;
    let client: AgenticCommerceClient;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
      registerAgenticCommerceClient('AdminBlocks', staticFixtures.redirectUri, staticFixtures.scope).then(
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

    it('blocking a client should end its consents and keep it from starting new ones', (): void => {
      let tokens: AgenticCommerceTokens;

      clientAuthorizationScenario
        .execute({ client, email: staticFixtures.customer.email, password: staticFixtures.defaultPassword })
        .then(({ proofKey, response }) => {
          exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
            tokens = tokenResponse.body;
          });
        });

      userLoginScenario.execute({
        username: staticFixtures.backofficeUser.username,
        password: staticFixtures.backofficeUser.password,
      });
      clientListPage.visit();
      clientListPage.block(client.clientId);
      clientListPage.getFlashMessage().should('contain', 'Client blocked; 1 consents were revoked');

      cy.then(() => {
        readPrincipal(tokens.access_token).its('status').should('equal', 401);
      });

      cy.visit(buildProbeAuthorizationUrl(client));
      authorizationErrorPage.getErrorBox().should('contain', "doesn't allow this app yet");
    });

    it('unblocking a client should let it start new authorizations again', (): void => {
      userLoginScenario.execute({
        username: staticFixtures.backofficeUser.username,
        password: staticFixtures.backofficeUser.password,
      });
      clientListPage.visit();
      clientListPage.unblock(client.clientId);
      clientListPage.getFlashMessage().should('contain', 'Client unblocked');

      requestAuthorizationStart(client).its('status').should('equal', 302);
    });

    it('read-only back office user should see the client but not block it', (): void => {
      userLoginScenario.execute({ username: dynamicFixtures.readOnlyUser.username, password: 'Change123@_!' });

      clientListPage.visit();
      clientListPage.findClient(client.clientId).then((getRow) => {
        expect(getRow).not.to.equal(null);
      });

      cy.visitBackoffice(`/agentic-commerce/agentic-commerce-client/block?client-identifier=${client.clientId}`, {
        failOnStatusCode: false,
      });
      cy.location('pathname').should('not.equal', '/agentic-commerce/agentic-commerce-client/block');
    });

    if (isAgenticCommerceCutReached('6a-2')) {
      it('read-only back office user should be denied the kill switch and scope ceiling changes', (): void => {
        const deniedPaths = [
          '/agentic-commerce/agentic-commerce-kill-switch/disable',
          '/agentic-commerce/agentic-commerce-kill-switch/enable',
          `/agentic-commerce/agentic-commerce-client/edit-scope-ceiling?client-identifier=${client.clientId}`,
        ];

        userLoginScenario.execute({ username: dynamicFixtures.readOnlyUser.username, password: 'Change123@_!' });

        killSwitchPage.visit();
        killSwitchPage.getForm().should('be.visible');
        killSwitchPage.getPageBody().should('contain', 'Delegated access is on in this region.');

        deniedPaths.forEach((deniedPath) => {
          cy.visitBackoffice(deniedPath, { failOnStatusCode: false });
          cy.location('pathname').should('not.equal', deniedPath.split('?')[0]);
        });

        killSwitchPage.visit();
        killSwitchPage.getPageBody().should('contain', 'Delegated access is on in this region.');
        requestAuthorizationStart(client).its('status').should('equal', 302);
      });
    }
  }
);

interface AdminBlocksAndUnblocksClientDynamicFixtures {
  readOnlyUser: { username: string };
}
