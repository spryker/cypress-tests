import { requestAuthorizationStart, blockAgenticCommerceClient, container, isAgenticCommerceCutReached } from '@utils';
import { ClientCreatePage, ClientListPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AgenticCommerceClient, AgenticCommerceStaticFixtures } from '@interfaces/api';

describe(
  'admin-registers-client',
  { tags: ['@backoffice', '@yves', '@agentic-commerce', '@agentic-commerce-cut-6a-1', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('6a-1')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 6a-1', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const clientListPage = container.get(ClientListPage);
    const clientCreatePage = container.get(ClientCreatePage);

    let staticFixtures: AgenticCommerceStaticFixtures;
    let client: AgenticCommerceClient;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.backofficeUser.username,
        password: staticFixtures.backofficeUser.password,
      });
    });

    after((): void => {
      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    it('back office user should register a client and see it in the client list', (): void => {
      const runToken = `${Date.now()}-${Cypress.currentRetry}`;
      client = {
        clientId: `e2e-registered-in-back-office-${runToken}`,
        name: `RegisteredInBackOffice-${runToken}`,
        redirectUri: staticFixtures.redirectUri,
        scope: staticFixtures.scope,
      };

      clientListPage.visit();
      clientListPage.getRegisterClientButton().click();

      clientCreatePage.register(client);

      cy.location('pathname').should('equal', '/agentic-commerce/agentic-commerce-client');
      clientListPage.getFlashMessage().should('contain', 'Client registered');
      clientListPage.findClient(client.clientId).then((getRow) => {
        expect(getRow).not.to.equal(null);
      });
    });

    it('registered client should be able to start an authorization', (): void => {
      requestAuthorizationStart(client).its('status').should('equal', 302);
    });
  }
);
